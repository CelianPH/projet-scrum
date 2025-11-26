import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import apiService from "@/services/api"

export default function ProductFormDialog({ open, onOpenChange, product, categories, onSuccess }) {
  const isEdit = !!product

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    category_id: "",
    size: "",
    color: "",
    quantity: 0,
    min_stock_threshold: 10,
    location: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        sku: product.sku || "",
        price: product.price || "",
        category_id: product.category_id || "",
        size: product.size || "",
        color: product.color || "",
        quantity: product.quantity || 0,
        min_stock_threshold: product.min_stock_threshold || 10,
        location: product.location || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        sku: "",
        price: "",
        category_id: "",
        size: "",
        color: "",
        quantity: 0,
        min_stock_threshold: 10,
        location: "",
      })
    }
  }, [product, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Convert string values to numbers
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        quantity: parseInt(formData.quantity),
        min_stock_threshold: parseInt(formData.min_stock_threshold),
      }

      if (isEdit) {
        await apiService.updateProduct(product.id, dataToSend)
      } else {
        await apiService.createProduct(dataToSend)
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement du produit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogClose onClose={() => onOpenChange(false)} />
          <DialogTitle>{isEdit ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifiez les informations du produit" : "Ajoutez un nouveau produit à l'inventaire"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Nom du produit *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: T-shirt Sport Blanc"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description du produit"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">SKU *</label>
                <Input
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  placeholder="Ex: TSH-001"
                  disabled={isEdit}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prix (€) *</label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="29.99"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie *</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories?.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Taille</label>
                <Input
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="Ex: M, L, XL, 42"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur</label>
                <Input
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ex: Blanc, Noir, Rouge"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantité initiale *</label>
                <Input
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Seuil de stock faible *</label>
                <Input
                  name="min_stock_threshold"
                  type="number"
                  min="0"
                  value={formData.min_stock_threshold}
                  onChange={handleChange}
                  required
                  placeholder="10"
                />
                <p className="text-xs text-muted-foreground">
                  Alerte affichée à ce seuil
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Emplacement</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: A1-15, B2-08"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : (isEdit ? "Modifier" : "Créer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
