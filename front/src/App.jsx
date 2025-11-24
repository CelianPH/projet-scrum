import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ShoppingBag,
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter
} from "lucide-react"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Mettre à false pour voir la page de login
  const [searchQuery, setSearchQuery] = useState("")

  // Données mockées pour les articles en stock
  const [inventory, setInventory] = useState([
    { id: 1, sku: "TSH-001", name: "T-shirt Nike Dri-FIT", category: "T-shirts", size: "M", color: "Blanc", quantity: 45, price: 29.99, location: "A1-15" },
    { id: 2, sku: "PNT-002", name: "Pantalon Nike Sportswear", category: "Pantalons", size: "L", color: "Noir", quantity: 23, price: 59.99, location: "B2-08" },
    { id: 3, sku: "SHO-003", name: "Nike Air Max 90", category: "Chaussures", size: "42", color: "Blanc/Rouge", quantity: 12, price: 139.99, location: "C3-22" },
    { id: 4, sku: "JKT-004", name: "Veste Nike Windrunner", category: "Vestes", size: "L", color: "Noir", quantity: 8, price: 89.99, location: "D1-05" },
    { id: 5, sku: "TSH-005", name: "T-shirt Nike Pro", category: "T-shirts", size: "S", color: "Bleu", quantity: 34, price: 34.99, location: "A1-18" },
    { id: 6, sku: "SHO-006", name: "Nike Air Force 1", category: "Chaussures", size: "41", color: "Blanc", quantity: 28, price: 119.99, location: "C3-24" },
  ])

  // Page de connexion
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary text-primary-foreground">
                <ShoppingBag className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl">Gestion de Stock</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à l'inventaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="employe@boutique.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full" onClick={() => setIsLoggedIn(true)}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Interface principale de gestion
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Gestion de Stock</h1>
                <p className="text-xs text-muted-foreground">Boutique Nike - Centre Ville</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Jean Dupont</span>
              <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">152</div>
              <p className="text-xs text-muted-foreground">Articles total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Catégories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">4</div>
              <p className="text-xs text-muted-foreground">Stock faible</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">12,450€</div>
              <p className="text-xs text-muted-foreground">Valeur stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Barre d'actions */}
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
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Button>
          </div>
        </div>

        {/* Table des articles */}
        <Card>
          <CardHeader>
            <CardTitle>Inventaire</CardTitle>
            <CardDescription>
              Liste complète des articles en stock
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
                    {inventory.map((item) => (
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
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default App
