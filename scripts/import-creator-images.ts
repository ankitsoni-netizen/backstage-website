import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";

import { slugifyName } from "../src/lib/admin/slug";
import { CREATOR_MEDIA_BUCKET } from "../src/lib/utilities/storage";
import type { Database } from "../src/types/database";

const DEFAULT_DIR = "data/creator-images";
const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".heic",
  ".heif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);
const PROFILE_MAX = { height: 1500, width: 1200 };
const HERO_MAX_WIDTH = 1800;
const WEBP_QUALITY = 82;

type CliOptions = {
  approvals: Set<string>;
  assignments: Map<string, { hero?: string; profile?: string }>;
  dir: string;
  importMode: boolean;
  overwrite: boolean;
};

type CreatorRecord = {
  display_name: string | null;
  hero_image_path: string | null;
  id: string;
  profile_image_path: string | null;
  slug: string;
};

type ImageAsset = {
  bytes: number;
  format: string;
  height: number | null;
  label: string;
  relativePath: string;
  sourcePath: string;
  width: number | null;
};

type MatchKind = "exact" | "possible";

type ImageMatch = {
  confidence: MatchKind;
  creator: CreatorRecord;
  image: ImageAsset;
  reason: string;
};

type CreatorPlan = {
  creator: CreatorRecord;
  exact: ImageMatch[];
  possible: ImageMatch[];
};

function parseArgs(argv: string[]): CliOptions {
  const importMode = argv.includes("--import");
  const overwrite = argv.includes("--overwrite");
  const dirFlag = argv.findIndex((value) => value === "--dir");
  const dir =
    dirFlag >= 0 && argv[dirFlag + 1] ? argv[dirFlag + 1] : DEFAULT_DIR;
  const approvals = new Set<string>();
  const assignments = new Map<string, { hero?: string; profile?: string }>();

  if (importMode && argv.includes("--dry-run")) {
    throw new Error("Use either --dry-run or --import, not both.");
  }

  for (const value of argv) {
    if (value.startsWith("--approve=")) {
      const slug = value.slice("--approve=".length).trim();

      if (slug) {
        approvals.add(slug);
      }
    }

    if (value.startsWith("--profile=")) {
      const parsed = parseAssignment(value.slice("--profile=".length));
      const current = assignments.get(parsed.slug) ?? {};
      current.profile = parsed.path;
      assignments.set(parsed.slug, current);
    }

    if (value.startsWith("--hero=")) {
      const parsed = parseAssignment(value.slice("--hero=".length));
      const current = assignments.get(parsed.slug) ?? {};
      current.hero = parsed.path;
      assignments.set(parsed.slug, current);
    }
  }

  return { approvals, assignments, dir, importMode, overwrite };
}

function parseAssignment(value: string): { path: string; slug: string } {
  const split = value.indexOf(":");

  if (split <= 0 || split === value.length - 1) {
    throw new Error(
      `Expected slug:relative-path, received "${value}". Example: --profile=lagni-panchal:Lagni Panchal/file.jpeg`,
    );
  }

  return {
    path: value.slice(split + 1),
    slug: value.slice(0, split),
  };
}

function stripImageExtension(name: string): string {
  const extension = extname(name).toLowerCase();

  if (IMAGE_EXTENSIONS.has(extension)) {
    return basename(name, extname(name)).trim();
  }

  return name.trim();
}

function normalizeWords(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tokensFrom(value: string): string[] {
  return normalizeWords(value).split(" ").filter(Boolean);
}

function levenshtein(left: string, right: string): number {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const grid: number[][] = Array.from({ length: rows }, (_, index) => {
    const row = new Array<number>(cols).fill(0);
    row[0] = index;
    return row;
  });

  for (let col = 0; col < cols; col += 1) {
    grid[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      grid[row][col] = Math.min(
        grid[row - 1][col] + 1,
        grid[row][col - 1] + 1,
        grid[row - 1][col - 1] + cost,
      );
    }
  }

  return grid[left.length][right.length];
}

function sniffFormat(bytes: Buffer): string {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg";
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes.subarray(1, 4).toString("ascii") === "PNG"
  ) {
    return "png";
  }

  if (bytes.length >= 12 && bytes.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = bytes.subarray(8, 12).toString("ascii").toLowerCase();

    if (brand.includes("hei") || brand.includes("mif")) {
      return "heic";
    }

    return `isobmff:${brand}`;
  }

  if (bytes.subarray(0, 4).toString("ascii") === "RIFF") {
    return "webp";
  }

  return "unknown";
}

function readSipsNumber(sourcePath: string, key: "pixelWidth" | "pixelHeight"): number | null {
  try {
    const output = execFileSync("sips", ["-g", key, sourcePath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const line = output
      .split("\n")
      .find((entry) => entry.includes(key));
    const value = line?.trim().split(/\s+/).at(-1);
    const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function listImageFiles(rootDir: string): string[] {
  const found: string[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) {
        continue;
      }

      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (entry.isFile()) {
        found.push(fullPath);
      }
    }
  };

  walk(rootDir);
  return found.sort((left, right) => left.localeCompare(right));
}

function matchingLabel(rootDir: string, sourcePath: string): string {
  const relativePath = relative(rootDir, sourcePath);
  const parent = dirname(relativePath);

  if (parent && parent !== ".") {
    return parent.split(sep)[0] ?? parent;
  }

  return stripImageExtension(basename(sourcePath));
}

function inspectImages(rootDir: string): ImageAsset[] {
  return listImageFiles(rootDir).map((sourcePath) => {
    const header = readFileSync(sourcePath).subarray(0, 24);

    return {
      bytes: statSync(sourcePath).size,
      format: sniffFormat(header),
      height: readSipsNumber(sourcePath, "pixelHeight"),
      label: matchingLabel(rootDir, sourcePath),
      relativePath: relative(rootDir, sourcePath),
      sourcePath,
      width: readSipsNumber(sourcePath, "pixelWidth"),
    };
  });
}

function exactReasons(label: string, creator: CreatorRecord): string[] {
  const reasons: string[] = [];
  const labelSlug = slugifyName(label);
  const nameSlug = slugifyName(creator.display_name ?? "");
  const labelWords = normalizeWords(label);
  const nameWords = normalizeWords(creator.display_name ?? "");

  if (labelSlug && labelSlug === creator.slug) {
    reasons.push("slug equals filename/folder");
  }

  if (labelSlug && nameSlug && labelSlug === nameSlug) {
    reasons.push("slug equals display name");
  }

  if (labelWords && nameWords && labelWords === nameWords) {
    reasons.push("normalized name equals display name");
  }

  return reasons;
}

function possibleReasons(label: string, creator: CreatorRecord): string[] {
  const reasons: string[] = [];
  const labelSlug = slugifyName(label);
  const nameSlug = slugifyName(creator.display_name ?? "");
  const labelTokens = tokensFrom(label);
  const nameTokens = tokensFrom(creator.display_name ?? "");

  if (
    labelTokens[0] &&
    nameTokens[0] &&
    labelTokens[0] === nameTokens[0]
  ) {
    reasons.push(`shared first name "${labelTokens[0]}"`);
  }

  const labelLast = labelTokens.at(-1);
  const nameLast = nameTokens.at(-1);

  if (
    labelLast &&
    nameLast &&
    labelTokens.length === 1 &&
    nameTokens.length > 1 &&
    labelLast === nameLast
  ) {
    reasons.push(`shared last name "${labelLast}"`);
  }

  if (
    labelSlug &&
    (creator.slug.startsWith(`${labelSlug}-`) || nameSlug.startsWith(`${labelSlug}-`))
  ) {
    reasons.push(`creator slug/name starts with "${labelSlug}-"`);
  }

  const slugDistance = labelSlug && creator.slug ? levenshtein(labelSlug, creator.slug) : 99;
  const nameDistance = labelSlug && nameSlug ? levenshtein(labelSlug, nameSlug) : 99;
  const distance = Math.min(slugDistance, nameDistance);

  if (labelSlug.length >= 5 && distance === 1) {
    reasons.push("one-character spelling difference");
  }

  return reasons;
}

function uniqueBySlug(creators: CreatorRecord[]): CreatorRecord[] {
  const seen = new Set<string>();
  return creators.filter((creator) => {
    if (seen.has(creator.slug)) {
      return false;
    }

    seen.add(creator.slug);
    return true;
  });
}

function matchImages(
  images: ImageAsset[],
  creators: CreatorRecord[],
): { matches: ImageMatch[]; unmatched: ImageAsset[] } {
  const matches: ImageMatch[] = [];
  const unmatched: ImageAsset[] = [];

  for (const image of images) {
    const exactHits = uniqueBySlug(
      creators.filter((creator) => exactReasons(image.label, creator).length > 0),
    );

    if (exactHits.length === 1 && exactHits[0]) {
      const creator = exactHits[0];
      matches.push({
        confidence: "exact",
        creator,
        image,
        reason: exactReasons(image.label, creator).join("; "),
      });
      continue;
    }

    if (exactHits.length > 1) {
      for (const creator of exactHits) {
        matches.push({
          confidence: "possible",
          creator,
          image,
          reason: `ambiguous exact-looking name (${exactReasons(image.label, creator).join("; ")})`,
        });
      }
      continue;
    }

    const possibleHits = uniqueBySlug(
      creators.filter((creator) => possibleReasons(image.label, creator).length > 0),
    );

    if (possibleHits.length === 1 && possibleHits[0]) {
      const creator = possibleHits[0];
      matches.push({
        confidence: "possible",
        creator,
        image,
        reason: possibleReasons(image.label, creator).join("; "),
      });
      continue;
    }

    if (possibleHits.length > 1) {
      for (const creator of possibleHits) {
        matches.push({
          confidence: "possible",
          creator,
          image,
          reason: `ambiguous possible match (${possibleReasons(image.label, creator).join("; ")})`,
        });
      }
      continue;
    }

    unmatched.push(image);
  }

  return { matches, unmatched };
}

function plansByCreator(
  creators: CreatorRecord[],
  matches: ImageMatch[],
): CreatorPlan[] {
  return creators.map((creator) => ({
    creator,
    exact: matches.filter(
      (match) => match.creator.slug === creator.slug && match.confidence === "exact",
    ),
    possible: matches.filter(
      (match) => match.creator.slug === creator.slug && match.confidence === "possible",
    ),
  }));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatSize(image: ImageAsset): string {
  const dimensions =
    image.width && image.height ? `${image.width}×${image.height}` : "unknown size";
  return `${image.format}, ${dimensions}, ${formatBytes(image.bytes)}`;
}

function printReport(input: {
  assignments: Map<string, { hero?: string; profile?: string }>;
  approvals: Set<string>;
  comparedToDatabase: boolean;
  dir: string;
  images: ImageAsset[];
  importMode: boolean;
  matches: ImageMatch[];
  overwrite: boolean;
  plans: CreatorPlan[];
  unmatched: ImageAsset[];
}) {
  const { images, plans, unmatched } = input;
  const exactCreators = plans.filter((plan) => plan.exact.length > 0);
  const possibleCreators = plans.filter(
    (plan) => plan.possible.length > 0 && plan.exact.length === 0,
  );
  const multiple = plans.filter((plan) => plan.exact.length + plan.possible.length > 1);
  const withoutImages = plans.filter(
    (plan) => plan.exact.length === 0 && plan.possible.length === 0,
  );
  const ready = plans.filter((plan) => isReadyForUpload(plan, input.approvals, input.assignments));

  console.log("Backstage creator image import");
  console.log("==============================");
  console.log(`Folder: ${input.dir}`);
  console.log(`Mode: ${input.importMode ? "import" : "review"}${input.overwrite ? " --overwrite" : ""}`);
  console.log("Local originals will not be deleted.");
  console.log("");
  console.log("Inspection");
  console.log("----------");
  console.log(`Files: ${images.length}`);
  console.log(`Database compared: ${input.comparedToDatabase ? "yes" : "no"}`);
  console.log("");

  for (const image of images) {
    const via = image.label === stripImageExtension(basename(image.relativePath))
      ? "filename"
      : `folder "${image.label}"`;
    console.log(`  ${image.relativePath}`);
    console.log(`    ${formatSize(image)}  match-label=${via}`);
  }

  console.log("");
  console.log("Exact matches");
  console.log("-------------");

  if (exactCreators.length === 0) {
    console.log("  (none)");
  }

  for (const plan of exactCreators) {
    const name = plan.creator.display_name ?? plan.creator.slug;
    console.log(`  ${name}  (${plan.creator.slug})`);

    for (const match of plan.exact) {
      console.log(`    ${match.image.relativePath}  [${match.reason}]`);
    }
  }

  console.log("");
  console.log("Possible matches (not auto-approved)");
  console.log("------------------------------------");

  if (possibleCreators.length === 0 && plans.every((plan) => plan.possible.length === 0)) {
    console.log("  (none)");
  }

  for (const plan of plans.filter((item) => item.possible.length > 0)) {
    const name = plan.creator.display_name ?? plan.creator.slug;
    console.log(`  ${name}  (${plan.creator.slug})`);

    for (const match of plan.possible) {
      console.log(`    ${match.image.relativePath}  [${match.reason}]`);
    }
  }

  console.log("");
  console.log("Unmatched images");
  console.log("----------------");

  if (unmatched.length === 0) {
    console.log("  (none)");
  }

  for (const image of unmatched) {
    console.log(`  ${image.relativePath}  label="${image.label}"`);
  }

  console.log("");
  console.log("Creators without images");
  console.log("-----------------------");

  if (withoutImages.length === 0) {
    console.log("  (none)");
  }

  for (const plan of withoutImages) {
    console.log(`  ${plan.creator.display_name ?? plan.creator.slug}  (${plan.creator.slug})`);
  }

  console.log("");
  console.log("Creators with multiple candidate images");
  console.log("---------------------------------------");

  if (multiple.length === 0) {
    console.log("  (none)");
  }

  for (const plan of multiple) {
    const name = plan.creator.display_name ?? plan.creator.slug;
    const count = plan.exact.length + plan.possible.length;
    console.log(`  ${name}  (${plan.creator.slug})  ${count} files`);

    for (const match of [...plan.exact, ...plan.possible]) {
      console.log(`    ${match.confidence}: ${match.image.relativePath}`);
    }
  }

  console.log("");
  console.log("Upload eligibility");
  console.log("------------------");
  console.log(
    `Ready for profile upload (exact, single file, or explicitly assigned): ${ready.length}`,
  );
  console.log(`Held for review: ${plans.length - ready.length - withoutImages.length}`);
  console.log("");
  console.log("Summary");
  console.log("-------");
  console.log(`Exact-match creators: ${exactCreators.length}`);
  console.log(`Possible-match creators: ${possibleCreators.length}`);
  console.log(`Unmatched images: ${unmatched.length}`);
  console.log(`Creators without images: ${withoutImages.length}`);
  console.log(`Creators with multiple candidates: ${multiple.length}`);
  console.log("");
  console.log("No files were uploaded. Possible and multi-image matches stay held.");
  console.log("Approve a possible match: --approve=slug");
  console.log(
    "Choose files for a multi-image creator: --profile=slug:relative-path --hero=slug:relative-path",
  );
}

function findImage(plan: CreatorPlan, relativePath: string): ImageMatch | null {
  return (
    [...plan.exact, ...plan.possible].find(
      (match) => match.image.relativePath === relativePath,
    ) ?? null
  );
}

function isReadyForUpload(
  plan: CreatorPlan,
  approvals: Set<string>,
  assignments: Map<string, { hero?: string; profile?: string }>,
): boolean {
  if (assignments.has(plan.creator.slug)) {
    const assignment = assignments.get(plan.creator.slug);

    if (!assignment?.profile && !assignment?.hero) {
      return false;
    }

    if (assignment.profile && !findImage(plan, assignment.profile)) {
      return false;
    }

    if (assignment.hero && !findImage(plan, assignment.hero)) {
      return false;
    }

    return true;
  }

  const approvedPossible =
    approvals.has(plan.creator.slug) && plan.possible.length === 1 && plan.exact.length === 0;

  if (plan.exact.length === 1 && plan.possible.length === 0) {
    return true;
  }

  return approvedPossible;
}

function selectedAssets(
  plan: CreatorPlan,
  assignments: Map<string, { hero?: string; profile?: string }>,
): { hero: ImageAsset | null; profile: ImageAsset | null } {
  const assignment = assignments.get(plan.creator.slug);

  if (assignment) {
    return {
      hero: assignment.hero ? (findImage(plan, assignment.hero)?.image ?? null) : null,
      profile: assignment.profile
        ? (findImage(plan, assignment.profile)?.image ?? null)
        : null,
    };
  }

  const only =
    plan.exact.length === 1
      ? plan.exact[0]?.image
      : plan.possible.length === 1
        ? plan.possible[0]?.image
        : null;

  return { hero: null, profile: only ?? null };
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

async function loadCreators(supabase: SupabaseClient<Database>): Promise<CreatorRecord[]> {
  const { data, error } = await supabase
    .from("creators")
    .select("id, slug, display_name, profile_image_path, hero_image_path")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load creators: ${error.message}`);
  }

  return (data ?? []) as CreatorRecord[];
}

function convertHeicToJpeg(sourcePath: string, tempDir: string): string {
  const outputPath = join(tempDir, `${basename(sourcePath)}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "90", sourcePath, "--out", outputPath], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  return outputPath;
}

async function encodeForSlot(
  sourcePath: string,
  format: string,
  slot: "hero" | "profile",
): Promise<{ body: Buffer; contentType: "image/webp" }> {
  const tempDir = mkdtempSync(join(tmpdir(), "backstage-media-"));

  try {
    const readablePath =
      format === "heic" || format === "heif"
        ? convertHeicToJpeg(sourcePath, tempDir)
        : sourcePath;
    const image = sharp(readablePath, { failOn: "none" }).rotate();
    const resized =
      slot === "hero"
        ? image.resize({
            withoutEnlargement: true,
            width: HERO_MAX_WIDTH,
          })
        : image.resize({
            fit: "inside",
            height: PROFILE_MAX.height,
            withoutEnlargement: true,
            width: PROFILE_MAX.width,
          });
    const body = await resized.webp({ effort: 4, quality: WEBP_QUALITY }).toBuffer();
    return { body, contentType: "image/webp" };
  } finally {
    rmSync(tempDir, { force: true, recursive: true });
  }
}

function objectPath(slug: string, slot: "hero" | "profile"): string {
  return `creators/${slug}/${slot}.webp`;
}

async function uploadApproved(
  supabase: SupabaseClient<Database>,
  plans: CreatorPlan[],
  options: CliOptions,
): Promise<{ failed: number; skipped: number; succeeded: number }> {
  let succeeded = 0;
  let failed = 0;
  let skipped = 0;

  for (const plan of plans) {
    if (!isReadyForUpload(plan, options.approvals, options.assignments)) {
      skipped += 1;
      continue;
    }

    if (
      !options.overwrite &&
      (plan.creator.profile_image_path || plan.creator.hero_image_path)
    ) {
      console.log(
        `  SKIP ${plan.creator.slug}: already has image paths. Re-run with --overwrite to replace.`,
      );
      skipped += 1;
      continue;
    }

    const selected = selectedAssets(plan, options.assignments);
    const updates: { hero_image_path?: string; profile_image_path?: string } = {};

    try {
      if (selected.profile) {
        const encoded = await encodeForSlot(
          selected.profile.sourcePath,
          selected.profile.format,
          "profile",
        );
        const path = objectPath(plan.creator.slug, "profile");
        const uploaded = await supabase.storage.from(CREATOR_MEDIA_BUCKET).upload(path, encoded.body, {
          cacheControl: "3600",
          contentType: encoded.contentType,
          upsert: options.overwrite,
        });

        if (uploaded.error) {
          throw new Error(uploaded.error.message);
        }

        updates.profile_image_path = path;
      }

      if (selected.hero) {
        const encoded = await encodeForSlot(
          selected.hero.sourcePath,
          selected.hero.format,
          "hero",
        );
        const path = objectPath(plan.creator.slug, "hero");
        const uploaded = await supabase.storage.from(CREATOR_MEDIA_BUCKET).upload(path, encoded.body, {
          cacheControl: "3600",
          contentType: encoded.contentType,
          upsert: options.overwrite,
        });

        if (uploaded.error) {
          throw new Error(uploaded.error.message);
        }

        updates.hero_image_path = path;
      }

      if (Object.keys(updates).length === 0) {
        skipped += 1;
        continue;
      }

      const { error } = await supabase
        .from("creators")
        .update(updates)
        .eq("id", plan.creator.id);

      if (error) {
        throw new Error(error.message);
      }

      console.log(
        `  OK ${plan.creator.slug}  ${Object.entries(updates)
          .map(([key, value]) => `${key}=${value}`)
          .join(" ")}`,
      );
      succeeded += 1;
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  FAIL ${plan.creator.slug}: ${message}`);
    }
  }

  return { failed, skipped, succeeded };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const rootDir = resolve(process.cwd(), options.dir);

  if (!existsSync(rootDir) || !statSync(rootDir).isDirectory()) {
    throw new Error(`Image folder not found: ${rootDir}`);
  }

  const images = inspectImages(rootDir);
  const supabase = createServiceClient();
  const creators = await loadCreators(supabase);
  const { matches, unmatched } = matchImages(images, creators);
  const plans = plansByCreator(creators, matches);

  printReport({
    assignments: options.assignments,
    approvals: options.approvals,
    comparedToDatabase: true,
    dir: options.dir,
    images,
    importMode: options.importMode,
    matches,
    overwrite: options.overwrite,
    plans,
    unmatched,
  });

  if (!options.importMode) {
    return;
  }

  console.log("");
  console.log("Writing approved images to Supabase Storage…");
  const result = await uploadApproved(supabase, plans, options);
  console.log(`Succeeded: ${result.succeeded}`);
  console.log(`Skipped: ${result.skipped}`);
  console.log(`Failed: ${result.failed}`);
  process.exit(result.failed > 0 ? 1 : 0);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Image import aborted: ${message}`);
  process.exit(1);
});
