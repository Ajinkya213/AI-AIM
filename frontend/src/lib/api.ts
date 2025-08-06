// src/lib/api.ts
export async function signup(data: { name: string; email: string; password: string }) {
  const res = await fetch("http://localhost:8000/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Signup failed")
  }

  return await res.json()
}
