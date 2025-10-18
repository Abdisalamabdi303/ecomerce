import Image from "next/image";
import Link from "next/link";

export function CollectionCard({
  name,
  slug,
  description,
  preview,
}: {
  name: string;
  slug: string;
  description?: string | null;
  preview?: string | null;
}) {
  return (
    <Link href={`/collections/${slug}`} className="group block">
      <div className="aspect-[3/2] overflow-hidden rounded-lg matte border border-white/10">
        {preview ? (
          <Image
            src={preview}
            alt={name}
            width={900}
            height={600}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="mt-3">
        <h3 className="text-lg font-semibold tracking-wide">{name}</h3>
        {description ? (
          <p className="text-sm text-neutral-400 line-clamp-2">{description}</p>
        ) : null}
      </div>
    </Link>
  );
}


