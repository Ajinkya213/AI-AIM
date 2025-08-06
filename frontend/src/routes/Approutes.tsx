import type { RouteObject } from "react-router-dom"
import Login from "@/features/auth/Login"
import Signup from "@/features/auth/Signup"
import Userboard from "@/features/userboard/Userboard"
import Landing from "@/features/landing/Landing"
import FeaturesPage from "@/features/landing/pages/FeaturesPage"
import PricingPage from "@/features/landing/pages/PricingPage"
import AboutPage from "@/features/landing/pages/AboutPage"
import TestimonialsPage from "@/features/landing/pages/TestimonialsPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const AppRoutes: RouteObject[] = [
    { path: "/", element: <Landing /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    {
        path: "/userboard",
        element: (
            <ProtectedRoute>
                <Userboard />
            </ProtectedRoute>
        )
    },
    { path: "/features", element: <FeaturesPage /> },
    { path: "/pricing", element: <PricingPage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/testimonials", element: <TestimonialsPage /> },
]

export default AppRoutes


