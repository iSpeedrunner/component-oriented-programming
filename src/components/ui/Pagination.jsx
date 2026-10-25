import './Pagination.css'

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50]

function getPageItems(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-right', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis-left', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis-left', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-right', totalPages]
}

function Pagination({
  totalItems,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  currentPage,
  onPageChange,
  onPageSizeChange,
  ariaLabel = 'Pagination',
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const visiblePage = Math.min(currentPage, totalPages)
  const pageStart = totalItems === 0 ? 0 : (visiblePage - 1) * pageSize + 1
  const pageEnd = Math.min(visiblePage * pageSize, totalItems)
  const pageItems = getPageItems(totalPages, visiblePage)

  return (
    <nav className="pagination" aria-label={ariaLabel}>
      <div className="pagination-summary">
        <span>{totalItems === 0 ? 'No items' : `Showing ${pageStart}–${pageEnd} of ${totalItems}`}</span>
        <label className="page-size-control">
          <span>Per page</span>
          <select
            value={pageSize}
            onChange={event => onPageSizeChange(Number(event.target.value))}
            aria-label="Items per page"
          >
            {pageSizeOptions.map(option => (
              <option value={option} key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            type="button"
            className="pagination-button pagination-arrow"
            onClick={() => onPageChange(visiblePage - 1)}
            disabled={visiblePage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          {pageItems.map(page => page.toString().startsWith('ellipsis') ? (
            <span className="pagination-ellipsis" key={page}>…</span>
          ) : (
            <button
              key={page}
              type="button"
              className={`pagination-button ${page === visiblePage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === visiblePage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="pagination-button pagination-arrow"
            onClick={() => onPageChange(visiblePage + 1)}
            disabled={visiblePage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </nav>
  )
}

export default Pagination
