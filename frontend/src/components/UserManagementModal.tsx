import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Users,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Mail,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiService, type AppUser, type UserRole } from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateForm { name: string; email: string; role: UserRole }
interface EditForm   { name: string; email: string; role: UserRole; password: string; showPassword: boolean }

const EMPTY_CREATE: CreateForm = { name: "", email: "", role: "editor" };
const EMPTY_EDIT:   EditForm   = { name: "", email: "", role: "editor", password: "", showPassword: false };

type View = "list" | "create" | "edit";

// ─── Composant principal ───────────────────────────────────────────────────────

interface UserManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserManagementModal = ({ open, onOpenChange }: UserManagementModalProps) => {
  const [users, setUsers]               = useState<AppUser[]>([]);
  const [view, setView]                 = useState<View>("list");
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [createForm, setCreateForm]     = useState<CreateForm>(EMPTY_CREATE);
  const [editForm, setEditForm]         = useState<EditForm>(EMPTY_EDIT);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);

  const [formError, setFormError]         = useState("");
  const [apiError, setApiError]           = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const [loadingList, setLoadingList]     = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [resendingId, setResendingId]     = useState<string | null>(null);

  // ── Chargement de la liste ────────────────────────────────────────────────

  const loadUsers = useCallback(async () => {
    setLoadingList(true);
    setApiError("");
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Impossible de charger les utilisateurs.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setView("list");
      setApiError("");
      setSuccessMessage("");
      setWarningMessage("");
      loadUsers();
    }
  }, [open, loadUsers]);

  // ── Navigation ────────────────────────────────────────────────────────────

  const openCreate = () => {
    setCreateForm(EMPTY_CREATE);
    setFormError("");
    setApiError("");
    setView("create");
  };

  const openEdit = (user: AppUser) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, password: "", showPassword: false });
    setFormError("");
    setApiError("");
    setView("edit");
  };

  const backToList = () => {
    setSelectedUser(null);
    setFormError("");
    setApiError("");
    setSuccessMessage("");
    setWarningMessage("");
    setView("list");
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCreate = (): boolean => {
    if (!createForm.name.trim())                   { setFormError("Le nom est requis.");    return false; }
    if (!validateEmail(createForm.email))           { setFormError("Email invalide.");       return false; }
    setFormError(""); return true;
  };

  const validateEdit = (): boolean => {
    if (!editForm.name.trim())                     { setFormError("Le nom est requis.");    return false; }
    if (!validateEmail(editForm.email))             { setFormError("Email invalide.");       return false; }
    if (editForm.password && editForm.password.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères."); return false;
    }
    setFormError(""); return true;
  };

  // ── CRUD handlers ─────────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!validateCreate()) return;
    setLoadingSubmit(true);
    setApiError("");
    setWarningMessage("");
    try {
      const newUser = await apiService.createUser({
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        role: createForm.role,
      });
      setUsers((prev) => [newUser, ...prev]);
      setSuccessMessage(`Compte créé. Un email a été envoyé à ${newUser.email}.`);
      
      // Auto-effacer le message après 5 secondes
      setTimeout(() => setSuccessMessage(""), 5000);
      
      backToList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la création.";
      if (msg.startsWith("__WARNING__")) {
        // Utilisateur créé mais email non envoyé
        setWarningMessage(msg.replace("__WARNING__", ""));
        
        // Auto-effacer le warning après 8 secondes
        setTimeout(() => setWarningMessage(""), 8000);
        
        await loadUsers();
        backToList();
      } else {
        setApiError(msg);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateEdit() || !selectedUser) return;
    setLoadingSubmit(true);
    setApiError("");
    try {
      const updated = await apiService.updateUser(selectedUser._id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
        ...(editForm.password ? { password: editForm.password } : {}),
      });
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
      backToList();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erreur lors de la mise à jour.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoadingDelete(true);
    try {
      await apiService.deleteUser(deleteTarget._id);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erreur lors de la suppression.");
      setDeleteTarget(null);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleResendInvite = async (user: AppUser) => {
    setResendingId(user._id);
    try {
      await apiService.resendInvite(user._id);
      setSuccessMessage(`Email de définition du mot de passe renvoyé à ${user.email}.`);
      
      // Auto-effacer après 5 secondes
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erreur lors du renvoi de l'email.");
    } finally {
      setResendingId(null);
    }
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="flex flex-row items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <DialogTitle>
              {view === "list"   && "Gestion des utilisateurs"}
              {view === "create" && "Créer un utilisateur"}
              {view === "edit"   && "Modifier l'utilisateur"}
            </DialogTitle>
          </DialogHeader>

          {/* ── Messages globaux ─────────────────────────────────────────── */}
          {apiError && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
              <Check className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          {warningMessage && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* ══ VUE LISTE ══════════════════════════════════════════════════ */}
          {view === "list" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {loadingList ? "Chargement…" : `${users.length} utilisateur${users.length !== 1 ? "s" : ""}`}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8"
                    onClick={loadUsers} disabled={loadingList} title="Rafraîchir"
                  >
                    <RefreshCcw className={`w-3.5 h-3.5 ${loadingList ? "animate-spin" : ""}`} />
                  </Button>
                  <Button size="sm" onClick={openCreate} disabled={loadingList}>
                    <Plus className="w-4 h-4 mr-1" />
                    Nouvel utilisateur
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Skeleton */}
                    {loadingList && Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-4 rounded bg-muted animate-pulse w-3/4 w-[120px]" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                    {/* Liste vide */}
                    {!loadingList && users.length === 0 && !apiError && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8 w-[120px]">
                          Aucun utilisateur enregistré.
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Données */}
                    {!loadingList && users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium w-[120px]">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm w-[120px]">{user.email}</TableCell>
                        <TableCell className="w-[120px]"><RoleBadge role={user.role} /></TableCell>
                        <TableCell className="w-[120px]">
                          {user.passwordSet ? (
                            <Badge variant="outline" className="gap-1 text-xs text-green-600 border-green-200">
                              <Check className="w-3 h-3" /> Actif
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 text-xs text-amber-600 border-amber-200">
                              <Clock className="w-3 h-3" /> En attente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right w-[120px]">
                          <div className="flex justify-end gap-1 min-w-[100px]">
                            {/* Renvoyer l'invitation si en attente */}
                            {!user.passwordSet && (
                              <Button
                                variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700"
                                onClick={() => handleResendInvite(user)}
                                disabled={resendingId === user._id}
                                title="Renvoyer l'email d'invitation"
                              >
                                {resendingId === user._id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Mail className="w-3.5 h-3.5" />}
                              </Button>
                            )}
                            <Button
                              variant="ghost" size="icon" className="h-8 w-8"
                              onClick={() => openEdit(user)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(user)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ══ VUE CRÉATION ═══════════════════════════════════════════════ */}
          {view === "create" && (
            <div className="space-y-4">
              {/* Info : pas de champ mot de passe */}
              <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Un email sera automatiquement envoyé à l'utilisateur pour qu'il définisse son mot de passe.
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-name">Nom complet</Label>
                <Input
                  id="create-name" placeholder="Jean Dupont"
                  value={createForm.name} disabled={loadingSubmit}
                  onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email" type="email" placeholder="jean@exemple.com"
                  value={createForm.email} disabled={loadingSubmit}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-role">Rôle</Label>
                <Select
                  value={createForm.role} disabled={loadingSubmit}
                  onValueChange={(val) => setCreateForm((f) => ({ ...f, role: val as UserRole }))}
                >
                  <SelectTrigger id="create-role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-rose-500" /> Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="editor">
                      <div className="flex items-center gap-2">
                        <Pencil className="w-3.5 h-3.5 text-blue-500" /> Editor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={backToList} disabled={loadingSubmit}>
                  <X className="w-4 h-4 mr-1" /> Annuler
                </Button>
                <Button onClick={handleCreate} disabled={loadingSubmit}>
                  {loadingSubmit
                    ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    : <Mail className="w-4 h-4 mr-1" />}
                  Créer et envoyer l'invitation
                </Button>
              </div>
            </div>
          )}

          {/* ══ VUE ÉDITION ════════════════════════════════════════════════ */}
          {view === "edit" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom complet</Label>
                <Input
                  id="edit-name" placeholder="Jean Dupont"
                  value={editForm.name} disabled={loadingSubmit}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email" type="email" placeholder="jean@exemple.com"
                  value={editForm.email} disabled={loadingSubmit}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Rôle</Label>
                <Select
                  value={editForm.role} disabled={loadingSubmit}
                  onValueChange={(val) => setEditForm((f) => ({ ...f, role: val as UserRole }))}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-rose-500" /> Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="editor">
                      <div className="flex items-center gap-2">
                        <Pencil className="w-3.5 h-3.5 text-blue-500" /> Editor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Champ mot de passe optionnel */}
              <div className="space-y-2">
                <Label htmlFor="edit-password">
                  Nouveau mot de passe{" "}
                  <span className="text-muted-foreground font-normal">(laisser vide pour ne pas modifier)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="edit-password"
                    type={editForm.showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={editForm.password}
                    disabled={loadingSubmit}
                    className="pr-10"
                    onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setEditForm((f) => ({ ...f, showPassword: !f.showPassword }))}
                  >
                    {editForm.showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={backToList} disabled={loadingSubmit}>
                  <X className="w-4 h-4 mr-1" /> Annuler
                </Button>
                <Button onClick={handleUpdate} disabled={loadingSubmit}>
                  {loadingSubmit
                    ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    : <Check className="w-4 h-4 mr-1" />}
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Confirmation suppression ──────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer{" "}
              <strong>{deleteTarget?.name}</strong>. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingDelete}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={loadingDelete}
            >
              {loadingDelete && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ─── Sous-composant badge rôle ─────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  return role === "admin" ? (
    <Badge variant="destructive" className="gap-1 text-xs">
      <Shield className="w-3 h-3" /> Admin
    </Badge>
  ) : (
    <Badge variant="secondary" className="gap-1 text-xs">
      <Pencil className="w-3 h-3" /> Editor
    </Badge>
  );
}

export default UserManagementModal;