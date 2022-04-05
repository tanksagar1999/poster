import axios from "axios";
import { message } from "antd";
import { getItem } from "../../utility/localStorageControl";
import Cookies from "js-cookie";

const API_ENDPOINT = `http://172.105.35.50:7000/api/`;

const authHeader = () => ({
  Authorization: `Bearer ${getItem("access_token")}`,
});

const client = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    Authorization: `Bearer ${getItem("access_token")}`,
    "Content-Type": "application/json",
  },
});

class DataService {
  static get(path = "") {
    return client({
      method: "GET",
      url: path,
      headers: { ...authHeader() },
    });
  }

  static delete(path = "") {
    return client({
      method: "DELETE",
      url: path,
      headers: { ...authHeader() },
    });
  }

  static post(path = "", data = {}, optionalHeader = {}) {
    return client({
      method: "POST",
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader },
    });
  }

  static patch(path = "", data = {}) {
    return client({
      method: "PATCH",
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }

  static put(path = "", data = {}) {
    return client({
      method: "PUT",
      url: path,
      data,
      headers: { ...authHeader() },
    });
  }
}

/**
 * axios interceptors runs before and after a request, letting the developer modify req,req more
 * For more details on axios interceptor see https://github.com/axios/axios#interceptors
 */
client.interceptors.request.use((config) => {
  // do something before executing the request
  // For example tag along the bearer access token to request header or set a cookie
  const requestConfig = config;
  const { headers } = config;
  requestConfig.headers = {
    ...headers,
    Authorization: `Bearer ${getItem("access_token")}`,
    ReceiptNumber: 1234567,
  };
  return requestConfig;
});

client.interceptors.response.use(
  (response) => {
    Cookies.set("id", 1234567);

    if (response.data.messageCode == "ALREADY_IN_USE") {
      message.success({
        content: response.data.message,
        style: {
          float: "right",
          marginTop: "2vh",
        },
      });
    }
    return response;
  },
  (error) => {
    /**
     * Do something in case the response returns an error code [3**, 4**, 5**] etc
     * For example, on token expiration retrieve a new access token, retry a failed request etc
     */
    const { response } = error;

    const originalRequest = error.config;
    if (response) {
      if (response.status === 500) {
        // To Do
      } else if (response.status === 400) {
        message.error({
          content: response.data.message,
          style: {
            float: "right",
            marginTop: "2vh",
          },
        });
      } else {
        return originalRequest;
      }
    } else {
      // message.error({
      //   content: `Something went wrong. Please check your internet connection and try again!`,
      //   style: {
      //     float: "right",
      //     marginTop: "2vh",
      //   },
      // });
    }
    return Promise.reject(error);
  }
);
export { DataService };
