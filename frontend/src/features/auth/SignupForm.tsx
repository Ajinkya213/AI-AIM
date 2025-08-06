import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function SignupForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await signup({ name, email, password })
      alert(res.message) // ✅ You can redirect here
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input name="name" id="name" required />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input name="email" id="email" type="email" required />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input name="password" id="password" type="password" required />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Sign up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
