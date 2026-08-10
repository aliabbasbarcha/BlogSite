import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) => (page <= 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <nav className="mt-12 flex items-center justify-between" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          prefetch={false}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}

      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          prefetch={false}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
