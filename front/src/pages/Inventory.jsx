import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  X,
  Download
} from "lucide-react"

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Mock data for inventory
  const [inventory] = useState([
    { id: 1, sku: "TSH-001", name: "T-shirt Sport Blanc", category: "T-shirts", size: "M", color: "Blanc", quantity: 45, price: 29.99, location: "A1-15" },
    { id: 2, sku: "PNT-002", name: "Pantalon Jogging Noir", category: "Pantalons", size: "L", color: "Noir", quantity: 23, price: 59.99, location: "B2-08" },
    { id: 3, sku: "SHO-003", name: "Baskets Running Rouges", category: "Chaussures", size: "42", color: "Blanc/Rouge", quantity: 12, price: 139.99, location: "C3-22" },
    { id: 4, sku: "JKT-004", name: "Veste Coupe-Vent", category: "Vestes", size: "L", color: "Noir", quantity: 8, price: 89.99, location: "D1-05" },
    { id: 5, sku: "TSH-005", name: "T-shirt Technique Bleu", category: "T-shirts", size: "S", color: "Bleu", quantity: 34, price: 34.99, location: "A1-18" },
    { id: 6, sku: "SHO-006", name: "Sneakers Urbaines Blanches", category: "Chaussures", size: "41", color: "Blanc", quantity: 28, price: 119.99, location: "C3-24" },
    { id: 7, sku: "TSH-007", name: "T-shirt Imprimé Gris", category: "T-shirts", size: "XL", color: "Gris", quantity: 19, price: 24.99, location: "A1-20" },
    { id: 8, sku: "PNT-008", name: "Short Sport Noir", category: "Shorts", size: "M", color: "Noir", quantity: 31, price: 39.99, location: "B1-12" },
    { id: 9, sku: "SHO-009", name: "Chaussures Running Bleues", category: "Chaussures", size: "43", color: "Bleu", quantity: 15, price: 159.99, location: "C3-26" },
    { id: 10, sku: "JKT-010", name: "Veste Polaire Grise", category: "Vestes", size: "M", color: "Gris", quantity: 6, price: 109.99, location: "D1-08" },
    { id: 11, sku: "TSH-011", name: "T-shirt Basique Blanc", category: "T-shirts", size: "L", color: "Blanc", quantity: 42, price: 19.99, location: "A1-22" },
    { id: 12, sku: "SHO-012", name: "Baskets Sport Bicolores", category: "Chaussures", size: "44", color: "Noir/Blanc", quantity: 9, price: 134.99, location: "C3-28" },
  ])

  // Get unique values for filters
  const categories = [...new Set(inventory.map(item => item.category))]
  const sizes = [...new Set(inventory.map(item => item.size))].sort()
  const colors = [...new Set(inventory.map(item => item.color))]

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "" || item.category === selectedCategory
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

  const activeFiltersCount = [selectedCategory, selectedSize, selectedColor].filter(f => f !== "").length

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
            <p className="text-xs text-muted-foreground">Articles total</p>
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
              {inventory.filter(item => item.quantity < 15).length}
            </div>
            <p className="text-xs text-muted-foreground">Stock faible</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}€
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
            placeholder="Rechercher par nom, SKU, catégorie..."
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel article
          </Button>
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
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Taille</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Toutes les tailles</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="">Toutes les couleurs</option>
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
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
            {filteredInventory.length} article{filteredInventory.length > 1 ? 's' : ''} trouvé{filteredInventory.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">SKU</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Article</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Catégorie</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Taille</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Couleur</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Quantité</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Prix</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Emplacement</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Actions</th>
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
                      <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          <span className="font-mono text-sm">{item.sku}</span>
                        </td>
                        <td className="p-4 align-middle font-medium">{item.name}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-sm">{item.size}</td>
                        <td className="p-4 align-middle text-sm">{item.color}</td>
                        <td className="p-4 align-middle">
                          <span className={`font-semibold ${item.quantity < 15 ? 'text-red-600' : item.quantity < 30 ? 'text-orange-600' : 'text-green-600'}`}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="p-4 align-middle font-medium">{item.price}€</td>
                        <td className="p-4 align-middle text-sm text-muted-foreground">{item.location}</td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Voir les détails">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Modifier">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
    </div>
  )
}
