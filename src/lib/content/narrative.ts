export const narrativeStages = [
  { id: "act-door", label: "Backstage" },
  { id: "green-room", label: "Green Room" },
  { id: "wings", label: "Wings" },
  { id: "spotlight", label: "Spotlight" },
] as const;

export const narrativeSectionIds = [
  "act-door",
  "green-room",
  "thesis",
  "crew",
  "wings",
  "roster-preview",
  "spotlight",
] as const;

export type NarrativeSectionId = (typeof narrativeSectionIds)[number];
export type NarrativeStageId = (typeof narrativeStages)[number]["id"];

export function stageFromSection(section: string | null): NarrativeStageId {
  if (section === "wings" || section === "crew") {
    return "wings";
  }

  if (section === "spotlight" || section === "roster-preview") {
    return "spotlight";
  }

  if (section === "green-room" || section === "thesis") {
    return "green-room";
  }

  return "act-door";
}

export const stageGrowthPath = [
  {
    title: "Creator",
    mark: "A1",
    copy: "A distinct voice and the first architecture around the work.",
  },
  {
    title: "Category Leader",
    mark: "A2",
    copy: "A point of view the market recognises—and a slate that compounds.",
  },
  {
    title: "Business",
    mark: "A3",
    copy: "Revenue systems and a team that can hold more than one campaign.",
  },
  {
    title: "Media Empire",
    mark: "A4",
    copy: "Owned IP, new ventures, and a company that outlasts the platform.",
  },
] as const;

export const thesisPrinciples = [
  { number: "01", title: "Ownership" },
  { number: "02", title: "Longevity" },
  { number: "03", title: "Infrastructure" },
  { number: "04", title: "Transparency" },
] as const;
