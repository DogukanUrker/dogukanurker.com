import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Doğukan Ürker
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-8">
          swe{" "}
          <a
            href="https://sensity.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            @sensity
          </a>{" "}
        </p>

        <div className="flex gap-6 justify-center text-sm">
          <Link
            href="/cv"
            className="text-gray-400 hover:text-white transition-colors"
          >
            cv
          </Link>
          <span className="text-gray-600">·</span>
          <a
            href="https://github.com/dogukanurker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            github
          </a>
          <span className="text-gray-600">·</span>
          <a
            href="https://twitter.com/dogukanurker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            twitter
          </a>
        </div>
      </div>
    </div>
  );
}
