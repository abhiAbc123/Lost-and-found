import axios from "axios";

const APIAdmin = axios.create({
  baseURL: "https://project-backend-ewnt.onrender.com/api/admin",

});


export const setAdminToken = (token) => {
  if (token) {
    APIAdmin.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete APIAdmin.defaults.headers.common["Authorization"];
  }
};


const token = localStorage.getItem("adminToken");
if (token) setAdminToken(token);


export const loginAdmin = (data) => APIAdmin.post("/login", data);
 export const signupAdmin = (data) => APIAdmin.post("/signup", data);


export const getAllUsers = () => APIAdmin.get("/users");
export const getAllItems = () => APIAdmin.get("/items");


export const deleteUser = (id) => APIAdmin.delete(`/users/${id}`);
export const deleteItem = (id) => APIAdmin.delete(`/items/${id}`);

export default APIAdmin;
