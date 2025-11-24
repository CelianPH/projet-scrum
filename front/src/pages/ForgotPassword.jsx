import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShoppingBag, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = () => {
    if (!email) {
      setError("L'email est requis")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("L'email n'est pas valide")
      return false
    }
    setError("")
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      // TODO: Replace with actual password reset logic
    }, 1500)
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (error) {
      setError("")
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
                <Mail className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl">Email envoyé !</CardTitle>
            <CardDescription>
              Un lien de réinitialisation a été envoyé à <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Si vous ne recevez pas l'email dans les 5 minutes, vérifiez vos spams.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSubmitted(false)
                setEmail("")
              }}
            >
              Renvoyer l'email
            </Button>
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary text-primary-foreground">
              <ShoppingBag className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">Mot de passe oublié ?</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="employe@boutique.com"
                value={email}
                onChange={handleChange}
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Envoi..." : "Envoyer le lien"}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Retour à la connexion
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
