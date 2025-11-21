import {useEffect, useState, useMemo} from "react";
import {deleteGoal, getGoals} from "@/services/api.goals.ts";
import type {Goal} from "@/schemas/goal.ts";
import {Button} from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {Pencil, Trash2, Plus, Target, Search, Filter, X, AlertTriangle} from "lucide-react";
import {useNavigate} from "react-router";
import {toast} from "sonner";
import {Input} from "@/components/ui/input.tsx";

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [dueDateFilter, setDueDateFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("dueDate-asc");
  const [deleteConfirmGoal, setDeleteConfirmGoal] = useState<Goal | null>(null);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load goals"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (goal: Goal) => {
    setDeleteConfirmGoal(goal);
  };
  
  const confirmDelete = async () => {
    if (!deleteConfirmGoal) return;
    
    try {
      await deleteGoal(deleteConfirmGoal.id);
      toast.success("Goal deleted successfully");
      setDeleteConfirmGoal(null);
      // Refresh the list
      setGoals(goals.filter(goal => goal.id !== deleteConfirmGoal.id));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete goal"
      );
    }
  };

  useEffect(() => {
    loadGoals();
  }, [])
  
  // Get unique categories from goals
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    goals.forEach(goal => {
      if (goal.categoryName) uniqueCategories.add(goal.categoryName);
    });
    return Array.from(uniqueCategories).sort();
  }, [goals]);
  
  // Filter and sort goals
  const filteredAndSortedGoals = useMemo(() => {
    let filtered = goals;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(goal => goal.status === statusFilter);
    }
    
    // Category filter
    if (categoryFilter !== "All") {
      if (categoryFilter === "No Category") {
        filtered = filtered.filter(goal => !goal.categoryName);
      } else {
        filtered = filtered.filter(goal => goal.categoryName === categoryFilter);
      }
    }
    
    // Due date filter
    if (dueDateFilter !== "All") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(goal => {
        if (!goal.dueDate) return false;
        const dueDate = new Date(goal.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDateFilter === "Overdue") {
          return dueDate < today && goal.status !== "Completed";
        } else if (dueDateFilter === "Today") {
          return dueDate.getTime() === today.getTime();
        } else if (dueDateFilter === "This Week") {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          return dueDate >= today && dueDate <= weekFromNow;
        }
        return true;
      });
    }
    
    // Sorting
    const sorted = [...filtered];
    const [sortField, sortOrder] = sortBy.split('-');
    
    sorted.sort((a, b) => {
      let aVal: string | number = 0;
      let bVal: string | number = 0;

      if (sortField === 'dueDate') {
        aVal = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        bVal = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      } else if (sortField === 'category') {
        aVal = a.categoryName || 'zzz';
        bVal = b.categoryName || 'zzz';
      } else if (sortField === 'status') {
        aVal = a.status;
        bVal = b.status;
      } else if (sortField === 'created') {
        aVal = new Date(a.createdDate).getTime();
        bVal = new Date(b.createdDate).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return sorted;
  }, [goals, searchQuery, statusFilter, categoryFilter, dueDateFilter, sortBy]);
  
  // Progress stats
  const stats = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter(g => g.status === "Completed").length;
    const inProgress = goals.filter(g => g.status === "InProgress").length;
    const overdue = goals.filter(g => {
      if (!g.dueDate || g.status === "Completed") return false;
      const dueDate = new Date(g.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;
    
    return { total, completed, inProgress, overdue };
  }, [goals]);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setDueDateFilter("All");
  };
  
  const hasActiveFilters = searchQuery || statusFilter !== "All" || categoryFilter !== "All" || dueDateFilter !== "All";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl space-y-6">
      {/* Page Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                My Goals
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage and track your personal goals
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.total}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Goals</div>
          </div>
        </div>
      </div>
      
      {goals.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div
              className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md cursor-pointer"
              onClick={() => navigate("/goals/new")}
            >
            <Plus
                className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">No goals yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-7 leading-relaxed">Start by creating your first goal to begin tracking your progress!</p>
            <Button 
              onClick={() => navigate("/goals/new")} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filters Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex flex-col gap-4">
              {/* Search Bar with New Goal Button */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search goals by title..."
                    className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button 
                  onClick={() => navigate("/goals/new")} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </div>
              
              {/* Filters and Sorting Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Status Filter */}
                <div className="flex-1">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                  >
                    <option value="All">All Statuses</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
                {/* Category Filter */}
                <div className="flex-1">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>📁 {cat}</option>
                    ))}
                    <option value="No Category">No Category</option>
                  </select>
                </div>
                
                {/* Due Date Filter */}
                <div className="flex-1">
                  <select
                    value={dueDateFilter}
                    onChange={(e) => setDueDateFilter(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                  >
                    <option value="All">All Due Dates</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Today">Due Today</option>
                    <option value="This Week">Due This Week</option>
                  </select>
                </div>
                
                {/* Sort By */}
                <div className="flex-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                  >
                    <option value="dueDate-asc">Due Date (Earliest)</option>
                    <option value="dueDate-desc">Due Date (Latest)</option>
                    <option value="category-asc">Category (A-Z)</option>
                    <option value="category-desc">Category (Z-A)</option>
                    <option value="status-asc">Status (A-Z)</option>
                    <option value="created-desc">Recently Created</option>
                    <option value="created-asc">Oldest First</option>
                  </select>
                </div>
              </div>
              
              {/* Active Filters Info & Clear Button */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Showing {filteredAndSortedGoals.length} of {goals.length} goals
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        
        {/* Goals Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className={`overflow-x-auto ${filteredAndSortedGoals.length > 5 ? "max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent" : ""}`}>
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-12 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredAndSortedGoals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-slate-500 dark:text-slate-400">
                        <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">No goals match your filters</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedGoals.map((goal) => (
                    <tr 
                      key={goal.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        #{goal.id}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {goal.title}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                          goal.status === "Completed" ? "bg-gradient-to-r from-green-100 to-green-50 text-green-800 dark:from-green-900/30 dark:to-green-900/20 dark:text-green-400" :
                          goal.status === "Cancelled" ? "bg-gradient-to-r from-red-100 to-red-50 text-red-800 dark:from-red-900/30 dark:to-red-900/20 dark:text-red-400" :
                          "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 dark:from-blue-900/30 dark:to-blue-900/20 dark:text-blue-400"
                        }`}>
                          {goal.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap font-semibold text-sm">
                        {goal.categoryName ? (
                          <span className="text-slate-700 font-semibold dark:text-slate-300">
                            📁 {goal.categoryName}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 italic">No Category</span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/goals/${goal.id}`)}
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(goal)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
      
      {/* Delete Goal Confirmation Dialog */}
      <Dialog open={!!deleteConfirmGoal} onOpenChange={() => setDeleteConfirmGoal(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Delete Goal?
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 dark:text-slate-400 pt-4">
              <div className="space-y-3">
                <p className="font-semibold text-red-600 dark:text-red-400">
                  ⚠️ Warning: This action cannot be undone.
                </p>
                <p>
                  You are about to permanently delete the goal{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    "{deleteConfirmGoal?.title}"
                  </span>
                  .
                </p>
                <p className="text-sm">
                  All progress and data associated with this goal will be permanently removed. Are you sure you want to proceed?
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmGoal(null)}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              className="h-11 px-6 shadow-lg hover:shadow-xl transition-all"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Delete Goal
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GoalsPage;