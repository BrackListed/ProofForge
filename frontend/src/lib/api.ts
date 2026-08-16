// Points at the deployed backend in production; falls back to the local
// dev server so `npm run dev` keeps working without extra setup. Set
// VITE_API_URL in the frontend's environment (e.g. Vercel project
// settings) once the backend is deployed somewhere reachable.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
