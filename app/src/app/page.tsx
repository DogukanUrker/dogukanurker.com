import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center font-mono select-none">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter b-4">
          dogukan urker
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 mb-4">
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

        <div className="flex gap-5 justify-center text-sm">
          <Link
            href="/cv"
            className="text-neutral-400 hover:text-neutral-50 transition-colors"
          >
            cv
          </Link>
          <a
            href="https://github.com/dogukanurker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-neutral-50 transition-colors"
          >
            github
          </a>
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
