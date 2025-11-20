import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {useEffect, useState, useMemo} from "react";
import {deleteGoal, getGoals} from "@/services/api.goals.ts";
import type {Goal} from "@/schemas/goal.ts";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash2, Plus, Target, Search, Filter, X, CheckCircle2, Clock, AlertCircle} from "lucide-react";
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      await deleteGoal(id);
      toast.success("Goal deleted successfully");
      // Refresh the list
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete goal"
      );
    }
  }

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
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 transition-all">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">My Goals</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage and track your personal goals</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/goals/new")} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>
          
          {/* Progress Stats */}
          {goals.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">In Progress</div>
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{stats.inProgress}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-xs text-green-600 dark:text-green-400">Completed</div>
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">{stats.completed}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <div>
                  <div className="text-xs text-red-600 dark:text-red-400">Overdue</div>
                  <div className="text-lg font-bold text-red-700 dark:text-red-300">{stats.overdue}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {goals.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
              <Plus className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 transition-all">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
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
          <Table>
            <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30">
              <TableRow className="border-b-2 border-slate-200 dark:border-slate-700">
                <TableHead className="w-[80px] font-bold text-slate-800 dark:text-slate-100 py-6 px-4">ID</TableHead>
                <TableHead className="font-bold text-slate-800 dark:text-slate-100 py-6">Title</TableHead>
                <TableHead className="font-bold text-slate-800 dark:text-slate-100 py-6">Status</TableHead>
                <TableHead className="font-bold text-slate-800 dark:text-slate-100 py-6">Due Date</TableHead>
                <TableHead className="font-bold text-slate-800 dark:text-slate-100 py-6">Category</TableHead>
                <TableHead className="text-right font-bold text-slate-800 dark:text-slate-100 py-6 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedGoals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="text-slate-500 dark:text-slate-400">
                      <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-medium">No goals match your filters</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : 
                filteredAndSortedGoals.map((goal) => (
                <TableRow 
                  key={goal.id} 
                  className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-800/30 dark:hover:to-transparent transition-all duration-200 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <TableCell className="font-bold text-slate-500 dark:text-slate-500 py-6">{goal.id}</TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-slate-100 py-6">{goal.title}</TableCell>
                  <TableCell className="py-6">
                    <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                      goal.status === "Completed" ? "bg-gradient-to-r from-green-100 to-green-50 text-green-800 dark:from-green-900/30 dark:to-green-900/20 dark:text-green-400" :
                      goal.status === "Cancelled" ? "bg-gradient-to-r from-red-100 to-red-50 text-red-800 dark:from-red-900/30 dark:to-red-900/20 dark:text-red-400" :
                      "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 dark:from-blue-900/30 dark:to-blue-900/20 dark:text-blue-400"
                    }`}>
                      {goal.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-6">
                    {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300 py-6">
                    {goal.categoryName ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300">
                        📁 {goal.categoryName}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-sm italic">No Category</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-6">
                    <div className="flex justify-end gap-2.5">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => navigate(`/goals/${goal.id}`)}
                        className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md hover:scale-105"
                      >
                        <Pencil className="w-4 h-4"/>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleDelete(goal.id)}
                        className="hover:shadow-lg transition-all hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              }
            </TableBody>
          </Table>
        </div>
        </>
      )}
    </div>
  )
}

export default GoalsPage;