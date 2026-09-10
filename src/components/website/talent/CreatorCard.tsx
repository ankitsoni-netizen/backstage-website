import Link from "next/link";

import { CreatorImage } from "@/components/ui/CreatorImage";
import type { PublicCreator } from "@/types/public";
import { getCreatorProfileImage } from "@/lib/utilities/creators";
import { resolveMediaUrl } from "@/lib/utilities/storage";

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
        <h2 className="mt-4 font-display text-[1.45rem] leading-tight font-semibold tracking-[-0.03em] uppercase">
          {creator.display_name}
        </h2>
        <p className="mt-2 text-kicker text-oxblood">{creator.primary_category}</p>
        {creator.city ? (
          <p className="mt-1 text-sm text-muted">{creator.city}</p>
        ) : null}
      </Link>
    </article>
  );
}
