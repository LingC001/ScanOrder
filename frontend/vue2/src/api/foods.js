import axios from "@/utils/axios.js";
import { apiUrl } from "@/config/config";

export function getFoods() {
  return axios.get(`${apiUrl}foods/`);
}

export function addFood(data) {
  return axios({
    method: "post",
    url: `${apiUrl}foods/`,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
