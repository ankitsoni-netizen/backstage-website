"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { CreatorCard } from "@/components/website/talent/CreatorCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import {
  collectRosterCategories,
  filterPublicCreators,
} from "@/lib/utilities/creators";
import { cn } from "@/lib/utilities/cn";
import type { PublicCreator } from "@/types/public";

type TalentRosterProps = {
  creators: PublicCreator[];
  initialCategory: string;
  initialQuery: string;
  loadFailed?: boolean;
};

function writeRosterQuery(query: string, category: string) {
  const url = new URL(window.location.href);
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    url.searchParams.set("q", trimmedQuery);
  } else {
    url.searchParams.delete("q");
  }

  if (category) {
    url.searchParams.set("category", category);
  } else {
    url.searchParams.delete("category");
  }

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (next !== current) {
    window.history.replaceState(window.history.state, "", next);
  }
}

function resolveCategory(creators: PublicCreator[], value: string): string {
  if (!value) {
    return "";
  }

  const match = collectRosterCategories(creators).find(
    (category) => category.toLowerCase() === value.toLowerCase(),
  );

  return match ?? value;
}

export function TalentRoster({
  creators,
  initialCategory,
  initialQuery,
  loadFailed = false,
}: TalentRosterProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(() =>
    resolveCategory(creators, initialCategory),
  );
  const categories = useMemo(
    () => collectRosterCategories(creators),
    [creators],
  );
  const visible = useMemo(
    () => filterPublicCreators(creators, query, category),
    [category, creators, query],
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      writeRosterQuery(query, category);
    }, 200);

    return () => window.clearTimeout(handle);
  }, [category, query]);

  if (loadFailed) {
    return (
      <Container className="py-10 md:py-14">
        <EmptyState
          title="The roster could not load"
          description="Published talent could not be reached. Try again in a moment."
          action={
            <Button href="/contact" variant="ghost">
              Let&apos;s talk
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-10 md:py-14">
      <form
        role="search"
        className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start"
        onSubmit={(event) => event.preventDefault()}
      >
        <Field id="talent-search" label="Search the roster">
          <input
            type="search"
            value={query}
            autoComplete="off"
            placeholder="Name, category, or city"
            onChange={(event) => setQuery(event.target.value)}
          />
        </Field>

        {categories.length > 0 ? (
          <fieldset>
            <legend className="text-kicker text-muted">Category</legend>
            <div
              role="radiogroup"
              aria-label="Filter by category"
              className="mt-3 flex flex-wrap gap-2"
            >
              <CategoryFilter
                checked={category === ""}
                label="All"
                onSelect={() => setCategory("")}
              />
              {categories.map((item) => (
                <CategoryFilter
                  key={item}
                  checked={category === item}
                  label={item}
                  onSelect={() => setCategory(item)}
                />
              ))}
            </div>
          </fieldset>
        ) : null}
      </form>

      <p aria-live="polite" className="mt-8 text-sm text-muted">
        {visible.length === creators.length
          ? `${creators.length} ${creators.length === 1 ? "creator" : "creators"}`
          : `${visible.length} of ${creators.length} creators`}
      </p>

      {creators.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="The roster is being assembled"
          description="Published talent will appear here. Brands can still start a conversation."
          action={
            <Button href="/contact" variant="ghost">
              Let&apos;s talk
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No creators match"
          description="Try another name, category, or city, or clear the current filters."
          action={
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setQuery("");
                setCategory("");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <Stagger className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((creator, index) => (
            <StaggerItem key={creator.id}>
              <CreatorCard
                creator={creator}
                priority={index < 6}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Container>
  );
}

type CategoryFilterProps = {
  checked: boolean;
  label: string;
  onSelect: () => void;
};

function CategoryFilter({ checked, label, onSelect }: CategoryFilterProps) {
  return (
    <label
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center border px-4 text-sm tracking-[-0.02em] transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-ink",
        checked
          ? "border-oxblood bg-oxblood text-ivory"
          : "border-line bg-transparent text-ink hover:border-ink",
      )}
    >
      <input
        type="radio"
        name="category"
        className="sr-only"
        checked={checked}
        value={label === "All" ? "" : label}
        onChange={onSelect}
      />
      {label}
    </label>
  );
}
