// hooks/useUserRole.tsx
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export type UserRole = 'admin' | 'editor' | null;

interface UserRoleData {
  role: UserRole;
  isAdmin: boolean;
  isEditor: boolean;
  isAuthenticated: boolean;
  email: string | null;
}

/**
 * Hook personnalisé pour gérer les rôles et permissions utilisateur
 * 
 * @returns {UserRoleData} Informations sur le rôle et les permissions de l'utilisateur
 * 
 * @example
 * const { isAdmin, isEditor, role } = useUserRole();
 * 
 * if (isAdmin) {
 *   // Afficher les boutons de suppression
 * }
 * 
 * if (isEditor || isAdmin) {
 *   // Afficher les boutons de modification
 * }
 */
export const useUserRole = (): UserRoleData => {
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem('adminToken');
      const storedEmail = localStorage.getItem('adminEmail');

      if (!token) {
        setRole(null);
        setEmail(null);
        return;
      }

      try {
        // Vérifier le token et récupérer les infos utilisateur
        const isValid = await apiService.verifyToken();
        
        if (isValid) {
          // Décoder le token pour obtenir le rôle
          // Le token JWT contient : { userId, role }
          const payload = JSON.parse(atob(token.split('.')[1]));
          setRole(payload.role as UserRole);
          setEmail(storedEmail);
        } else {
          setRole(null);
          setEmail(null);
        }
      } catch (error) {
        console.error('Erreur vérification rôle:', error);
        setRole(null);
        setEmail(null);
      }
    };

    checkUserRole();
  }, []);

  return {
    role,
    isAdmin: role === 'admin',
    isEditor: role === 'editor',
    isAuthenticated: role !== null,
    email,
  };
};

/**
 * Hook pour vérifier si l'utilisateur a la permission d'effectuer une action
 * 
 * @param {string[]} allowedRoles - Liste des rôles autorisés pour cette action
 * @returns {boolean} true si l'utilisateur a la permission
 * 
 * @example
 * const canDelete = usePermission(['admin']);
 * const canEdit = usePermission(['admin', 'editor']);
 */
export const usePermission = (allowedRoles: string[]): boolean => {
  const { role } = useUserRole();
  
  if (!role) return false;
  return allowedRoles.includes(role);
};