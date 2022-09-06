import axios from "@/utils/axios.js";
import { apiUrl } from "@/config/config";

export function getFoods() {
  return axios.get(`${apiUrl}foods/`);
}
