// src/App.tsx
import { useRoutes } from "react-router-dom"
import { AppRoutes } from "./routes"
import { AuthProvider } from "./contexts/AuthContext"
import { ChatProvider } from "./contexts/ChatContext"

function App() {
  const routing = useRoutes(AppRoutes)

  return (
    <AuthProvider>
      <ChatProvider>
        {routing}
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
