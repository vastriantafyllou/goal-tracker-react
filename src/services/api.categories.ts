import type {Category, CategoryCreateFields, CategoryUpdateFields} from "@/schemas/category.ts";
import {getCookie} from "@/utils/cookies.ts";

const API_URL = import.meta.env.VITE_API_URL;

// Generate authenticated request headers with JWT token
function getAuthHeaders(): HeadersInit {
  const token = getCookie("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
}

// Get categories of authenticated user
export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error("Failed to load categories");
  }
  return await res.json();
}

// Create new category (user-specific)
export async function createCategory(data: CategoryCreateFields): Promise<Category> {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  // Handle category creation errors
  if (!res.ok) {
    let detail = "Failed to create category";
    try {
      const errorData = await res.json();
      if (typeof errorData?.message === "string") detail = errorData.message;
      else if (typeof errorData?.detail === "string") detail = errorData.detail;
      else if (typeof errorData?.title === "string") detail = errorData.title;
    } catch {
      // JSON parsing failed, use default error message
    }
    throw new Error(detail);
  }
  return await res.json();
}

export async function getCategory(id: number): Promise<Category> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error("Category not found");
    throw new Error("Failed to load category");
  }
  return await res.json();
}

export async function updateCategory(
  id: number,
  data: CategoryUpdateFields
): Promise<void> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error("Category not found");
    throw new Error("Failed to update category");
  }
}

// Delete category
export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error("Failed to delete category");
  }
}
