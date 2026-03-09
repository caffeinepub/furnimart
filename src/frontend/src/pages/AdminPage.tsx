import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Loader2,
  LogIn,
  Pencil,
  Plus,
  ShieldX,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Category, ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateProduct,
  useDeleteProduct,
  useIsCallerAdmin,
  useListAllProducts,
  useUpdateProduct,
} from "../hooks/useQueries";
import type { Product } from "../hooks/useQueries";

function formatPrice(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: string;
  category: Category;
  inStock: boolean;
  imageFile: File | null;
  existingImageUrl: string;
}

const emptyForm = (): ProductFormData => ({
  id: "",
  name: "",
  description: "",
  price: "",
  category: Category.home,
  inStock: true,
  imageFile: null,
  existingImageUrl: "",
});

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products, isLoading: productsLoading } = useListAllProducts();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm());
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: String(Number(product.price)),
      category: product.category,
      inStock: product.inStock,
      imageFile: null,
      existingImageUrl: product.imageId.getDirectURL(),
    });
    setFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageId: ExternalBlob;

      if (formData.imageFile) {
        const bytes = new Uint8Array(await formData.imageFile.arrayBuffer());
        imageId = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
          setUploadProgress(pct),
        );
      } else if (editingProduct) {
        imageId = editingProduct.imageId;
      } else {
        toast.error("Please select an image");
        return;
      }

      const product: Product = {
        id: editingProduct ? editingProduct.id : crypto.randomUUID(),
        name: formData.name,
        description: formData.description,
        price: BigInt(Math.round(Number(formData.price))),
        category: formData.category,
        inStock: formData.inStock,
        imageId,
        createdAt: editingProduct
          ? editingProduct.createdAt
          : BigInt(Date.now()) * BigInt(1_000_000),
      };

      if (editingProduct) {
        await updateProduct.mutateAsync(product);
        toast.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync(product);
        toast.success("Product added successfully");
      }

      setFormOpen(false);
      setUploadProgress(0);
    } catch (err) {
      toast.error("Failed to save product");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;

  // --- Auth states ---
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Admin Panel</h1>
          <p className="text-muted-foreground mb-8">
            Please login to access the admin dashboard.
          </p>
          <Button
            size="lg"
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="bg-primary hover:bg-primary/90"
            data-ocid="auth.login.button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 w-4 h-4" /> Login with Internet Identity
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto">
          <ShieldX className="w-16 h-16 mx-auto text-destructive mb-6" />
          <h1 className="font-display text-2xl font-bold mb-3">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges to access this panel.
          </p>
          <Button
            variant="outline"
            onClick={handleAuth}
            data-ocid="auth.logout.button"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-accent" />
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your product catalogue
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={openAdd}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            data-ocid="admin.add_product.button"
          >
            <Plus className="mr-2 w-4 h-4" /> Add Product
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAuth}
            data-ocid="auth.logout.button"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Products Table */}
      {productsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div
          data-ocid="admin.products.empty_state"
          className="py-20 text-center border border-dashed border-border rounded-xl"
        >
          <p className="text-muted-foreground mb-4">No products yet.</p>
          <Button onClick={openAdd} data-ocid="admin.add_product.button">
            <Plus className="mr-2 w-4 h-4" /> Add First Product
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden shadow-card">
          <Table data-ocid="admin.products.table">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, i) => (
                <TableRow
                  key={product.id}
                  data-ocid={`admin.product.row.${i + 1}`}
                >
                  <TableCell>
                    <img
                      src={product.imageId.getDirectURL()}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.category === "home" ? "Home" : "Office"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        product.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(product)}
                        data-ocid={`admin.product.edit_button.${i + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTarget(product)}
                        data-ocid={`admin.product.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="prod-name">Product Name *</Label>
              <Input
                id="prod-name"
                placeholder="e.g. Royal Comfort Sofa"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                required
                data-ocid="admin.product_form.name.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-desc">Description *</Label>
              <Textarea
                id="prod-desc"
                placeholder="Describe the product..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prod-price">Price (₹) *</Label>
                <Input
                  id="prod-price"
                  type="number"
                  placeholder="45000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, price: e.target.value }))
                  }
                  required
                  min={0}
                  data-ocid="admin.product_form.price.input"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, category: v as Category }))
                  }
                >
                  <SelectTrigger data-ocid="admin.product_form.category.select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Category.home}>Home</SelectItem>
                    <SelectItem value={Category.office}>Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="prod-instock"
                checked={formData.inStock}
                onCheckedChange={(v) =>
                  setFormData((p) => ({ ...p, inStock: v }))
                }
                data-ocid="admin.product_form.instock.switch"
              />
              <Label htmlFor="prod-instock">In Stock</Label>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>
                Product Image{" "}
                {editingProduct ? "(leave blank to keep existing)" : "*"}
              </Label>
              {(formData.existingImageUrl || formData.imageFile) && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={
                      formData.imageFile
                        ? URL.createObjectURL(formData.imageFile)
                        : formData.existingImageUrl
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData((p) => ({ ...p, imageFile: file }));
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="admin.product_form.image.upload_button"
              >
                <Upload className="mr-2 w-4 h-4" />
                {formData.imageFile ? formData.imageFile.name : "Choose Image"}
              </Button>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                data-ocid="admin.product_form.submit_button"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="admin.delete_confirm.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.delete_confirm.cancel_button"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              data-ocid="admin.delete_confirm.confirm_button"
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
