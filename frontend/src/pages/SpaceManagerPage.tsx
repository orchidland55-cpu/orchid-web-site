// src/pages/SpaceManagerPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Shield } from "lucide-react";
import orchidLogo from "@/assets/logopng.png";
import SpaceManager from "@/components/SpaceManager";
import UserManagementModal from "@/components/UserManagementModal";
import { apiService } from "@/services/api";
import { showToast } from "@/components/ToastContainer";
 
const SpaceManagerPage = () => {
  const navigate = useNavigate();
  const [userModalOpen, setUserModalOpen] = useState(false);
 
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      apiService.logout();
      showToast({
        type: "success",
        title: "Logout Successful",
        message: "You have been successfully logged out.",
        duration: 3000,
      });
      setTimeout(() => navigate("/admin"), 500);
    }
  };
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header — identique au dashboard */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={orchidLogo} alt="Logo" className="h-12 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setUserModalOpen(true)}>
                <Shield className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
 
      <main className="container mx-auto px-6 py-8">
        <SpaceManager />
      </main>
 
      <UserManagementModal open={userModalOpen} onOpenChange={setUserModalOpen} />
    </div>
  );
};
 
export default SpaceManagerPage;