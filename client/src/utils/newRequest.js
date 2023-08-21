import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://fiverrtutorial-server.onrender.com/api/",
  withCredentials: true,
});

export default newRequest;
