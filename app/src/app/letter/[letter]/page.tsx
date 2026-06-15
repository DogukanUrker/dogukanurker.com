import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    letter: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { letter } = await params;
  const letterPath = `/letters/${letter}.pdf`;

  if (!letter) {
    notFound();
  }
  return (
    <div className="container mx-auto py-10">
      <div className="relative rounded-lg overflow-hidden h-[calc(100vh-5rem)]">
        <embed
          src={letterPath}
          type="application/pdf"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
