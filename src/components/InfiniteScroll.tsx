"use client";

import { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export default function InfiniteScroll({ onLoadMore, isLoading, hasMore }: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore, isLoading, hasMore]);

  return (
    <div ref={sentinelRef} className="flex h-20 items-center justify-center">
      {isLoading && (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-notflix-red" />
      )}
    </div>
  );
}
