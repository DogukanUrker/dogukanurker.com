interface TimelineProps {
  children: React.ReactNode;
}

interface TimelineItemProps {
  title: string;
  date?: string;
  children: React.ReactNode;
}

export function Timeline({ children }: TimelineProps) {
  return (
    <div className="my-8 space-y-8 border-l-2 border-zinc-800 pl-8">
      {children}
    </div>
  );
}

export function TimelineItem({ title, date, children }: TimelineItemProps) {
  return (
    <div className="relative">
      {/* Dot */}
      <div className="absolute -left-[37px] top-1 h-4 w-4 rounded-full border-2 border-zinc-800 bg-zinc-900" />

      {/* Content */}
      <div className="space-y-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
          {date && (
            <time className="text-sm text-zinc-500">{date}</time>
          )}
        </div>
        <div className="text-sm leading-relaxed text-zinc-400">
          {children}
        </div>
      </div>
    </div>
  );
}
