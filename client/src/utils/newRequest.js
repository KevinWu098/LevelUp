import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://fiverrtutorial-server.onrender.com/api/",
  // baseURL: "http://localhost:8080/api/",
  withCredentials: true,
});

// Create an Axios request interceptor
newRequest.interceptors.request.use(
  (config) => {
    // Get the user object from localStorage or wherever it's stored
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
      // Add the userId and isSeller properties to the request data
      config.data = {
        ...config.data,
        userId: user._id,
        isSeller: user.isSeller,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
