import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-12 w-64" />
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-40" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-3 md:p-4">
                <Skeleton className="h-6 w-24" />
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
