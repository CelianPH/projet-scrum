import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ShoppingBag, LayoutDashboard, Package, TrendingUp, Settings, LogOut } from "lucide-react"

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    // TODO: Implement actual logout logic (clear tokens, etc.)
    navigate("/login")
  }

  const navItems = [
    { path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { path: "/inventory", label: "Inventaire", icon: Package },
    { path: "/reports", label: "Rapports", icon: TrendingUp },
    { path: "/settings", label: "Paramètres", icon: Settings },
  ]

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
                <p className="text-xs text-muted-foreground">Ma Boutique - Centre Ville</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">Jean Dupont</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
