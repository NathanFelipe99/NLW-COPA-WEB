import axios from "axios";

export const wApi = axios.create({
    baseURL: "http://localhost:3333"
});