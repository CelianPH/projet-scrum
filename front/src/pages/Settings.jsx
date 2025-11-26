import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  User,
  Shield,
  Save,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import apiService from "@/services/api"

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Profile settings state
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    full_name: "",
    role: ""
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordErrors, setPasswordErrors] = useState({})

  // Charger les données utilisateur au montage
  useEffect(() => {
    loadUserData()
  }, [user])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError("")
      const userData = await apiService.getCurrentUser()
      setProfile({
        username: userData.username || "",
        email: userData.email || "",
        full_name: userData.full_name || "",
        role: userData.role === "admin" ? "Administrateur" : "Gestionnaire"
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      setError("Erreur lors du chargement des données utilisateur")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      await apiService.updateProfile({
        username: profile.username,
        email: profile.email,
        full_name: profile.full_name || null
      })
      
      // Mettre à jour le contexte d'authentification
      const updatedUser = await apiService.getCurrentUser()
      updateUser(updatedUser)
      
      setSuccess("Profil mis à jour avec succès !")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message || "Erreur lors de la mise à jour du profil")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordErrors({})
    setError("")
    setSuccess("")

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordErrors({ currentPassword: "Le mot de passe actuel est requis" })
      return
    }
    if (!passwordData.newPassword) {
      setPasswordErrors({ newPassword: "Le nouveau mot de passe est requis" })
      return
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordErrors({ newPassword: "Le mot de passe doit contenir au moins 6 caractères" })
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors({ confirmPassword: "Les mots de passe ne correspondent pas" })
      return
    }

    setIsSaving(true)

    try {
      await apiService.changePassword(passwordData.currentPassword, passwordData.newPassword)
      setSuccess("Mot de passe modifié avec succès !")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error('Error changing password:', error)
      setError(error.message || "Erreur lors du changement de mot de passe")
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
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
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                        {success}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom d'utilisateur *</label>
                      <Input
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        placeholder="nom.utilisateur"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          className="pl-10"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom complet</label>
                      <Input
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        placeholder="Jean Dupont"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rôle</label>
                      <Input value={profile.role} disabled className="bg-muted" />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleProfileSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
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
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                    {success}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mot de passe actuel *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        if (passwordErrors.currentPassword) {
                          setPasswordErrors({ ...passwordErrors, currentPassword: "" })
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nouveau mot de passe *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                        if (passwordErrors.newPassword) {
                          setPasswordErrors({ ...passwordErrors, newPassword: "" })
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmer le nouveau mot de passe *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      value={passwordData.confirmPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        if (passwordErrors.confirmPassword) {
                          setPasswordErrors({ ...passwordErrors, confirmPassword: "" })
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Conseils de sécurité :</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Utilisez au moins 6 caractères</li>
                      <li>Incluez des lettres majuscules et minuscules</li>
                      <li>Ajoutez des chiffres et des caractères spéciaux</li>
                      <li>Ne réutilisez pas de mots de passe existants</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handlePasswordChange} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Modification...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Modifier le mot de passe
                      </>
                    )}
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
