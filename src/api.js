import axios from "axios";


const API = axios.create({
  baseURL: "https://project-backend-ewnt.onrender.com/api",
});


export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};


const token = localStorage.getItem("token");
if (token) setAuthToken(token);


export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const facebookLogin = (data) => API.post("/auth/facebook-login", data);
export const getCurrentUser = () => API.get("/auth/me");


export const getUserItems = () => API.get("/items"); 
export const createUserItem = (data) => API.post("/items", data);
export const deleteUserItem = (id) => API.delete(`/items/${id}`);
export const getAllItems = () => API.get("/items/all"); 
export const updateUserItem = (id, data) => API.put(`/items/${id}`, data);

export const getItemComments = (itemId) => API.get(`/comments/item/${itemId}`); 
export const addComment = (itemId, data) => API.post(`/comments/item/${itemId}`, data); 
export const deleteComment = (commentId) => API.delete(`/comments/${commentId}`); 

export const generateDescription = (name,location) =>
  API.post("/items/ai/description", { name,location });

export const generateLostDescription = (name, location) =>
  API.post("/items/ai/lost-description", { name, location });
export const chatWithBot = (message) =>
  API.post("/items/ai/chat", { message });


export default API;
