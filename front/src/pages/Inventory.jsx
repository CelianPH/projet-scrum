import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  X,
  Download,
  PackagePlus,
  Eye
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import apiService from "@/services/api"
import StockAdjustmentDialog from "@/components/StockAdjustmentDialog"
import ProductFormDialog from "@/components/ProductFormDialog"
import DeleteProductDialog from "@/components/DeleteProductDialog"

export default function Inventory() {
  const { canManageStock, canManageProducts } = useAuth()

  const [inventory, setInventory] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [stockDialogOpen, setStockDialogOpen] = useState(false)
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError("")

    try {
      // Charger les produits et les catégories en parallèle
      const [productsData, categoriesData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories()
      ])

      setInventory(productsData || [])
      setCategories(categoriesData || [])
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err)
      setError(err.message || "Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Gestion des dialogues
  const handleStockAdjustment = (product) => {
    setSelectedProduct(product)
    setStockDialogOpen(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setProductFormOpen(true)
  }

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setProductFormOpen(true)
  }

  // Fonction pour obtenir le nom de la catégorie
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || "N/A"
  }

  // Valeurs uniques pour les filtres
  const sizes = [...new Set(inventory.map(item => item.size).filter(Boolean))].sort()
  const colors = [...new Set(inventory.map(item => item.color).filter(Boolean))]

  // Filtrage des produits
  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      searchQuery === "" ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "" || item.category_id === parseInt(selectedCategory)
    const matchesSize = selectedSize === "" || item.size === selectedSize
    const matchesColor = selectedColor === "" || item.color === selectedColor

    return matchesSearch && matchesCategory && matchesSize && matchesColor
  })

  const handleClearFilters = () => {
    setSelectedCategory("")
    setSelectedSize("")
    setSelectedColor("")
    setSearchQuery("")
  }

  const activeFiltersCount = [selectedCategory, selectedSize, selectedColor].filter(
    f => f !== ""
  ).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium">Chargement des produits...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600">Erreur : {error}</p>
        <Button onClick={loadData}>Réessayer</Button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Inventaire</h2>
        <p className="text-muted-foreground">
          Gérez l'ensemble de vos produits en stock
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Articles totaux</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredInventory.length}</div>
            <p className="text-xs text-muted-foreground">Articles affichés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {inventory.filter(item => item.quantity <= item.min_stock_threshold).length}
            </div>
            <p className="text-xs text-muted-foreground">Stock faible</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {inventory
                .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                .toFixed(2)}
              €
            </div>
            <p className="text-xs text-muted-foreground">Valeur totale</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, SKU..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="ml-2 flex items-center justify-center h-5 w-5 rounded-full bg-primary-foreground text-primary text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          {canManageProducts() && (
            <Button onClick={handleCreateProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filtres</CardTitle>
              <div className="flex gap-2">
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Effacer tout
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <select
                  className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" className="bg-background text-foreground">
                    Toutes les catégories
                  </option>
                  {categories.map(category => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-background text-foreground"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Taille</label>
                <select
                  className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm cursor-pointer"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="" className="bg-background text-foreground">
                    Toutes les tailles
                  </option>
                  {sizes.map(size => (
                    <option
                      key={size}
                      value={size}
                      className="bg-background text-foreground"
                    >
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur</label>
                <select
                  className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm cursor-pointer"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="" className="bg-background text-foreground">
                    Toutes les couleurs
                  </option>
                  {colors.map(color => (
                    <option
                      key={color}
                      value={color}
                      className="bg-background text-foreground"
                    >
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
          <CardDescription>
            {filteredInventory.length} article{filteredInventory.length > 1 ? "s" : ""}{" "}
            trouvé{filteredInventory.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">SKU</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">
                      Article
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">
                      Catégorie
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">
                      Taille
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">
                      Couleur
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">
                      Quantité
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Prix</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">
                      Emplacement
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-muted-foreground">
                        Aucun article trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle">
                          <span className="font-mono text-sm">{item.sku}</span>
                        </td>
                        <td className="p-4 align-middle font-medium">{item.name}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground">
                            {getCategoryName(item.category_id)}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-sm">{item.size || "-"}</td>
                        <td className="p-4 align-middle text-sm">{item.color || "-"}</td>
                        <td className="p-4 align-middle">
                          <span
                            className={`font-semibold ${
                              item.quantity <= item.min_stock_threshold
                                ? "text-red-600"
                                : item.quantity < item.min_stock_threshold * 2
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }`}
                          >
                            {item.quantity}
                          </span>
                        </td>
                        <td className="p-4 align-middle font-medium">
                          {item.price.toFixed(2)}€
                        </td>
                        <td className="p-4 align-middle text-sm font-medium">
                          {item.location || "-"}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canManageStock() && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Ajuster le stock"
                                onClick={() => handleStockAdjustment(item)}
                              >
                                <PackagePlus className="h-4 w-4" />
                              </Button>
                            )}
                            {canManageProducts() && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="Modifier"
                                  onClick={() => handleEditProduct(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:text-red-700"
                                  title="Supprimer"
                                  onClick={() => handleDeleteProduct(item)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <StockAdjustmentDialog
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        product={selectedProduct}
        onSuccess={loadData}
      />

      <ProductFormDialog
        open={productFormOpen}
        onOpenChange={setProductFormOpen}
        product={selectedProduct}
        categories={categories}
        onSuccess={loadData}
      />

      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={selectedProduct}
        onSuccess={loadData}
      />
    </div>
  )
}
