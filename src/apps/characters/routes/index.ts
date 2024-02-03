import { API_V1_BASE_URL } from '$constants';

export const ROUTES = {
  base_v1: {
    url: '/',
    origin: API_V1_BASE_URL + '/characters',
  },
  details_v1: {
    url: '/:id',
    origin: API_V1_BASE_URL + '/characters',
  },
};
