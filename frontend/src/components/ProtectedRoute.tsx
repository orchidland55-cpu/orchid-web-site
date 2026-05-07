// components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiService } from '@/services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'editor')[];  // Rôles autorisés pour cette route
}

/**
 * Composant pour protéger les routes selon les rôles utilisateur
 * 
 * @param {React.ReactNode} children - Composant à protéger
 * @param {string[]} allowedRoles - Rôles autorisés (défaut: ['admin', 'editor'])
 * 
 * @example
 * // Route accessible uniquement aux admins
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <UserManagement />
 * </ProtectedRoute>
 * 
 * @example
 * // Route accessible aux admins et éditeurs
 * <ProtectedRoute allowedRoles={['admin', 'editor']}>
 *   <AddArticle />
 * </ProtectedRoute>
 * 
 * @example
 * // Route accessible aux admins et éditeurs (par défaut)
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['admin', 'editor']  // Par défaut, admins et éditeurs
}: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    setIsAuthenticated(false);
    return;
  }
  try {
    const { valid, role } = await apiService.verifyToken();
    if (valid) {
      setUserRole(role ?? null);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  } catch {
    setIsAuthenticated(false);
    setUserRole(null);
  }
};

    checkAuth();
  }, [location.pathname]);

  // Affichage pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // Vérification du rôle
  if (userRole && !allowedRoles.includes(userRole as any)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès Refusé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Votre rôle : <span className="font-semibold">{userRole}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;