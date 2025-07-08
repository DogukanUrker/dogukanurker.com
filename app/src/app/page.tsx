import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center font-mono">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight b-4">
          dogukan urker
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 mb-8">
          swe{" "}
          <a
            href="https://sensity.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-neutral-50 transition-colors"
          >
            @sensity
          </a>{" "}
        </p>

        <div className="flex gap-6 justify-center text-sm">
          <Link
            href="/cv"
            className="text-neutral-400 hover:text-neutral-50 transition-colors"
          >
            cv
          </Link>
          <span className="text-neutral-600">·</span>
          <a
            href="https://github.com/dogukanurker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-neutral-50 transition-colors"
          >
            github
          </a>
          <span className="text-neutral-600">·</span>
          <a
            href="https://twitter.com/dogukanurker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-neutral-50 transition-colors"
          >
            twitter
          </a>
        </div>
      </div>
    </div>
  );
}
