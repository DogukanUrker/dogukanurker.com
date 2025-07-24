"use client";

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <div className="relative rounded-lg overflow-hidden h-[calc(100vh-5rem)]">
        <embed
          src="/cv.pdf"
          type="application/pdf"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
