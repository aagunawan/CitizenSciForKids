import axios from "axios";
axios.defaults.withCredentials = true;
export default axios.create({
  baseURL: "http://localhost:8080/api",

  headers: {
    "Content-type": "application/json",
    // withCredentials:true
  },
  credentials: 'include'
});