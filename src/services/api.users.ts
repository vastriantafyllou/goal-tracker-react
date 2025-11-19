import type {UserReadOnly, UserUpdateFields, PaginatedResult, UserSignupFields} from "@/schemas/users.ts";
import {getCookie} from "@/utils/cookies.ts";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders(): HeadersInit {
  const token = getCookie("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
}

// Get all users with pagination and filters (Admin/SuperAdmin only)
export async function getAllUsers(
  pageNumber: number = 1, 
  pageSize: number = 10,
  username?: string,
  email?: string,
  userRole?: string
): Promise<PaginatedResult<UserReadOnly>> {
  const params = new URLSearchParams();
  params.append("pageNumber", pageNumber.toString());
  params.append("pageSize", pageSize.toString());
  if (username) params.append("username", username);
  if (email) params.append("email", email);
  if (userRole) params.append("userRole", userRole);

  const res = await fetch(`${API_URL}/api/Users/GetAllUsers?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized access");
    if (res.status === 403) throw new Error("You do not have access permission");
    throw new Error("Failed to load users");
  }
  return await res.json();
}

/**
 * Get user by ID (Admin/SuperAdmin only)
 *
 * ⚠️ Note: Currently not used in UserManagementPage (uses getAllUsers instead)
 * Useful for: dedicated user profile pages, deep linking, user lookup
 *
 * @param id - User ID
 * @returns Full user details
 */
export async function getUserById(id: number): Promise<UserReadOnly> {
  const res = await fetch(`${API_URL}/api/Users/GetUserById/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized access");
    if (res.status === 404) throw new Error("User not found");
    throw new Error("Failed to load user");
  }
  return await res.json();
}

/**
 * Get user by username (Admin/SuperAdmin only)
 *
 * ⚠️ Note: Currently not used in UserManagementPage (uses getAllUsers with filter)
 * Useful for: username validation, autocomplete, search by username
 *
 * @param username - Username to search
 * @returns Full user details
 */
export async function getUserByUsername(username: string): Promise<UserReadOnly> {
  const res = await fetch(`${API_URL}/api/Users/by-username/${username}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized access");
    if (res.status === 404) throw new Error("User not found");
    throw new Error("Failed to load user");
  }
  return await res.json();
}

export async function register(userData: UserSignupFields): Promise<UserReadOnly> {
  const res = await fetch(`${API_URL}/api/Users/RegisterUser/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    let detail = "Registration failed";
    try {
      const data = await res.json();
      if (typeof data?.message === "string") detail = data.message;
      else if (typeof data?.detail === "string") detail = data.detail;
      else if (typeof data?.title === "string") detail = data.title;
      // Handle validation errors
      else if (data?.errors) {
        const errors = Object.values(data.errors).flat();
        detail = errors.join(", ");
      }
    } catch (error) {
      console.log(error);
    }
    throw new Error(detail);
  }
  return await res.json();
}

// Update a user (Admin/SuperAdmin only)
export async function updateUser(id: number, userData: UserUpdateFields): Promise<UserReadOnly> {
  const res = await fetch(`${API_URL}/api/Users/UpdateUser/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(userData),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to update user");
  }
  return await res.json();
}

// Delete a user (Admin/SuperAdmin only)
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/Users/DeleteUser/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized access");
    if (res.status === 404) throw new Error("User not found");
    throw new Error("Failed to delete user");
  }
}

// Promote user to Admin (SuperAdmin only)
export async function promoteToAdmin(id: number): Promise<UserReadOnly> {
  const res = await fetch(`${API_URL}/api/Users/PromoteToAdmin/${id}/promote`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized access");
    if (res.status === 403) throw new Error("Only SuperAdmin can promote users");
    throw new Error("Failed to promote user");
  }
  return await res.json();
}

// Demote user to regular User (SuperAdmin only)
export async function demoteToUser(id: number): Promise<UserReadOnly> {
  const res = await fetch(`${API_URL}/api/Users/DemoteToUser/${id}/demote`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized access");
    if (res.status === 403) throw new Error("Only SuperAdmin can demote users");
    throw new Error("Failed to demote user");
  }
  return await res.json();
}
