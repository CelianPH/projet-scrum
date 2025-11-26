import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import apiService from "@/services/api"

export default function DeleteProductDialog({ open, onOpenChange, product, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      await apiService.deleteProduct(product.id)
      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression du produit")
    } finally {
      setLoading(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogClose onClose={() => onOpenChange(false)} />
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Supprimer le produit
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-2">Produit à supprimer :</p>
            <p className="text-sm"><span className="font-semibold">Nom:</span> {product.name}</p>
            <p className="text-sm"><span className="font-semibold">SKU:</span> {product.sku}</p>
            <p className="text-sm"><span className="font-semibold">Stock actuel:</span> {product.quantity}</p>
          </div>

          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer ce produit ? Toutes les données associées seront perdues.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
