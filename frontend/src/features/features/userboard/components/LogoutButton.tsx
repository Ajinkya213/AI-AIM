import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
    const { logout, userEmail } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
                Welcome, {userEmail}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
            >
                <LogOut className="w-4 h-4" />
                Logout
            </Button>
        </div>
    );
}; 