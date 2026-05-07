// components/SpaceManager.tsx
import { useState, useEffect, useRef } from 'react';
import { apiService, SpaceData, SpaceDataWithPassword, SpaceFile } from '../services/api';
import { uploadFileToSpace } from '../services/cloudinary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Lock, Plus, Trash2, Upload, Link2, Power, PowerOff,
  Eye, EyeOff, FileText, X, CheckCircle, AlertCircle,
  Loader2, FolderOpen, Download,
} from 'lucide-react';
import { showToast } from '@/components/ToastContainer';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getFileIcon(format: string, resourceType: string) {
  if (resourceType === 'image') return '🖼️';
  if (resourceType === 'video') return '🎬';
  const ext = (format || '').toLowerCase();
  if (ext === 'pdf') return '📄';
  if (['zip', 'rar', '7z', 'gz'].includes(ext)) return '📦';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['xls', 'xlsx'].includes(ext)) return '📊';
  if (['ppt', 'pptx'].includes(ext)) return '📋';
  if (['mp3', 'wav', 'ogg'].includes(ext)) return '🎵';
  return '📁';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal credentials — affiché UNE seule fois à la création
// ─────────────────────────────────────────────────────────────────────────────

function CredentialsModal({
  spaceId, passwordPlain, name, onClose,
}: {
  spaceId: string; passwordPlain: string; name: string; onClose: () => void;
}) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);

  const copy = (text: string, set: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    set(true);
    setTimeout(() => set(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-green-200">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <CardTitle className="text-lg">Espace « {name} » créé</CardTitle>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Communiquez ces identifiants aux personnes concernées.{' '}
            <span className="font-semibold text-amber-600">Le mot de passe ne sera plus affiché.</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Identifiant de l'espace
            </label>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5">
              <span className="flex-1 font-mono font-semibold tracking-widest text-foreground text-sm">
                {spaceId}
              </span>
              <Button size="sm" variant={copiedId ? 'default' : 'outline'} className="h-7 text-xs px-2"
                onClick={() => copy(spaceId, setCopiedId)}>
                {copiedId ? '✓ Copié' : 'Copier'}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Mot de passe
            </label>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
              <span className="flex-1 font-mono font-semibold text-amber-800 text-sm">
                {passwordPlain}
              </span>
              <Button size="sm" variant={copiedPwd ? 'default' : 'outline'} className="h-7 text-xs px-2"
                onClick={() => copy(passwordPlain, setCopiedPwd)}>
                {copiedPwd ? '✓ Copié' : 'Copier'}
              </Button>
            </div>
          </div>
          <Button className="w-full" onClick={onClose}>Compris, fermer</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel latéral — détail espace + upload admin + liste fichiers
// ─────────────────────────────────────────────────────────────────────────────

function SpaceDetailPanel({
  space, adminToken, onClose, onFilesChange,
}: {
  space: SpaceData;
  adminToken: string;
  onClose: () => void;
  onFilesChange: (spaceId: string, delta: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<SpaceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { loadFiles(); }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSpaceById(space._id);
      setFiles(data.files || []);
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadPct(0);
    try {
      // L'admin upload avec son JWT admin standard
      const newFile = await uploadFileToSpace(space.spaceId, file, adminToken, setUploadPct);
      setFiles(prev => [...prev, newFile]);
      onFilesChange(space.spaceId, +1);
      showToast({ type: 'success', title: 'Fichier ajouté', message: `"${file.name}" uploadé avec succès.` });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur upload', message: err.message });
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await apiService.deleteSpaceFile(space.spaceId, fileId);
      setFiles(prev => prev.filter(f => f._id !== fileId));
      onFilesChange(space.spaceId, -1);
      setConfirmDelete(null);
      showToast({ type: 'success', title: 'Supprimé', message: 'Le fichier a été supprimé.' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur', message: err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-start justify-end">
      <div className="bg-background w-full max-w-lg h-full shadow-2xl border-l flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 luxury-gradient rounded-lg flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">{space.name}</h3>
              <p className="text-xs text-muted-foreground font-mono">{space.spaceId}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Zone upload */}
        <div className="px-5 py-4 border-b">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Ajouter un fichier
          </p>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault(); setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f && !uploading) handleUpload(f);
            }}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer
              ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/40'}
              ${uploading ? 'cursor-not-allowed opacity-70' : ''}
            `}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2.5">
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${uploadPct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" /> Upload en cours… {uploadPct}%
                </span>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Glissez un fichier ou{' '}
                  <span className="text-primary font-medium">cliquez pour choisir</span>
                </p>
                <p className="text-xs text-muted-foreground/50 mt-1">Tous types · max 50 MB</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) { handleUpload(f); e.target.value = ''; } }} />
        </div>

        {/* Liste fichiers */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {loading ? '…' : `${files.length} fichier${files.length !== 1 ? 's' : ''}`}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Chargement…</span>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Aucun fichier pour l'instant</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map(file => (
                <div key={file._id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors group">
                  <span className="text-lg flex-shrink-0">{getFileIcon(file.format, file.resourceType)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {file.sizeFormatted} · {(file.format || '').toUpperCase()} · {formatDate(file.uploadedAt)}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      par {file.uploadedBy === 'admin' ? 'vous' : 'visiteur'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => window.open(file.url, '_blank')} title="Télécharger / Ouvrir">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    {confirmDelete === file._id ? (
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="destructive" className="h-7 text-xs px-2"
                          onClick={() => handleDelete(file._id)}>
                          Confirmer
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs px-2"
                          onClick={() => setConfirmDelete(null)}>
                          Annuler
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive"
                        onClick={() => setConfirmDelete(file._id)} title="Supprimer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────

export default function SpaceManager() {
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<SpaceData | null>(null);
  const [newCreated, setNewCreated] = useState<{ spaceId: string; passwordPlain: string; name: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [form, setForm] = useState({ name: '', password: '', allowUpload: false, description: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const adminToken = localStorage.getItem('adminToken') || '';

  useEffect(() => { loadSpaces(); }, []);

  const loadSpaces = async () => {
    try {
      setLoading(true);
      setSpaces(await apiService.getSpaces());
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur', message: err.message });
    } finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setSubmitting(true);
    try {
      const created = await apiService.createSpace(form) as SpaceDataWithPassword;
      setSpaces(prev => [created, ...prev]);
      setNewCreated({ spaceId: created.spaceId, passwordPlain: created.passwordPlain, name: created.name });
      setForm({ name: '', password: '', allowUpload: false, description: '' });
      setShowCreate(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally { setSubmitting(false); }
  };

  const handleToggle = async (space: SpaceData) => {
    try {
      const updated = await apiService.updateSpace(space._id, { isActive: !space.isActive });
      setSpaces(prev => prev.map(s => s._id === space._id ? { ...s, isActive: updated.isActive } : s));
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur', message: err.message });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteSpace(id);
      setSpaces(prev => prev.filter(s => s._id !== id));
      setDeleteConfirm(null);
      if (selectedSpace?._id === id) setSelectedSpace(null);
      showToast({ type: 'success', title: 'Supprimé', message: 'L\'espace et ses fichiers ont été supprimés.' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur', message: err.message });
    }
  };

  const handleCopyLink = (spaceId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/space?id=${spaceId}`);
    showToast({ type: 'success', title: 'Lien copié', message: 'Le lien d\'accès visiteur a été copié.' });
  };

  const handleFilesChange = (spaceId: string, delta: number) => {
    setSpaces(prev => prev.map(s =>
      s.spaceId === spaceId ? { ...s, filesCount: Math.max(0, s.filesCount + delta) } : s
    ));
  };

  return (
    <div className="space-y-6">

      {/* Modals */}
      {newCreated && <CredentialsModal {...newCreated} onClose={() => setNewCreated(null)} />}

      {selectedSpace && (
        <SpaceDetailPanel
          space={selectedSpace} adminToken={adminToken}
          onClose={() => setSelectedSpace(null)}
          onFilesChange={handleFilesChange}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold">Supprimer cet espace ?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Tous les fichiers Cloudinary seront supprimés.<br />Action irréversible.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>Supprimer</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 luxury-gradient rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Espaces de partage</h2>
            <p className="text-sm text-muted-foreground">
              {spaces.length} espace{spaces.length !== 1 ? 's' : ''} créé{spaces.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreate(v => !v)} className="gap-2">
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreate ? 'Annuler' : 'Nouvel espace'}
        </Button>
      </div>

      {/* Formulaire création */}
      {showCreate && (
        <Card className="border-primary/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4" /> Créer un espace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nom de l'espace
                  </label>
                  <input type="text" required placeholder="Ex: Projet Client X"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} required placeholder="Min. 6 caractères"
                      value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full px-3 py-2 pr-9 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" />
                    <button type="button" onClick={() => setShowPwd(p => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description <span className="font-normal normal-case text-muted-foreground/60">(optionnel)</span>
                </label>
                <textarea placeholder="Message visible par les visiteurs après connexion…"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow" />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 cursor-pointer select-none"
                onClick={() => setForm(f => ({ ...f, allowUpload: !f.allowUpload }))}>
                <div className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${form.allowUpload ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{ left: form.allowUpload ? '18px' : '2px' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Autoriser les uploads clients</p>
                  <p className="text-xs text-muted-foreground">Les visiteurs pourront déposer des fichiers</p>
                </div>
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{formError}
                </div>
              )}

              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Création…' : 'Créer l\'espace'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* État vide */}
      {!loading && spaces.length === 0 && !showCreate && (
        <Card>
          <CardContent className="py-16 text-center">
            <Lock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Aucun espace créé pour l'instant</p>
            <Button variant="outline" className="mt-4 gap-2" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4" /> Créer le premier espace
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Chargement…</span>
        </div>
      )}

      {/* Liste */}
      {!loading && spaces.length > 0 && (
        <div className="space-y-3">
          {spaces.map(space => (
            <Card key={space._id}
              className={`transition-all hover:shadow-md ${!space.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${space.isActive ? 'luxury-gradient' : 'bg-muted'}`}>
                    <Lock className={`w-4 h-4 ${space.isActive ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-foreground">{space.name}</span>
                      <Badge variant={space.isActive ? 'default' : 'secondary'} className="text-xs">
                        {space.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      {space.allowUpload && (
                        <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">
                          Upload client ON
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span className="font-mono font-medium text-primary">{space.spaceId}</span>
                      <span>·</span>
                      <span>{space.filesCount} fichier{space.filesCount !== 1 ? 's' : ''}</span>
                      {space.totalSize && <><span>·</span><span>{space.totalSize}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"
                      onClick={() => setSelectedSpace(space)}>
                      <FolderOpen className="w-3.5 h-3.5" />
                      Fichiers
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Copier le lien"
                      onClick={() => handleCopyLink(space.spaceId)}>
                      <Link2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon"
                      className={`h-8 w-8 ${space.isActive ? 'text-green-600 hover:text-green-700' : 'text-muted-foreground'}`}
                      title={space.isActive ? 'Désactiver' : 'Activer'}
                      onClick={() => handleToggle(space)}>
                      {space.isActive ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive"
                      title="Supprimer" onClick={() => setDeleteConfirm(space._id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}