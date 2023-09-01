import axios from "axios";

const newRequest = axios.create({
  // baseURL: "https://fiverrtutorial-server.onrender.com/api/",
  baseURL: "http://localhost:8080/api/",
  withCredentials: true,
});

export default newRequest;
