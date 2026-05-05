import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, ChevronDown } from 'lucide-react';
import { switchGoogleLanguage, getCurrentGoogleLanguage } from '@/hooks/useGoogleTranslate';

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

  // Read active language from the Google Translate cookie (persists on reload)
  const currentCode = getCurrentGoogleLanguage();
  const currentLanguage =
    languages.find((l) => l.code === currentCode) || languages[0];

  const handleChange = (code: string) => {
    setIsOpen(false);
    if (code !== currentCode) {
      switchGoogleLanguage(code); // sets cookie + reloads
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-foreground hover:text-primary transition-smooth"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">{currentLanguage.flag}</span>
          <ChevronDown className="w-3 h-3" />
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
              }`}
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