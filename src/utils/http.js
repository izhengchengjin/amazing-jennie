import axios from "axios";
import { getToken } from "@/utils/token";
import { history } from "@/utils/history";

// 封装 axios
// 实例化
const http = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (responce) => {
    return responce.data;
  },
  (error) => {
    // debugger;
    if (error.response.status === 401) {
      console.log("login");
      history.push("/login");
    }
    return Promise.reject(error);
  }
);

export { http };
