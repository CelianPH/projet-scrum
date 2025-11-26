import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  AlertCircle,
  Calendar,
  Download,
  FileText
} from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

// Composant Tooltip personnalisé pour le thème sombre
const CustomTooltip = ({ active, payload, label }) => {
  const { isDark } = useTheme()
  
  if (active && payload && payload.length) {
    return (
      <div 
        className="rounded-lg border p-3 shadow-md"
        style={{
          backgroundColor: isDark ? 'hsl(222.2, 84%, 4.9%)' : 'white',
          borderColor: isDark ? 'hsl(217.2, 32.6%, 17.5%)' : 'hsl(214.3, 31.8%, 91.4%)',
          color: isDark ? 'hsl(210, 40%, 98%)' : 'hsl(222.2, 84%, 4.9%)'
        }}
      >
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState("month")
  const { isDark } = useTheme()
  
  // Couleurs pour les axes et grilles selon le thème
  const axisColor = isDark ? '#9ca3af' : '#6b7280'
  const gridColor = isDark ? '#374151' : '#e5e7eb'

  // Mock data for charts
  const salesData = [
    { name: "Lun", ventes: 12, valeur: 1240 },
    { name: "Mar", ventes: 19, valeur: 1890 },
    { name: "Mer", ventes: 15, valeur: 1560 },
    { name: "Jeu", ventes: 25, valeur: 2340 },
    { name: "Ven", ventes: 32, valeur: 3120 },
    { name: "Sam", ventes: 45, valeur: 4560 },
    { name: "Dim", ventes: 28, valeur: 2890 },
  ]

  const stockEvolutionData = [
    { mois: "Jan", stock: 1200 },
    { mois: "Fév", stock: 1350 },
    { mois: "Mar", stock: 1180 },
    { mois: "Avr", stock: 1420 },
    { mois: "Mai", stock: 1560 },
    { mois: "Jun", stock: 1234 },
  ]

  const categoryData = [
    { name: "T-shirts", value: 45, color: "#3b82f6" },
    { name: "Chaussures", value: 28, color: "#10b981" },
    { name: "Pantalons", value: 23, color: "#f59e0b" },
    { name: "Vestes", value: 14, color: "#ef4444" },
    { name: "Shorts", value: 31, color: "#8b5cf6" },
    { name: "Autres", value: 19, color: "#6b7280" },
  ]

  const topProducts = [
    { name: "Baskets Running Rouges", sales: 45, revenue: 6299.55 },
    { name: "T-shirt Sport Blanc", sales: 38, revenue: 1139.62 },
    { name: "Sneakers Urbaines Blanches", sales: 32, revenue: 3839.68 },
    { name: "Pantalon Jogging Noir", sales: 28, revenue: 1679.72 },
    { name: "Veste Coupe-Vent", sales: 22, revenue: 1979.78 },
  ]

  const stats = [
    {
      title: "Ventes totales",
      value: "176",
      change: "+12.5%",
      trend: "up",
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Revenus",
      value: "15,420€",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Articles en stock",
      value: "1,234",
      change: "-3.1%",
      trend: "down",
      icon: Package,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: "Alertes stock",
      value: "12",
      change: "+2",
      trend: "down",
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Rapports</h2>
          <p className="text-muted-foreground">
            Analyses et statistiques de votre inventaire
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              className="bg-transparent text-sm text-foreground border-none outline-none cursor-pointer"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week" className="bg-background text-foreground">Cette semaine</option>
              <option value="month" className="bg-background text-foreground">Ce mois</option>
              <option value="quarter" className="bg-background text-foreground">Ce trimestre</option>
              <option value="year" className="bg-background text-foreground">Cette année</option>
            </select>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Générer rapport
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ventes hebdomadaires</CardTitle>
            <CardDescription>Nombre d'articles vendus par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: isDark ? '#e5e7eb' : '#374151' }} />
                <Bar dataKey="ventes" fill="#3b82f6" name="Ventes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus hebdomadaires</CardTitle>
            <CardDescription>Valeur des ventes par jour (€)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: isDark ? '#e5e7eb' : '#374151' }} />
                <Line
                  type="monotone"
                  dataKey="valeur"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenus (€)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Stock Evolution */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution du stock</CardTitle>
            <CardDescription>Nombre total d'articles en stock</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="mois" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: isDark ? '#e5e7eb' : '#374151' }} />
                <Line
                  type="monotone"
                  dataKey="stock"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Articles en stock"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
            <CardDescription>Distribution des stocks par type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produits les plus vendus</CardTitle>
          <CardDescription>Top 5 des articles par nombre de ventes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Rang</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Produit</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Ventes</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Revenus</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">{product.name}</td>
                    <td className="p-4 align-middle">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{product.sales}</span>
                    </td>
                    <td className="p-4 align-middle font-semibold text-green-600 dark:text-green-400">
                      {product.revenue.toFixed(2)}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
