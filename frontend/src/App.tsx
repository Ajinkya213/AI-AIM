// src/App.tsx
import { useRoutes } from "react-router-dom"
import { AppRoutes } from "./routes"
import { AuthProvider } from "./contexts/AuthContext"
import { ChatProvider } from "./contexts/ChatContext"
import { FileUploadProvider } from "./contexts/FileUploadContext";

function App() {
  const routing = useRoutes(AppRoutes)

  return (
    <FileUploadProvider>
      <AuthProvider>
        <ChatProvider>
          {routing}
        </ChatProvider>
      </AuthProvider>
    </FileUploadProvider>
  )
}

export default App
