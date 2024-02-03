export const ALLOWED_FILTERS: Record<string, string> = {
  gender: 'gender',
  status: 'status',
  species: 'species',
};

export const extractFilters = (query: Record<string, string>) => {
  // Returns filters as object {key: string, value: Array[]}

  // First get all the supported filters and spits out and Array of {key: [...]}
  // Then it turns it simply into and object
  const filters = Object.values(ALLOWED_FILTERS)
    .map((filter) => {
      return {
        [filter]: query[filter]?.split(/\s*,\s*/) || [],
      };
    })
    .reduce((acc, current) => {
      acc = { ...acc, ...current };
      return acc;
    }, {});

  return filters;
};
