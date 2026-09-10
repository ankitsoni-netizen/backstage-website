import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

import { slugifyName } from "../src/lib/admin/slug";
import type { Creator, Database } from "../src/types/database";

const DEFAULT_FILE = "data/backstage-roster.xlsx";
const DEFAULT_CATEGORY = "Needs classification";
const EXPECTED_HEADERS = ["Creator Name", "Links", "TM", "Content Note"] as const;

type CliOptions = {
  file: string;
  importMode: boolean;
  overwrite: boolean;
};

type SourceRow = {
  contentNote: string;
  creatorName: string;
  links: string;
  rowNumber: number;
  tm: string;
};

type LinkParse = {
  extra: string[];
  handle: string | null;
  issues: string[];
  url: string | null;
};

type MappedCreator = {
  bio: string | null;
  display_name: string;
  featured: false;
  instagram_handle: string | null;
  instagram_url: string | null;
  manager_name: string | null;
  name: string;
  primary_category: typeof DEFAULT_CATEGORY;
  short_bio: string | null;
  slug: string;
  sort_order: number;
  status: "draft";
};

type RowIssue = {
  kind: "blank_required" | "duplicate_name" | "duplicate_instagram" | "malformed_link" | "duplicate_slug";
  message: string;
  rowNumber: number;
};

type PlannedAction = "insert" | "update" | "skip-edited" | "skip-invalid";

type PlannedRow = {
  action: PlannedAction;
  existing: Creator | null;
  issues: string[];
  mapped: MappedCreator | null;
  source: SourceRow;
};

function parseArgs(argv: string[]): CliOptions {
  const importMode = argv.includes("--import");
  const overwrite = argv.includes("--overwrite");
  const fileFlag = argv.findIndex((value) => value === "--file");
  const file =
    fileFlag >= 0 && argv[fileFlag + 1] ? argv[fileFlag + 1] : DEFAULT_FILE;

  if (importMode && argv.includes("--dry-run")) {
    throw new Error("Use either --dry-run or --import, not both.");
  }

  return {
    file,
    importMode,
    overwrite,
  };
}

function cellText(value: unknown): string {
  if (value == null) {
    return "";
  }

  return String(value).replace(/\r\n/g, "\n").trim();
}

function headerIndex(headers: string[], expected: string): number {
  const wanted = expected.trim().toLowerCase();
  return headers.findIndex((header) => header.trim().toLowerCase() === wanted);
}

function firstUsefulSentence(text: string): string | null {
  const cleaned = text.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return null;
  }

  const match = cleaned.match(/[.!?](?:\s|$)/);
  const end = match?.index;
  const sentence = (end != null ? cleaned.slice(0, end + 1) : cleaned)
    .replace(/\s+/g, " ")
    .trim();

  if (sentence.length < 12) {
    return null;
  }

  return sentence.slice(0, 280);
}

function parseInstagramLink(raw: string): LinkParse {
  const issues: string[] = [];
  const extra: string[] = [];

  if (!raw) {
    return { extra, handle: null, issues, url: null };
  }

  const tokens = raw
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  let chosen: string | null = null;

  for (const token of tokens) {
    const normalized = normalizeInstagramToken(token);

    if (!normalized.ok) {
      issues.push(normalized.issue);
      continue;
    }

    if (!chosen) {
      chosen = normalized.url;
    } else if (normalized.url !== chosen) {
      extra.push(normalized.url);
    }
  }

  if (extra.length > 0) {
    issues.push(`Extra link(s) ignored: ${extra.join(", ")}`);
  }

  if (!chosen && tokens.length > 0 && issues.length === 0) {
    issues.push(`Could not parse link: ${raw}`);
  }

  return {
    extra,
    handle: chosen ? instagramHandleFromUrl(chosen) : null,
    issues,
    url: chosen,
  };
}

function normalizeInstagramToken(
  token: string,
): { issue: string; ok: false } | { ok: true; url: string } {
  const trimmed = token.replace(/[)>.,]+$/g, "");

  if (trimmed.startsWith("@") && /^@[a-z0-9._]{2,30}$/i.test(trimmed)) {
    return {
      ok: true,
      url: `https://www.instagram.com/${trimmed.slice(1)}/`,
    };
  }

  if (/^[a-z0-9._]{2,30}$/i.test(trimmed) && !trimmed.includes("://")) {
    return {
      ok: true,
      url: `https://www.instagram.com/${trimmed}/`,
    };
  }

  let candidate = trimmed;

  if (!/^https?:\/\//i.test(candidate) && /instagram\.com/i.test(candidate)) {
    candidate = `https://${candidate.replace(/^\/+/, "")}`;
  }

  try {
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { issue: `Unsupported protocol in ${token}`, ok: false };
    }

    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host !== "instagram.com" && host !== "instagr.am") {
      return { issue: `Not an Instagram URL: ${token}`, ok: false };
    }

    const handle = url.pathname.split("/").filter(Boolean)[0];

    if (!handle || !/^[a-z0-9._]{2,30}$/i.test(handle)) {
      return { issue: `Missing Instagram handle in ${token}`, ok: false };
    }

    return { ok: true, url: `https://www.instagram.com/${handle}/` };
  } catch {
    return { issue: `Malformed link: ${token}`, ok: false };
  }
}

function instagramHandleFromUrl(url: string): string | null {
  try {
    const handle = new URL(url).pathname.split("/").filter(Boolean)[0];
    return handle ? handle.toLowerCase() : null;
  } catch {
    return null;
  }
}

function uniqueSlug(base: string, used: Set<string>): string {
  const fallback = base || "creator";
  let slug = fallback;
  let n = 2;

  while (used.has(slug)) {
    slug = `${fallback}-${n}`.slice(0, 120);
    n += 1;
  }

  used.add(slug);
  return slug;
}

function isManuallyEdited(creator: Creator): boolean {
  const classified =
    Boolean(creator.primary_category?.trim()) &&
    creator.primary_category !== DEFAULT_CATEGORY;
  const extraCategories = (creator.categories ?? []).some(
    (category) => category.trim() && category.trim() !== DEFAULT_CATEGORY,
  );

  return (
    creator.status !== "draft" ||
    creator.featured ||
    Boolean(creator.profile_image_path) ||
    Boolean(creator.hero_image_path) ||
    Boolean(creator.city?.trim()) ||
    Boolean(creator.youtube_url) ||
    creator.instagram_followers != null ||
    creator.youtube_subscribers != null ||
    Boolean(creator.seo_title) ||
    Boolean(creator.seo_description) ||
    Boolean(creator.published_at) ||
    classified ||
    extraCategories
  );
}

function readWorkbook(filePath: string) {
  if (!existsSync(filePath)) {
    throw new Error(`Workbook not found: ${filePath}`);
  }

  const stats = statSync(filePath);

  if (stats.size === 0) {
    throw new Error(
      `Workbook is empty (0 bytes): ${filePath}. Replace it with the Backstage roster spreadsheet. The source file was not modified.`,
    );
  }

  const bytes = readFileSync(filePath);
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;

  return isZip
    ? XLSX.read(bytes, { cellDates: false, raw: false, type: "buffer" })
    : XLSX.read(bytes.toString("utf8"), { raw: false, type: "string" });
}

function loadSourceRows(filePath: string): {
  headers: string[];
  rows: SourceRow[];
  sheetName: string;
  sheetNames: string[];
} {
  const workbook = readWorkbook(filePath);
  const sheetNames = workbook.SheetNames;

  if (sheetNames.length === 0) {
    throw new Error("Workbook has no sheets.");
  }

  const sheetName = sheetNames[0] ?? "";
  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    defval: "",
    header: 1,
    raw: false,
  });

  const headerRow = (matrix[0] ?? []).map((value) => cellText(value));
  const nameIdx = headerIndex(headerRow, "Creator Name");
  const linksIdx = headerIndex(headerRow, "Links");
  const tmIdx = headerIndex(headerRow, "TM");
  const noteIdx = headerIndex(headerRow, "Content Note");
  const missing = EXPECTED_HEADERS.filter(
    (header) => headerIndex(headerRow, header) === -1,
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing expected headers on "${sheetName}": ${missing.join(", ")}. Found: ${headerRow.filter(Boolean).join(", ") || "(none)"}`,
    );
  }

  const rows: SourceRow[] = [];

  for (let index = 1; index < matrix.length; index += 1) {
    const line = matrix[index] ?? [];
    const creatorName = cellText(line[nameIdx]);
    const links = cellText(line[linksIdx]);
    const tm = cellText(line[tmIdx]);
    const contentNote = cellText(line[noteIdx]);

    if (!creatorName && !links && !tm && !contentNote) {
      continue;
    }

    rows.push({
      contentNote,
      creatorName,
      links,
      rowNumber: index + 1,
      tm,
    });
  }

  return {
    headers: headerRow.filter(Boolean),
    rows,
    sheetName,
    sheetNames,
  };
}

function planRows(sourceRows: SourceRow[]): {
  issues: RowIssue[];
  planned: PlannedRow[];
} {
  const issues: RowIssue[] = [];
  const planned: PlannedRow[] = [];
  const nameCount = new Map<string, number[]>();
  const urlCount = new Map<string, number[]>();
  const usedSlugs = new Set<string>();

  for (const source of sourceRows) {
    const nameKey = source.creatorName.toLowerCase();

    if (source.creatorName) {
      const rows = nameCount.get(nameKey) ?? [];
      rows.push(source.rowNumber);
      nameCount.set(nameKey, rows);
    }
  }

  for (const source of sourceRows) {
    const rowIssues: string[] = [];

    if (!source.creatorName) {
      const message = "Creator Name is blank.";
      rowIssues.push(message);
      issues.push({
        kind: "blank_required",
        message,
        rowNumber: source.rowNumber,
      });
      planned.push({
        action: "skip-invalid",
        existing: null,
        issues: rowIssues,
        mapped: null,
        source,
      });
      continue;
    }

    const nameKey = source.creatorName.toLowerCase();
    const nameRows = nameCount.get(nameKey) ?? [];

    if (nameRows.length > 1) {
      const message = `Duplicate name "${source.creatorName}" (rows ${nameRows.join(", ")}).`;
      rowIssues.push(message);
      issues.push({
        kind: "duplicate_name",
        message,
        rowNumber: source.rowNumber,
      });
    }

    const parsedLink = parseInstagramLink(source.links);

    for (const issue of parsedLink.issues) {
      rowIssues.push(issue);
      issues.push({
        kind: "malformed_link",
        message: issue,
        rowNumber: source.rowNumber,
      });
    }

    if (parsedLink.url) {
      const urlRows = urlCount.get(parsedLink.url) ?? [];
      urlRows.push(source.rowNumber);
      urlCount.set(parsedLink.url, urlRows);
    }

    const baseSlug = slugifyName(source.creatorName);
    const slug = uniqueSlug(baseSlug, usedSlugs);

    if (slug !== baseSlug && baseSlug) {
      const message = `Slug "${baseSlug}" collided; using "${slug}".`;
      rowIssues.push(message);
      issues.push({
        kind: "duplicate_slug",
        message,
        rowNumber: source.rowNumber,
      });
    }

    const fullBio = source.contentNote.slice(0, 8000) || null;
    const mapped: MappedCreator = {
      bio: fullBio,
      display_name: source.creatorName.slice(0, 160),
      featured: false,
      instagram_handle: parsedLink.handle,
      instagram_url: parsedLink.url,
      manager_name: source.tm.slice(0, 160) || null,
      name: source.creatorName.slice(0, 160),
      primary_category: DEFAULT_CATEGORY,
      short_bio: firstUsefulSentence(source.contentNote),
      slug,
      sort_order: planned.filter((item) => item.mapped).length,
      status: "draft",
    };

    planned.push({
      action: "insert",
      existing: null,
      issues: rowIssues,
      mapped,
      source,
    });
  }

  for (const [url, rows] of urlCount) {
    if (rows.length < 2) {
      continue;
    }

    for (const rowNumber of rows) {
      const message = `Duplicate Instagram URL ${url} (rows ${rows.join(", ")}).`;
      issues.push({
        kind: "duplicate_instagram",
        message,
        rowNumber,
      });
      const item = planned.find((row) => row.source.rowNumber === rowNumber);

      if (item && !item.issues.includes(message)) {
        item.issues.push(message);
      }
    }
  }

  return { issues, planned };
}

function createServiceClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local for this local script only. Never expose it to the browser.",
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function loadExistingBySlug(
  supabase: SupabaseClient<Database>,
): Promise<Map<string, Creator>> {
  const { data, error } = await supabase.from("creators").select("*");

  if (error) {
    throw new Error(`Failed to load creators: ${error.message}`);
  }

  return new Map((data ?? []).map((creator) => [creator.slug, creator]));
}

function applyExistingState(
  planned: PlannedRow[],
  existingBySlug: Map<string, Creator>,
  overwrite: boolean,
) {
  for (const item of planned) {
    if (!item.mapped || item.action === "skip-invalid") {
      continue;
    }

    const existing = existingBySlug.get(item.mapped.slug) ?? null;
    item.existing = existing;

    if (!existing) {
      item.action = "insert";
      continue;
    }

    if (isManuallyEdited(existing) && !overwrite) {
      item.action = "skip-edited";
      item.issues.push(
        "Existing record looks manually edited. Re-run with --overwrite to update mapped fields only.",
      );
      continue;
    }

    item.action = "update";
  }
}

function toInsertRow(mapped: MappedCreator) {
  // Live `creators` uses `full_bio` (not `bio`) and has `instagram_handle`.
  // Only send columns that exist so PostgREST does not reject the write.
  return {
    categories: [] as string[],
    display_name: mapped.display_name,
    featured: mapped.featured,
    full_bio: mapped.bio,
    instagram_handle: mapped.instagram_handle,
    instagram_url: mapped.instagram_url,
    manager_name: mapped.manager_name,
    primary_category: mapped.primary_category,
    short_bio: mapped.short_bio,
    slug: mapped.slug,
    sort_order: mapped.sort_order,
    status: mapped.status,
  };
}

async function importRows(
  supabase: SupabaseClient<Database>,
  planned: PlannedRow[],
): Promise<{ failed: number; succeeded: number }> {
  let succeeded = 0;
  let failed = 0;

  for (const item of planned) {
    if (!item.mapped || item.action === "skip-invalid" || item.action === "skip-edited") {
      continue;
    }

    const row = toInsertRow(item.mapped);

    if (item.action === "insert") {
      const { error } = await supabase.from("creators").insert(row);

      if (error) {
        failed += 1;
        console.error(`  FAIL row ${item.source.rowNumber} insert ${item.mapped.slug}: ${error.message}`);
        continue;
      }

      succeeded += 1;
      continue;
    }

    const { error } = await supabase
      .from("creators")
      .update(row)
      .eq("slug", item.mapped.slug);

    if (error) {
      failed += 1;
      console.error(`  FAIL row ${item.source.rowNumber} update ${item.mapped.slug}: ${error.message}`);
      continue;
    }

    succeeded += 1;
  }

  return { failed, succeeded };
}

function printReport(input: {
  file: string;
  headers: string[];
  importMode: boolean;
  issues: RowIssue[];
  overwrite: boolean;
  planned: PlannedRow[];
  sheetName: string;
  sheetNames: string[];
  comparedToDatabase: boolean;
}) {
  const { planned } = input;
  const valid = planned.filter((item) => item.mapped);
  const inserts = planned.filter((item) => item.action === "insert");
  const updates = planned.filter((item) => item.action === "update");
  const skippedEdited = planned.filter((item) => item.action === "skip-edited");
  const skippedInvalid = planned.filter((item) => item.action === "skip-invalid");
  const blankRequired = input.issues.filter((issue) => issue.kind === "blank_required");
  const duplicateNames = input.issues.filter((issue) => issue.kind === "duplicate_name");
  const duplicateInstagram = input.issues.filter((issue) => issue.kind === "duplicate_instagram");
  const malformed = input.issues.filter((issue) => issue.kind === "malformed_link");

  console.log("Backstage roster import");
  console.log("=======================");
  console.log(`File: ${input.file}`);
  console.log(`Mode: ${input.importMode ? "import" : "dry-run"}${input.overwrite ? " --overwrite" : ""}`);
  console.log(`Source workbook was not modified.`);
  console.log("");
  console.log("Inspection");
  console.log("----------");
  console.log(`Sheets: ${input.sheetNames.join(", ") || "(none)"}`);
  console.log(`Using sheet: ${input.sheetName || "(none)"}`);
  console.log(`Headers: ${input.headers.join(" | ") || "(none)"}`);
  console.log(`Creator rows: ${planned.length}`);
  console.log(`Blank required fields: ${blankRequired.length}`);
  console.log(`Duplicate names: ${new Set(duplicateNames.map((issue) => issue.message)).size}`);
  console.log(`Duplicate Instagram URLs: ${new Set(duplicateInstagram.map((issue) => issue.message)).size}`);
  console.log(`Malformed / extra links: ${malformed.length}`);
  console.log(`Database compared: ${input.comparedToDatabase ? "yes" : "no"}`);
  console.log("");

  if (input.issues.length > 0) {
    console.log("Validation");
    console.log("----------");

    for (const issue of input.issues) {
      console.log(`  row ${issue.rowNumber}: [${issue.kind}] ${issue.message}`);
    }

    console.log("");
  }

  console.log("Mapped preview");
  console.log("--------------");

  for (const item of valid) {
    const mapped = item.mapped;

    if (!mapped) {
      continue;
    }

    console.log(
      `  row ${item.source.rowNumber}  ${mapped.display_name}  slug=${mapped.slug}  tm=${mapped.manager_name ?? "—"}  ig=${mapped.instagram_handle ?? "—"}  order=${mapped.sort_order}  action=${item.action}`,
    );
  }

  if (skippedInvalid.length > 0) {
    console.log("");
    console.log("Skipped invalid");
    console.log("---------------");

    for (const item of skippedInvalid) {
      console.log(`  row ${item.source.rowNumber}: ${item.issues.join(" ")}`);
    }
  }

  console.log("");
  console.log("Summary");
  console.log("-------");
  console.log(`Would insert: ${inserts.length}`);
  console.log(`Would update: ${updates.length}`);
  console.log(`Would skip (manually edited): ${skippedEdited.length}`);
  console.log(`Would skip (invalid): ${skippedInvalid.length}`);
  console.log(`Valid mapped rows: ${valid.length}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const filePath = resolve(process.cwd(), options.file);

  console.log(`Inspecting ${filePath}`);

  const loaded = loadSourceRows(filePath);
  const { issues, planned } = planRows(loaded.rows);
  let comparedToDatabase = false;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createServiceClient();
    const existing = await loadExistingBySlug(supabase);
    applyExistingState(planned, existing, options.overwrite);
    comparedToDatabase = true;

    if (options.importMode) {
      printReport({
        comparedToDatabase,
        file: options.file,
        headers: loaded.headers,
        importMode: true,
        issues,
        overwrite: options.overwrite,
        planned,
        sheetName: loaded.sheetName,
        sheetNames: loaded.sheetNames,
      });
      console.log("");
      console.log("Writing to Supabase…");
      const result = await importRows(supabase, planned);
      console.log(`Succeeded: ${result.succeeded}`);
      console.log(`Failed: ${result.failed}`);
      process.exit(result.failed > 0 ? 1 : 0);
    }
  } else if (options.importMode) {
    throw new Error(
      "Import requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the local environment.",
    );
  }

  printReport({
    comparedToDatabase,
    file: options.file,
    headers: loaded.headers,
    importMode: false,
    issues,
    overwrite: options.overwrite,
    planned,
    sheetName: loaded.sheetName,
    sheetNames: loaded.sheetNames,
  });

  if (!comparedToDatabase) {
    console.log("");
    console.log(
      "Database was not compared. Add SUPABASE_SERVICE_ROLE_KEY to .env.local to see insert/update/skip against live records. Dry-run does not write.",
    );
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Import aborted: ${message}`);
  process.exit(1);
});
