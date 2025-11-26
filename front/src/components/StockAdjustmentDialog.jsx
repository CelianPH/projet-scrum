import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from "lucide-react"
import apiService from "@/services/api"

export default function StockAdjustmentDialog({ open, onOpenChange, product, onSuccess }) {
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleIncrement = async () => {
    if (quantity <= 0) {
      setError("La quantité doit être positive")
      return
    }

    setLoading(true)
    setError("")

    try {
      await apiService.incrementStock(product.id, quantity, reason || null)
      onSuccess?.()
      onOpenChange(false)
      // Reset form
      setQuantity(1)
      setReason("")
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout du stock")
    } finally {
      setLoading(false)
    }
  }

  const handleDecrement = async () => {
    if (quantity <= 0) {
      setError("La quantité doit être positive")
      return
    }

    setLoading(true)
    setError("")

    try {
      await apiService.decrementStock(product.id, quantity, reason || null)
      onSuccess?.()
      onOpenChange(false)
      // Reset form
      setQuantity(1)
      setReason("")
    } catch (err) {
      setError(err.message || "Erreur lors du retrait du stock")
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
          <DialogTitle>Ajuster le stock</DialogTitle>
          <DialogDescription>
            {product.name} (SKU: {product.sku})
            <br />
            Stock actuel: <span className="font-semibold">{product.quantity}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantité</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              placeholder="Entrez la quantité"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Raison (optionnel)</label>
            <Input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Réapprovisionnement, Vente..."
            />
          </div>
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
            variant="outline"
            onClick={handleDecrement}
            disabled={loading}
            className="text-red-600 hover:text-red-700"
          >
            <Minus className="h-4 w-4 mr-2" />
            Retirer
          </Button>
          <Button
            onClick={handleIncrement}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
