import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, ChevronDown, Loader2 } from 'lucide-react';
import { initGoogleTranslate, switchGoogleLanguage, getCurrentGoogleLanguage } from '@/hooks/useGoogleTranslate';

// ─── Supported languages ──────────────────────────────────────────────────────

const languages = [
  { code: 'en', name: 'English',  flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية',  flag: '🇸🇦' },
  { code: 'es', name: 'Español',  flag: '🇪🇸' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Read active language from the Google Translate cookie (persists on reload)
  const currentCode = getCurrentGoogleLanguage();
  const currentLanguage =
    languages.find((l) => l.code === currentCode) || languages[0];

  const handleChange = async (code: string) => {
    // Éviter les changements multiples ou inutiles
    if (isChanging || code === currentCode) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    setIsOpen(false);

    try {
      // Initialiser Google Translate si pas encore fait
      await initGoogleTranslate();
      
      // Changer la langue
      await switchGoogleLanguage(code);
      
      // Attendre que la traduction soit appliquée
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Forcer un re-render pour mettre à jour l'UI
      window.dispatchEvent(new Event('languageChanged'));
      
    } catch (error) {
      console.error('Failed to switch language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-foreground hover:text-primary transition-smooth"
          disabled={isChanging}
        >
          {isChanging ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          <span className="text-sm">{currentLanguage.flag}</span>
          {isChanging ? (
            <span className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => {
          const isActive = language.code === currentCode;
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleChange(language.code)}
              className={`flex items-center space-x-2 cursor-pointer ${
                isActive ? 'bg-primary/10 text-primary' : ''
              } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isChanging}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
              {isActive && (
                <div className="w-2 h-2 bg-primary rounded-full ml-auto" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;