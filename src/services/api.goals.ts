import type {Goal, GoalCreateFields, GoalUpdateFields} from "@/schemas/goal.ts";
import {getCookie} from "@/utils/cookies.ts";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders(): HeadersInit {
  const token = getCookie("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
}

export async function getGoals(): Promise<Goal[]> {
  const res = await fetch(`${API_URL}/api/Goals/GetMyGoals`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }
    throw new Error("Failed to fetch goals");
  }
  return await res.json();
}

export async function getGoal(id: number): Promise<Goal> {
  const res = await fetch(`${API_URL}/api/Goals/GetGoal/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }
    if (res.status === 404) {
      throw new Error("Goal not found");
    }
    throw new Error("Failed to fetch goal");
  }
  return await res.json();
}

export async function createGoal(data: GoalCreateFields): Promise<Goal> {
  const res = await fetch(`${API_URL}/api/Goals/CreateGoal`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }
    let detail = "Failed to create goal";
    try {
      const errorData = await res.json();
      if (typeof errorData?.message === "string") detail = errorData.message;
      else if (typeof errorData?.detail === "string") detail = errorData.detail;
      else if (typeof errorData?.title === "string") detail = errorData.title;
    } catch {
      // ignore error
    }
    throw new Error(detail);
  }
  return await res.json();
}

export async function updateGoal(id: number, data: GoalUpdateFields): Promise<void> {
  const res = await fetch(`${API_URL}/api/Goals/UpdateGoal/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }
    if (res.status === 404) {
      throw new Error("Goal not found");
    }
    let detail = "Failed to update goal";
    try {
      const errorData = await res.json();
      if (typeof errorData?.message === "string") detail = errorData.message;
      else if (typeof errorData?.detail === "string") detail = errorData.detail;
    } catch {
      // ignore error
    }
    throw new Error(detail);
  }
}

export async function deleteGoal(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/Goals/DeleteGoal/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }
    if (res.status === 404) {
      throw new Error("Goal not found");
    }
    throw new Error("Failed to delete goal");
  }
}
