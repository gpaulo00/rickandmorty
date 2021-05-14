
const limit = 12;

const getPagination = (page) => {
  let offset = page ? (page-1) * limit : 0;
  if (offset < 0) offset = 0;

  return { limit, offset };
};

const formatPage = (data, page) => {
  const { count: totalItems, rows } = data;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;

  const totalPages = Math.ceil(totalItems / limit) - 1;
  const hasNext = currentPage < totalPages;

  return {
    info: { total: totalItems, page: currentPage, totalPages, hasNext },
    data: rows,
  };
};

module.exports = {
  getPagination,
  formatPage,
};