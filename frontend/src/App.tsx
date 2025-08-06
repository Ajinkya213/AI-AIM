// src/App.tsx
import { useRoutes } from "react-router-dom"
import Login from "@/features/auth/Login"
import Signup from "@/features/auth/Signup"
import { Userboard } from "./features/userboard/Userboard"
import Landing from "./features/landing/Landing"




const AppRoutes = [
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {path: "/userboard", element: <Userboard /> },
]

function App() {
  const routing = useRoutes(AppRoutes)
  return routing
}

export default App
