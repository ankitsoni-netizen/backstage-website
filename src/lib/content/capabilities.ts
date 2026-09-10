export type BackstageCapability = {
  copy: string;
  number: string;
  outcome: string;
  title: string;
  word: string;
};

export const backstageCapabilities = [
  {
    number: "01",
    title: "Dealcraft",
    word: "VALUE",
    copy: "Negotiation and commercial strategy designed to protect value—not just close the next campaign.",
    outcome: "Better terms. Protected value.",
  },
  {
    number: "02",
    title: "Creative Direction",
    word: "FORM",
    copy: "Content strategy and cultural intelligence that turn creator instinct into repeatable growth.",
    outcome: "Instinct turned into a system.",
  },
  {
    number: "03",
    title: "Brand Partnerships",
    word: "FIT",
    copy: "Partnerships chosen for strategic fit, audience trust and long-term relevance.",
    outcome: "Fit over frequency.",
  },
  {
    number: "04",
    title: "Legal & Rights",
    word: "RIGHTS",
    copy: "Contracts, usage rights and protection built into the process from the beginning.",
    outcome: "Ownership without ambiguity.",
  },
  {
    number: "05",
    title: "Finance & Operations",
    word: "BOOKS",
    copy: "Invoicing, collections and reporting handled with clarity and transparency.",
    outcome: "Business without operational drag.",
  },
  {
    number: "06",
    title: "IP & Ventures",
    word: "EQUITY",
    copy: "Formats, D2C, licensing and capital—assets creators can own.",
    outcome: "Influence turned into equity.",
  },
] as const satisfies readonly BackstageCapability[];
