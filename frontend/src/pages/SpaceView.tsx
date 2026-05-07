import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Lock, Download, Upload, LogOut, Loader2, AlertCircle,
  FileText, Search, RefreshCw,
} from 'lucide-react';
import { apiService, SpaceFile, SpaceFilesData } from '../services/api';
import { uploadFileToSpace } from '../services/cloudinary';
import orchidLogo from '@/assets/logopng.png';

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
    hour: '2-digit', minute: '2-digit',
  });
}

function getFileColor(resourceType: string, format: string) {
  if (resourceType === 'image') return 'text-cyan-600 bg-cyan-50 border-cyan-100';
  if (resourceType === 'video') return 'text-purple-600 bg-purple-50 border-purple-100';
  const ext = (format || '').toLowerCase();
  if (ext === 'pdf') return 'text-red-600 bg-red-50 border-red-100';
  if (['zip', 'rar', '7z'].includes(ext)) return 'text-amber-600 bg-amber-50 border-amber-100';
  if (['doc', 'docx'].includes(ext)) return 'text-blue-600 bg-blue-50 border-blue-100';
  if (['xls', 'xlsx'].includes(ext)) return 'text-green-600 bg-green-50 border-green-100';
  return 'text-muted-foreground bg-muted border-border';
}

// ─────────────────────────────────────────────────────────────────────────────
// Composant carte fichier
// ─────────────────────────────────────────────────────────────────────────────

function FileCard({ file, onDownload }: { file: SpaceFile; onDownload: (f: SpaceFile) => void }) {
  const colorClass = getFileColor(file.resourceType, file.format);

  return (
    <Card
      className="hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-primary/30"
      onClick={() => onDownload(file)}
    >
      <CardContent className="p-4 flex items-center gap-4">
        {/* Icône */}
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 text-2xl ${colorClass} transition-transform group-hover:scale-105`}>
          {getFileIcon(file.format, file.resourceType)}
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            {file.sizeFormatted} · {(file.format || '').toUpperCase()} · {formatDate(file.uploadedAt)}
          </p>
        </div>

        {/* Action */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Download className="w-3.5 h-3.5" />
            Télécharger
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────────────────────

export default function SpaceView() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate    = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [spaceData,     setSpaceData]     = useState<SpaceFilesData | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [search,        setSearch]        = useState('');
  const [uploading,     setUploading]     = useState(false);
  const [uploadPct,     setUploadPct]     = useState(0);
  const [uploadError,   setUploadError]   = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [dragOver,      setDragOver]      = useState(false);

  const token = sessionStorage.getItem(`spaceToken_${spaceId?.toUpperCase()}`);

  useEffect(() => {
    if (!token || !spaceId) {
      navigate(`/space?id=${spaceId || ''}`);
      return;
    }
    loadFiles();
  }, [spaceId]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getSpaceFiles(spaceId!.toUpperCase(), token!);
      setSpaceData(data);
    } catch (err: any) {
      if (err.message === '__EXPIRED__') {
        sessionStorage.removeItem(`spaceToken_${spaceId?.toUpperCase()}`);
        navigate(`/space?id=${spaceId}&expired=1`);
      } else {
        setError(err.message || 'Impossible de charger les fichiers');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file: SpaceFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async (file: File) => {
    if (!spaceData?.allowUpload || !spaceId || !token) return;
    setUploadError('');
    setUploadSuccess('');
    setUploading(true);
    setUploadPct(0);
    try {
      const newFile = await uploadFileToSpace(spaceId.toUpperCase(), file, token, setUploadPct);
      setSpaceData(prev => prev ? { ...prev, files: [...prev.files, newFile] } : prev);
      setUploadSuccess(`"${file.name}" uploadé avec succès.`);
      setTimeout(() => setUploadSuccess(''), 5000);
    } catch (err: any) {
      setUploadError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(`spaceToken_${spaceId?.toUpperCase()}`);
    sessionStorage.removeItem(`spaceInfo_${spaceId?.toUpperCase()}`);
    navigate('/space');
  };

  const filteredFiles = (spaceData?.files || []).filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── États de chargement / erreur ──────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <img src={orchidLogo} alt="Logo" className="h-10 w-auto" />
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Chargement de l'espace…</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <img src={orchidLogo} alt="Logo" className="h-10 w-auto" />
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-foreground font-medium">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={loadFiles} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Réessayer
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Vue principale ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <img src={orchidLogo} alt="Logo" className="h-10 w-auto flex-shrink-0" />
              <div className="hidden sm:block w-px h-8 bg-border" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Lock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="font-semibold text-foreground text-sm truncate">{spaceData?.name}</span>
                  {spaceData?.allowUpload && (
                    <Badge variant="outline" className="text-xs border-purple-200 text-purple-600 bg-purple-50 flex-shrink-0">
                      Upload activé
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono hidden sm:block">
                  {spaceId?.toUpperCase()} · {spaceData?.files.length || 0} fichier{(spaceData?.files.length || 0) !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 flex-shrink-0">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Quitter</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">

        {/* Description */}
        {spaceData?.description && (
          <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm text-foreground leading-relaxed">
            {spaceData.description}
          </div>
        )}

        {/* Zone upload (si autorisé) */}
        {spaceData?.allowUpload && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="w-4 h-4" /> Déposer un fichier
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/30'}
                  ${uploading ? 'cursor-not-allowed opacity-70' : ''}
                `}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="h-full luxury-gradient rounded-full transition-all duration-300"
                        style={{ width: `${uploadPct}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Upload en cours… {uploadPct}%
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Glissez un fichier ici ou{' '}
                      <span className="text-primary font-medium">cliquez pour choisir</span>
                    </p>
                    <p className="text-xs text-muted-foreground/50 mt-1">Tous types de fichiers · max 50 MB</p>
                  </>
                )}
              </div>

              <input ref={fileInputRef} type="file" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) { handleUpload(f); e.target.value = ''; } }} />

              {uploadSuccess && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <span className="w-4 h-4 flex-shrink-0">✓</span>{uploadSuccess}
                </div>
              )}
              {uploadError && (
                <div className="mt-3 flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{uploadError}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* En-tête liste fichiers */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Fichiers disponibles
          </h2>

          {/* Recherche (si assez de fichiers) */}
          {(spaceData?.files.length || 0) > 5 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un fichier…"
                className="pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 w-48 transition-shadow"
              />
            </div>
          )}
        </div>

        {/* Liste fichiers */}
        {filteredFiles.length === 0 ? (
          <Card>
            <CardContent className="py-14 text-center">
              <FileText className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {search ? 'Aucun fichier ne correspond à votre recherche' : 'Aucun fichier dans cet espace pour l\'instant'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map(file => (
              <FileCard key={file._id} file={file} onDownload={handleDownload} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground/50 mt-8">
          Session sécurisée · Cliquez sur un fichier pour le télécharger
        </p>
      </main>
    </div>
  );
}