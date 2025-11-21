import { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, FolderPlus, Search, X, AlertTriangle, Filter } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  
  // Search, filter, and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [filterBy, setFilterBy] = useState<string>("All");
  
  // Delete confirmation modal state
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<Category | null>(null);

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

  // Delete category - with danger awareness
  const handleDeleteClick = (category: Category) => {
    setDeleteConfirmCategory(category);
  };
  
  const confirmDelete = async () => {
    if (!deleteConfirmCategory) return;
    
    try {
      await deleteCategory(deleteConfirmCategory.id);
      toast.success("Category deleted successfully!");
      setDeleteConfirmCategory(null);
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
  
  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = categories;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Goal count filter
    if (filterBy === "WithGoals") {
      filtered = filtered.filter(cat => (cat.goalCount ?? 0) > 0);
    } else if (filterBy === "Empty") {
      filtered = filtered.filter(cat => (cat.goalCount ?? 0) === 0);
    }
    
    // Sorting
    const sorted = [...filtered];
    const [sortField, sortOrder] = sortBy.split('-');
    
    sorted.sort((a, b) => {
      let aVal: string | number = 0;
      let bVal: string | number = 0;


      if (sortField === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortField === 'count') {
        aVal = a.goalCount ?? 0;
        bVal = b.goalCount ?? 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return sorted;
  }, [categories, searchQuery, sortBy, filterBy]);
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilterBy("All");
  };
  
  const hasActiveFilters = searchQuery || filterBy !== "All";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading categories...</p>
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
              <FolderPlus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                My Categories
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage your goal categories
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {categories.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Categories</div>
          </div>
        </div>
      </div>

      {/* Search, Filters, and Sort */}
      {categories.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar with New Category Button */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories by name..."
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
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Category
              </Button>
            </div>
            
            {/* Filters and Sort Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Filter by Goal Count */}
              <div className="flex-1">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                >
                  <option value="All">All Categories</option>
                  <option value="WithGoals">With Goals</option>
                  <option value="Empty">Empty Categories</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="count-desc">Most Goals</option>
                  <option value="count-asc">Fewest Goals</option>
                </select>
              </div>
            </div>
            
            {/* Active Filters Info */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {filteredAndSortedCategories.length} of {categories.length} categories
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
      )}
      
      {/* Categories Table or Empty State */}
      {categories.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md cursor-pointer"
                 onClick={() => setIsCreateDialogOpen(true)}
            >
            <FolderPlus
                className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
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
          <div className={`overflow-x-auto ${filteredAndSortedCategories.length > 5 ? "max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent" : ""}`}>
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Goal Count
                  </th>
                  <th className="px-12 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredAndSortedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-slate-500 dark:text-slate-400">
                        <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">No categories match your filters</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        #{category.id}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">
                        📁 {category.name}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {category.goalCount ?? 0}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(category)}
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(category)}
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
      
      {/* Delete Confirmation Dialog - Danger Aware */}
      <Dialog open={!!deleteConfirmCategory} onOpenChange={() => setDeleteConfirmCategory(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                deleteConfirmCategory && (deleteConfirmCategory.goalCount ?? 0) > 0
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-slate-100 dark:bg-slate-800"
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  deleteConfirmCategory && (deleteConfirmCategory.goalCount ?? 0) > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-600 dark:text-slate-400"
                }`} />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Delete Category?
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 dark:text-slate-400 pt-4">
              {deleteConfirmCategory && (deleteConfirmCategory.goalCount ?? 0) > 0 ? (
                <div className="space-y-3">
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    ⚠️ Warning: This category contains {deleteConfirmCategory.goalCount} goal{deleteConfirmCategory.goalCount !== 1 ? 's' : ''}.
                  </p>
                  <p>
                    Deleting the category <span className="font-semibold">"{deleteConfirmCategory.name}"</span> may affect goal associations. 
                    Goals in this category will lose their category assignment.
                  </p>
                  <p className="text-sm">
                    Are you sure you want to proceed?
                  </p>
                </div>
              ) : (
                <p>
                  Are you sure you want to delete the category <span className="font-semibold">"{deleteConfirmCategory?.name}"</span>? 
                  This action cannot be undone.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmCategory(null)}
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
              {deleteConfirmCategory && (deleteConfirmCategory.goalCount ?? 0) > 0 ? (
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Delete Anyway
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
