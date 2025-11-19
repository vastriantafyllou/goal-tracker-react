import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {goalCreateSchema, goalUpdateSchema, type GoalCreateFields, type GoalUpdateFields, goalStatusEnum} from "@/schemas/goal.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {createGoal, getGoal, updateGoal} from "@/services/api.goals.ts";
import {useNavigate, useParams} from "react-router";
import {toast} from "sonner";
import {getAllCategories, createCategory} from "@/services/api.categories.ts";
import type {Category} from "@/schemas/category.ts";
import {Plus, FolderPlus} from "lucide-react";

const GoalDetailsPage = () => {
  const { goalId } = useParams();
  const isEdit = Boolean(goalId);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GoalCreateFields | GoalUpdateFields>({
    resolver: zodResolver(isEdit ? goalUpdateSchema : goalCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      ...(isEdit && { status: "InProgress" }),
    }
  });

  // Load categories
  useEffect(() => {
    getAllCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.log("Error loading categories: ", err);
        // Don't show error toast, categories are optional
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, []);

  // Load goal data for edit mode
  useEffect(() => {
    if (!isEdit || !goalId) return;
    
    getGoal(Number(goalId))
      .then((data) => {
        const values: GoalUpdateFields = {
          title: data.title,
          description: data.description || "",
          dueDate: data.dueDate ? data.dueDate.split('T')[0] : "", // Convert to date input format
          status: data.status as "InProgress" | "Completed" | "Cancelled",
          goalCategoryId: data.goalCategoryId || undefined,
        };
        reset(values);
      })
      .catch((err) => {
        console.log("Error getting goal: ", err);
        toast.error(err instanceof Error ? err.message : "Failed to load goal");
        navigate("/goals");
      })
  }, [isEdit, goalId, reset, navigate])

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setCreatingCategory(true);
    try {
      const newCategory = await createCategory({ name: newCategoryName.trim() });
      setCategories([...categories, newCategory]);
      setValue("goalCategoryId", newCategory.id);
      toast.success(`✅ Category "${newCategory.name}" created!`);
      setNewCategoryName("");
      setShowNewCategoryForm(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  const onSubmit = async (data: GoalCreateFields | GoalUpdateFields) => {
    try {
      if (isEdit && goalId) {
        await updateGoal(Number(goalId), data as GoalUpdateFields);
        toast.success("Goal updated successfully");
      } else {
        await createGoal(data as GoalCreateFields);
        toast.success("Goal created successfully");
      }
      navigate("/goals");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  return(
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
          {isEdit ? "Edit Goal" : "Create New Goal"}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isEdit ? "Update your goal details below" : "Fill in the details to create a new goal"}
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 space-y-6"
        autoComplete="off"
      >
        <div>
          <Label htmlFor="title" className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2 block">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="title" 
            {...register("title")} 
            className="text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 h-11 shadow-sm"
            placeholder="Enter your goal title"
          />
          {errors.title  && (
          <div className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
            ⚠️ {errors.title.message}
          </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2 block">
            Description
          </Label>
          <Textarea 
            id="description" 
            {...register("description")} 
            rows={4} 
            className="text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 shadow-sm resize-none"
            placeholder="Describe your goal in detail..."
          />
          {errors.description  && (
            <div className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
              ⚠️ {errors.description.message}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="dueDate" className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2 block">
            Due Date
          </Label>
          <Input 
            type="date" 
            id="dueDate" 
            {...register("dueDate")}
            className="text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:[color-scheme:dark] h-11 shadow-sm"
          />
          {errors.dueDate  && (
            <div className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
              ⚠️ {errors.dueDate.message}
            </div>
          )}
        </div>

        {/* Category Section with Create */}
        <div className="space-y-3 pb-2 border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="goalCategoryId" className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
              Category <span className="text-slate-400 text-xs font-normal">(Optional)</span>
            </Label>
            <button
              type="button"
              onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
              className="text-xs flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold hover:underline transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Category
            </button>
          </div>
          
          {showNewCategoryForm && (
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 space-y-3 shadow-sm">
              <div className="flex gap-2">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name..."
                  className="flex-1 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 h-10 shadow-sm"
                  disabled={creatingCategory}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateCategory();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName.trim() || creatingCategory}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  {creatingCategory ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <FolderPlus className="w-4 h-4" /> Create
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                💡 Categories are personal and will be available only to you
              </p>
            </div>
          )}
          
          <select 
            id="goalCategoryId" 
            {...register("goalCategoryId", { 
              setValueAs: (value) => value === "" ? undefined : Number(value)
            })}
            className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
            disabled={loadingCategories}
          >
            <option value="">-- Select Category (Optional) --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                📁 {category.name} {category.goalCount ? `(${category.goalCount} goals)` : ''}
              </option>
            ))}
          </select>
          
          {loadingCategories && (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="animate-spin">⏳</span> Loading categories...
            </div>
          )}
          {errors.goalCategoryId && (
            <p className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1">
              ⚠️ {errors.goalCategoryId.message}
            </p>
          )}
        </div>

        {isEdit && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <Label htmlFor="status" className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2 block">
              Status <span className="text-red-500">*</span>
            </Label>
            <select 
              id="status" 
              {...register("status")}
              className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm shadow-sm transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
            >
              {goalStatusEnum.options.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {"status" in errors && errors.status && (
              <div className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                ⚠️ {errors.status.message}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-8 border-t border-slate-200 dark:border-slate-800">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 h-11 px-6"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Saving...
              </span>
            ) : (
              isEdit ? "Update Goal" : "Create Goal"
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/goals")}
            className="h-11 px-6 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
)
}

export default GoalDetailsPage;
