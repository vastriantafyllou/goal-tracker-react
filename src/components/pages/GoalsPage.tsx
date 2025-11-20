import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {useEffect, useState} from "react";
import {deleteGoal, getGoals} from "@/services/api.goals.ts";
import type {Goal} from "@/schemas/goal.ts";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash2, Plus} from "lucide-react";
import {useNavigate} from "react-router";
import {toast} from "sonner";

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return <div className="text-center py-8 text-slate-700 dark:text-slate-300">Loading goals...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">My Goals</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage and track your personal goals</p>
        </div>
        <Button 
          onClick={() => navigate("/goals/new")} 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
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
              {goals.map((goal) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default GoalsPage;