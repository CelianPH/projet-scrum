import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Package,
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  Shirt,
  Tag
} from "lucide-react"

function Dashboard() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  // Données mockées pour les statistiques
  const stats = [
    {
      title: "Articles en stock",
      value: "1,234",
      description: "+12% ce mois",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Catégories",
      value: "24",
      description: "8 principales",
      icon: Tag,
      color: "text-green-600"
    },
    {
      title: "Valeur totale",
      value: "45,231€",
      description: "+8% ce mois",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Stock faible",
      value: "12",
      description: "À réapprovisionner",
      icon: AlertCircle,
      color: "text-red-600"
    }
  ]

  // Données mockées pour les articles récents
  const recentItems = [
    { id: 1, name: "T-shirt blanc basique", category: "T-shirts", stock: 45, price: "19.99€" },
    { id: 2, name: "Jean slim noir", category: "Pantalons", stock: 23, price: "49.99€" },
    { id: 3, name: "Robe d'été fleurie", category: "Robes", stock: 12, price: "39.99€" },
    { id: 4, name: "Veste en cuir", category: "Vestes", stock: 8, price: "129.99€" },
    { id: 5, name: "Chemise à carreaux", category: "Chemises", stock: 34, price: "34.99€" },
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Tableau de bord</h2>
          <p className="text-muted-foreground">
            Bienvenue sur votre système de gestion de stock de vêtements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions & Search */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Rechercher un article</CardTitle>
              <CardDescription>
                Trouvez rapidement un article dans votre inventaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, catégorie, SKU..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch}>Rechercher</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Gérez votre inventaire
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel article
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Shirt className="mr-2 h-4 w-4" />
                Voir les catégories
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Articles récents</CardTitle>
            <CardDescription>
              Les derniers articles ajoutés à votre inventaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Nom</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Catégorie</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Stock</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Prix</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentItems.map((item) => (
                      <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{item.name}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <span className={`font-medium ${item.stock < 15 ? 'text-red-600' : 'text-green-600'}`}>
                            {item.stock}
                          </span>
                        </td>
                        <td className="p-4 align-middle font-medium">{item.price}</td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">Voir</Button>
                            <Button variant="ghost" size="sm">Modifier</Button>
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
    </div>
  )
}

export default Dashboard
