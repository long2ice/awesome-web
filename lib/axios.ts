import axios from "axios";
import { get_sign, getRandomStr } from "./sign";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

http.interceptors.request.use((config) => {
  let timestamp = new Date().getTime().toString().substring(0, 10);
  let nonce = getRandomStr(8);
  let data;
  if (config.method === "get" || config.method === "delete") {
    data = config.params;
  } else {
    data = config.data;
  }
  // @ts-ignore
  config.headers["timestamp"] = timestamp;
  // @ts-ignore
  config.headers["nonce"] = nonce;
  // @ts-ignore
  config.headers["sign"] = get_sign(data, timestamp, nonce);
  return config;
});
export default http;
