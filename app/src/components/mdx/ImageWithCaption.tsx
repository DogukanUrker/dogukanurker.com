import Image from "next/image";

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function ImageWithCaption({
  src,
  alt,
  caption,
  width = 800,
  height = 600,
}: ImageWithCaptionProps) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm italic text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
