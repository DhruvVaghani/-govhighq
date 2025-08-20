// frontend/src/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // comes from build-time env
  timeout: 30000,                          // optional, avoid long hangs
});

// Example call
export async function chat(user_input, thread_id) {
  const { data } = await api.post("/chat", { user_input, thread_id });
  return data.response; // matches your FastAPI response_model
}
