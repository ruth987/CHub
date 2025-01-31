import { useInfiniteQuery } from "@tanstack/react-query"

interface UseInfiniteScrollOptions {
  queryKey: string[]
  queryFn: ({ pageParam }: { pageParam?: number }) => Promise<any>
  getNextPageParam: (lastPage: any, pages: any[]) => number | undefined
}

export function useInfiniteScroll({
  queryKey,
  queryFn,
  getNextPageParam,
}: UseInfiniteScrollOptions) {
  return useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam: 1,
  })
}