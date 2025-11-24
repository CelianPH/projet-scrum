import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
  AlertCircle,
  Mail,
  Lock,
  Building,
  Package
} from "lucide-react"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)

  // Profile settings state
  const [profile, setProfile] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    role: "Gestionnaire de stock"
  })

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lowStockAlerts: true,
    dailyReport: false,
    weeklyReport: true,
    newProductNotif: true
  })

  // Stock alert settings state
  const [stockAlerts, setstockAlerts] = useState({
    lowStockThreshold: 15,
    criticalStockThreshold: 5,
    expirationWarning: 30
  })

  // Store settings state
  const [store, setStore] = useState({
    name: "Ma Boutique - Centre Ville",
    address: "123 Rue du Commerce",
    city: "Paris",
    postalCode: "75001",
    country: "France"
  })

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      // Show success message (you can add a toast notification here)
      alert("Paramètres enregistrés avec succès !")
    }, 1000)
  }

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "alerts", label: "Alertes stock", icon: AlertCircle },
    { id: "store", label: "Boutique", icon: Building },
    { id: "security", label: "Sécurité", icon: Shield },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Paramètres</h2>
        <p className="text-muted-foreground">
          Gérez vos préférences et configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="pt-6">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prénom</label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom</label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      className="pl-10"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rôle</label>
                  <Input value={profile.role} disabled className="bg-muted" />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Choisissez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Alertes par email</div>
                    <div className="text-sm text-muted-foreground">
                      Recevoir des alertes importantes par email
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Alertes stock faible</div>
                    <div className="text-sm text-muted-foreground">
                      Notification quand un article est en stock faible
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.lowStockAlerts}
                    onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Rapport quotidien</div>
                    <div className="text-sm text-muted-foreground">
                      Recevoir un résumé des ventes chaque jour
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.dailyReport}
                    onChange={(e) => setNotifications({ ...notifications, dailyReport: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Rapport hebdomadaire</div>
                    <div className="text-sm text-muted-foreground">
                      Recevoir un résumé des ventes chaque semaine
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.weeklyReport}
                    onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Nouveaux produits</div>
                    <div className="text-sm text-muted-foreground">
                      Notification quand un nouveau produit est ajouté
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.newProductNotif}
                    onChange={(e) => setNotifications({ ...notifications, newProductNotif: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stock Alerts Tab */}
          {activeTab === "alerts" && (
            <Card>
              <CardHeader>
                <CardTitle>Configuration des alertes de stock</CardTitle>
                <CardDescription>
                  Définissez les seuils d'alerte pour votre inventaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Seuil stock faible</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="0"
                      value={stockAlerts.lowStockThreshold}
                      onChange={(e) => setStockAlerts({ ...stockAlerts, lowStockThreshold: parseInt(e.target.value) })}
                      className="max-w-[200px]"
                    />
                    <span className="text-sm text-muted-foreground">articles</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Alerte quand la quantité en stock passe sous ce seuil
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Seuil stock critique</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="0"
                      value={stockAlerts.criticalStockThreshold}
                      onChange={(e) => setStockAlerts({ ...stockAlerts, criticalStockThreshold: parseInt(e.target.value) })}
                      className="max-w-[200px]"
                    />
                    <span className="text-sm text-muted-foreground">articles</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Alerte urgente quand la quantité passe sous ce seuil
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Avertissement d'expiration</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="0"
                      value={stockAlerts.expirationWarning}
                      onChange={(e) => setStockAlerts({ ...stockAlerts, expirationWarning: parseInt(e.target.value) })}
                      className="max-w-[200px]"
                    />
                    <span className="text-sm text-muted-foreground">jours</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Alerte avant expiration des produits périssables
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Note :</strong> Les alertes sont envoyées selon vos préférences de notification.
                    Assurez-vous d'avoir activé les notifications dans l'onglet "Notifications".
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Store Tab */}
          {activeTab === "store" && (
            <Card>
              <CardHeader>
                <CardTitle>Informations de la boutique</CardTitle>
                <CardDescription>
                  Gérez les informations de votre point de vente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de la boutique</label>
                  <Input
                    value={store.name}
                    onChange={(e) => setStore({ ...store, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse</label>
                  <Input
                    value={store.address}
                    onChange={(e) => setStore({ ...store, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ville</label>
                    <Input
                      value={store.city}
                      onChange={(e) => setStore({ ...store, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code postal</label>
                    <Input
                      value={store.postalCode}
                      onChange={(e) => setStore({ ...store, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pays</label>
                    <Input
                      value={store.country}
                      onChange={(e) => setStore({ ...store, country: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Sécurité et mot de passe</CardTitle>
                <CardDescription>
                  Gérez votre mot de passe et vos paramètres de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mot de passe actuel</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" className="pl-10" placeholder="••••••••" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" className="pl-10" placeholder="••••••••" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmer le nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" className="pl-10" placeholder="••••••••" />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Conseils de sécurité :</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Utilisez au moins 8 caractères</li>
                      <li>Incluez des lettres majuscules et minuscules</li>
                      <li>Ajoutez des chiffres et des caractères spéciaux</li>
                      <li>Ne réutilisez pas de mots de passe existants</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Modifier le mot de passe" : "Modifier le mot de passe"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
