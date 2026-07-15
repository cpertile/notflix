type TmdbLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const POSTER_SIZES = [92, 154, 185, 342, 500, 780] as const;
const BACKDROP_SIZES = [300, 780, 1280] as const;

function extractPath(src: string): string {
  const fromSized = src.match(/\/t\/p\/(?:w\d+|original)(\/[^?#]+)/);
  if (fromSized) return fromSized[1];
  if (src.startsWith("/")) return src;
  try {
    return new URL(src).pathname;
  } catch {
    return src;
  }
}

function pickSize(width: number, sizes: readonly number[]): string {
  const match = sizes.find((size) => width <= size) ?? sizes[sizes.length - 1];
  return `w${match}`;
}

export default function tmdbLoader({ src, width }: TmdbLoaderProps): string {
  const path = extractPath(src);
  const isBackdrop = src.includes("backdrop") || width > 500;
  const size = isBackdrop
    ? pickSize(width, BACKDROP_SIZES)
    : pickSize(width, POSTER_SIZES);
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
