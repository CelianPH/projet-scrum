import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Eye,
  EyeOff,
  Shield,
  User as UserIcon,
  Loader2
} from "lucide-react"
import apiService from "@/services/api"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    role: "gestionnaire"
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setApiError("")
      const data = await apiService.getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
      setApiError("Erreur lors du chargement des utilisateurs: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name || "",
        password: "",
        role: user.role
      })
    } else {
      setEditingUser(null)
      setFormData({
        username: "",
        email: "",
        full_name: "",
        password: "",
        role: "gestionnaire"
      })
    }
    setErrors({})
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({
      username: "",
      email: "",
      full_name: "",
      password: "",
      role: "gestionnaire"
    })
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis"
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide"
    }

    if (!editingUser && !formData.password) {
      newErrors.password = "Le mot de passe est requis"
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setApiError("")

    try {
      if (editingUser) {
        // Update user
        const updateData = {
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name || null,
          role: formData.role,
        }
        // Inclure le mot de passe seulement s'il est fourni
        if (formData.password) {
          updateData.password = formData.password
        }
        await apiService.updateUser(editingUser.id, updateData)
        await loadUsers() // Recharger la liste
        alert("Utilisateur modifié avec succès")
      } else {
        // Create new user
        await apiService.createUser({
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name || null,
          password: formData.password,
          role: formData.role,
        })
        await loadUsers() // Recharger la liste
        alert("Utilisateur créé avec succès")
      }
      handleCloseModal()
    } catch (error) {
      console.error('Error saving user:', error)
      setApiError(error.message || "Erreur lors de l'enregistrement de l'utilisateur")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return
    }

    try {
      setSubmitting(true)
      setApiError("")
      await apiService.deleteUser(userId)
      await loadUsers() // Recharger la liste
      alert("Utilisateur supprimé avec succès")
    } catch (error) {
      console.error('Error deleting user:', error)
      setApiError(error.message || "Erreur lors de la suppression de l'utilisateur")
      alert("Erreur: " + (error.message || "Impossible de supprimer l'utilisateur"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h2>
        <p className="text-muted-foreground">
          Créez et gérez les comptes utilisateurs (Admin uniquement)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Utilisateurs total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.filter(u => u.role === "admin").length}</div>
            <p className="text-xs text-muted-foreground">Administrateurs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.filter(u => u.role === "gestionnaire").length}</div>
            <p className="text-xs text-muted-foreground">Gestionnaires</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Error message */}
      {apiError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {apiError}
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {loading ? "Chargement..." : `${filteredUsers.length} utilisateur${filteredUsers.length > 1 ? 's' : ''} trouvé${filteredUsers.length > 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Nom d'utilisateur</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Email</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Nom complet</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Rôle</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-muted-foreground">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{user.username}</td>
                      <td className="p-4 align-middle">{user.email}</td>
                      <td className="p-4 align-middle">{user.full_name || "-"}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {user.role === "admin" ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                          {user.role === "admin" ? "Admin" : "Gestionnaire"}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenModal(user)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(user.id)}
                            title="Supprimer"
                            disabled={user.role === "admin"}
                          >
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
          )}
        </CardContent>
      </Card>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {editingUser ? "Modifiez les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom d'utilisateur *</label>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="jean.dupont"
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.dupont@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom complet</label>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Mot de passe {editingUser && "(laisser vide pour ne pas changer)"}
                  </label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rôle *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm cursor-pointer"
                  >
                    <option value="gestionnaire" className="bg-background text-foreground">Gestionnaire</option>
                    <option value="admin" className="bg-background text-foreground">Administrateur</option>
                  </select>
                </div>

                {apiError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                    {apiError}
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseModal} 
                    className="flex-1"
                    disabled={submitting}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingUser ? "Modification..." : "Création..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingUser ? "Modifier" : "Créer"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
