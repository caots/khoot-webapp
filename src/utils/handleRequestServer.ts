import axios from 'axios';

export const axiosMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export interface AxiosConfig {
  url: string;
  method: any;
  data: any;
  headers: any;
}

export const axiosRequest = (url: string, method: any, token: string, data: any) => {
  let axiosConfig: AxiosConfig = {
    url,
    method,
    data,
    headers: {}
  };
  if (method !== axiosMethod.GET) {
    axiosConfig.headers['Content-Type'] = `application/json`;
  }
  if (token) {
    axiosConfig.headers['Authorization'] = `Bearer ${token}`;
  }
  axiosConfig.data = data;
  return axios(axiosConfig);
};

export const makeQuery = (object: Object) => {
  let query = `?`;
  let values = Object.entries(object);
  values.forEach((value, index) => {
    query += `${value[0]}=${value[1] === 0 ? 0 : value[1] || ''}`;
    if (index !== values.length - 1) {
      query += `&`;
    }
  });
  return query;
};
