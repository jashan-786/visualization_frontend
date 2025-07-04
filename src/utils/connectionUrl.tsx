//export const connectionUrl = "https://visualization-backend-oi6i.onrender.com";
//export const connectionUrl = "http://localhost:3000";
//export const connectionUrl =  "https://172.105.98.10:3000";
//export const connectionUrl = "http://172.105.98.10:3000";
export const connectionUrl = import.meta.env.VITE_API_CONNECTION_URL as string;
console.log("Connection URL:", connectionUrl);