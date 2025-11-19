import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole, type UserReadOnly, type UserUpdateFields } from "@/schemas/users";
import { 
  getAllUsers, 
  deleteUser, 
  promoteToAdmin, 
  demoteToUser,
  updateUser 
} from "@/services/api.users";
import { 
  Users, 
  Shield, 
  ShieldAlert, 
  User as UserIcon, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  X,
  Save,
  Search
} from "lucide-react";

export default function UserManagementPage() {
  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserReadOnly[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchUsername, setSearchUsername] = useState("");
  const [editingUser, setEditingUser] = useState<UserReadOnly | null>(null);
  const [editForm, setEditForm] = useState<UserUpdateFields>({});

  const isSuperAdmin = userRole === UserRole.SuperAdmin;
  const isAdmin = userRole === UserRole.Admin || isSuperAdmin;

  useEffect(() => {
    // Access control: Only Admin and SuperAdmin can access
    if (!isAuthenticated) {
      toast.error("You must sign in first");
      navigate("/login");
      return;
    }
    
    if (!isAdmin) {
      toast.error("Access denied - Admin or SuperAdmin role required");
      navigate("/goals");
      return;
    }
    
    loadUsers();
  }, [pageNumber, isAuthenticated, isAdmin, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await getAllUsers(pageNumber, pageSize, searchUsername);
      setUsers(result.data);
      setTotalRecords(result.totalRecords);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Users loading failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPageNumber(1);
    loadUsers();
  };

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      await deleteUser(id);
      toast.success(`User "${username}" deleted successfully`);
      loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  const handlePromote = async (id: number, username: string) => {
    try {
      await promoteToAdmin(id);
      toast.success(`User "${username}" promoted to Admin`);
      loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to promote");
    }
  };

  const handleDemote = async (id: number, username: string) => {
    try {
      await demoteToUser(id);
      toast.success(`User "${username}" demoted to User`);
      loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to demote");
    }
  };

  const startEdit = (user: UserReadOnly) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, editForm);
      toast.success("User updated successfully");
      setEditingUser(null);
      setEditForm({});
      loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case UserRole.SuperAdmin:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
            <ShieldAlert className="w-3 h-3" /> SuperAdmin
          </span>
        );
      case UserRole.Admin:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold rounded-full">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full">
            <UserIcon className="w-3 h-3" /> User
          </span>
        );
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                User Management
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isSuperAdmin ? "SuperAdmin Panel - Full Control" : "Admin Panel - User Management"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalRecords}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Users</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by username..."
                className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400"
              />
            </div>
          </div>
          <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          {searchUsername && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchUsername("");
                setPageNumber(1);
                setTimeout(loadUsers, 0);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                    #{user.id}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                    {user.username}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {getRoleBadge(user.userRole)}
                  </td>
                  <td className="px-6 py-5
                   whitespace-nowrap text-right text-sm space-x-2">
                    {/* Edit Button - All Admins */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(user)}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    {/* Promote/Demote Buttons - SuperAdmin ONLY */}
                    {isSuperAdmin && user.userRole === UserRole.User && (
                      <Button
                        size="sm"
                        onClick={() => handlePromote(user.id, user.username)}
                        className="bg-green-600 hover:bg-green-700"
                        title="Promote to Admin"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {isSuperAdmin && user.userRole === UserRole.Admin && (
                      <Button
                        size="sm"
                        onClick={() => handleDemote(user.id, user.username)}
                        className="bg-orange-600 hover:bg-orange-700"
                        title="Demote to User"
                      >
                        <TrendingDown className="w-4 h-4" />
                      </Button>
                    )}

                    {/* Delete Button - All Admins */}
                    {user.userRole !== UserRole.SuperAdmin && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(user.id, user.username)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Page {pageNumber} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber === 1}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
                  disabled={pageNumber === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Edit User
              </h2>
              <button
                onClick={cancelEdit}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={editForm.username || ""}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                />
              </div>

              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email || ""}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                />
              </div>

              <div>
                <Label htmlFor="edit-firstname">First Name</Label>
                <Input
                  id="edit-firstname"
                  value={editForm.firstname || ""}
                  onChange={(e) => setEditForm({ ...editForm, firstname: e.target.value })}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                />
              </div>

              <div>
                <Label htmlFor="edit-lastname">Last Name</Label>
                <Input
                  id="edit-lastname"
                  value={editForm.lastname || ""}
                  onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleUpdate}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={cancelEdit}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
