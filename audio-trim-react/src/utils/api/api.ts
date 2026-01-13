import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AuthData {
  email: string;
  password: string;
}

interface ResetData {
  password: string;
}

export interface Job {
  ID: string;
  Status: "queued" | "processing" | "completed" | "failed";
  ZipPath?: string | null;
  Files?: {
    OutputPath?: string | null;
    Status: string;
  }[];
}

// Signup
export const signup = (data: AuthData) =>
  api.post("/register", data);

// Login
export const login = (data: AuthData) =>
  api.post<{ token: string }>("/login", data);

// Forgot password
export const forgotPassword = (data: { email: string }) =>
  api.post("/forgot-password", data);

// Change password
export const changePassword = (data: ResetData) =>
  api.post("/change-password", data);

// Reset password via email token
export const resetPassword = (token: string, data: ResetData) =>
  api.post(`/reset-password/${token}`, data);

export const convertAudio = (data: FormData) => {
  return api.post<{ job_id: string }>("/auth/convert", data);
};

export const getJobStatus = (jobId: string) => {
  return api.get<Job>(`/auth/jobs/${jobId}`);
};

export const downloadResult = (jobId: string) => {
  return api.get(`/auth/download/${jobId}`, {
    responseType: "blob",
  });
};


export default api;