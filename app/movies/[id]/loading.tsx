import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <div className="relative w-full h-[50vh] bg-muted">
        <Skeleton className="w-full h-full" />
        <div className="container absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-[200px] h-[300px] rounded-lg shrink-0" />
            <div className="flex flex-col gap-4 py-4">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-[150px] h-[220px] rounded-lg shrink-0" />
          ))}
        </div>
      </div>

      <div className="container">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

