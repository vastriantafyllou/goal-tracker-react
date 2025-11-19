import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Category, CategoryCreateFields, CategoryUpdateFields } from "@/schemas/category";
import { categoryCreateSchema, categoryUpdateSchema } from "@/schemas/category";
import { getAllCategories, createCategory, getCategory, updateCategory, deleteCategory } from "@/services/api.categories";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form for creating new category
  const createForm = useForm<CategoryCreateFields>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: "",
    },
  });

  // Form for editing category
  const editForm = useForm<CategoryUpdateFields>({
    resolver: zodResolver(categoryUpdateSchema),
    defaultValues: {
      name: "",
    },
  });

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Create new category
  const handleCreate = async (data: CategoryCreateFields) => {
    try {
      setIsSubmitting(true);
      await createCategory(data);
      toast.success("Category created successfully!");
      setIsCreateDialogOpen(false);
      createForm.reset();
      loadCategories();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog
  const handleEditClick = async (category: Category) => {
    try {
      setIsSubmitting(true);
      // Load full category data
      const fullCategory = await getCategory(category.id);
      setEditingCategory(fullCategory);
      editForm.reset({
        name: fullCategory.name,
      });
      setIsEditDialogOpen(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update category
  const handleUpdate = async (data: CategoryUpdateFields) => {
    if (!editingCategory) return;

    try {
      setIsSubmitting(true);
      await updateCategory(editingCategory.id, data);
      toast.success("Category updated successfully!");
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      editForm.reset();
      loadCategories();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      loadCategories();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    }
  };

  // Close create dialog
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    createForm.reset();
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    editForm.reset();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-slate-700 dark:text-slate-300">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
            My Categories
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage your goal categories
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Categories Table or Empty State */}
      {categories.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
              <FolderPlus className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              No categories yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-7 leading-relaxed">
              Create your first category to better organize your goals!
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30">
              <TableRow className="border-b-2 border-slate-200 dark:border-slate-700">
                <TableHead className="w-[80px] font-bold text-slate-800 dark:text-slate-100 py-6 px-4">
                  ID
                </TableHead>
                <TableHead className="font-bold text-slate-800 dark:text-slate-100 py-6">
                  Name
                </TableHead>
                <TableHead className="font-bold text-slate-800 dark:text-slate-100 py-6">
                  Goal Count
                </TableHead>
                <TableHead className="text-right font-bold text-slate-800 dark:text-slate-100 py-6 px-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow
                  key={category.id}
                  className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-800/30 dark:hover:to-transparent transition-all duration-200 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <TableCell className="font-bold text-slate-500 dark:text-slate-500 py-6">
                    {category.id}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-slate-100 py-6">
                    📁 {category.name}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-6">
                    {category.goalCount ?? 0}
                  </TableCell>
                  <TableCell className="text-right py-6">
                    <div className="flex justify-end gap-2.5">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleEditClick(category)}
                        className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md hover:scale-105"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleDelete(category.id, category.name)}
                        className="hover:shadow-lg transition-all hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleCloseCreateDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Create New Category
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Enter the name of the new category
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-6">
            <div>
              <Label htmlFor="create-name" className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2 block">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-name"
                {...createForm.register("name")}
                className="text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 h-11 shadow-sm"
                placeholder="e.g. Personal Development"
              />
              {createForm.formState.errors.name && (
                <div className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                  ⚠️ {createForm.formState.errors.name.message}
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseCreateDialog}
                className="h-11 px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 h-11 px-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Creating...
                  </span>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Edit Category
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Update the category name
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-6">
            <div>
              <Label htmlFor="edit-name" className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2 block">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                {...editForm.register("name")}
                className="text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 h-11 shadow-sm"
                placeholder="e.g. Personal Development"
              />
              {editForm.formState.errors.name && (
                <div className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                  ⚠️ {editForm.formState.errors.name.message}
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseEditDialog}
                className="h-11 px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 h-11 px-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Updating...
                  </span>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
