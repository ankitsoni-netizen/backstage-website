import Link from "next/link";

import { CreatorImage } from "@/components/ui/CreatorImage";
import { getCreatorProfileImage } from "@/lib/utilities/creators";
import { resolveMediaUrl } from "@/lib/utilities/storage";
import type { PublicCreator } from "@/types/public";

type CreatorCardProps = {
  creator: PublicCreator;
  priority?: boolean;
};

export function CreatorCard({ creator, priority = false }: CreatorCardProps) {
  const imageSrc = resolveMediaUrl(getCreatorProfileImage(creator));

  return (
    <article>
      <Link href={`/talent/${creator.slug}`} className="group block">
        <CreatorImage
          src={imageSrc}
          name={creator.display_name}
          alt={creator.display_name}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.12em] text-muted">
          {creator.primary_category}
        </p>
        <h2 className="mt-1 font-sans text-2xl font-bold tracking-[-0.02em] underline decoration-transparent underline-offset-[0.18em] transition-colors duration-200 group-hover:decoration-ink">
          {creator.display_name}
        </h2>
        {creator.city ? (
          <p className="mt-1 text-sm text-muted">{creator.city}</p>
        ) : null}
        <p className="mt-3 text-sm uppercase tracking-[0.08em] underline decoration-ink/30 underline-offset-[0.28em] transition-colors duration-200 group-hover:decoration-ink">
          View profile
        </p>
      </Link>
    </article>
  );
}
