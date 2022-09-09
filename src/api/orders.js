import axios from "@/utils/axios.js";
import { apiUrl } from "@/config/config";

export function createOrder(data) {
  return axios.post(`${apiUrl}orders/`, data);
}

export function getOrderList() {
  return axios.get(`${apiUrl}orders/`);
}

export function getOrderDetail(id) {
  return axios.get(`${apiUrl}orders/getDetail`, {
    params: {
      id,
    },
  });
}
