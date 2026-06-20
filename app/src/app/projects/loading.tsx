export default function Loading() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center select-none"
      style={{
        backgroundColor: "var(--brand-cream)",
        color: "var(--brand-muted)",
      }}
    >
      <span className="font-serif text-lg tracking-wide lowercase">
        fetching latest...
      </span>
    </div>
  );
}
