export const READINGS_PAGE_SIZE = 3

export function getTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0) {
    return 1
  }
  return Math.ceil(totalItems / pageSize)
}

export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1))
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): T[] {
  const totalPages = getTotalPages(items.length, pageSize)
  const safePage = clampPage(page, totalPages)
  const start = (safePage - 1) * pageSize
  return items.slice(start, start + pageSize)
}
