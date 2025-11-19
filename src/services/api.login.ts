import type {LoginFields} from "@/schemas/login.ts";

const API_URL = import.meta.env.VITE_API_URL;

export type LoginResponse = {
  token: string;
  username: string;
  role: string;
  expiresAt: string;
}

export async function login({username, password}: LoginFields): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // CRITICAL: Allow cookies cross-origin
    body: JSON.stringify({
      username,
      password,
      keepLoggedIn: false,
    }),
  })

  if (!res.ok){
    let detail = "Login failed";
    try {
      const data = await res.json();
      if (typeof data?.message === "string") detail = data.message;
      else if (typeof data?.detail === "string") detail = data.detail;
      else if (typeof data?.title === "string") detail = data.title;
    } catch (error){
      console.log(error);
    }
    throw new Error(detail);
  }
  return await res.json();
}

