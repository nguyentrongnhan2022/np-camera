import { PRODUCT } from 'api/dataApi.js';

const getAll = () => {
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(PRODUCT);
  //   }, 5000);
  // });
  return axiosClient.get(URL, params)
};
export default {
  getAll,
};