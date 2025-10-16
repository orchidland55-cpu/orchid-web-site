'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share2 } from 'lucide-react';

// Icônes SVG simples (tu peux les remplacer par Lucide si disponible)
const FacebookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.05 10.05 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 14-7.522 14-14.015 0-.213-.005-.425-.015-.636a10.012 10.012 0 002.46-2.548l-.047-.02z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function ShareButton({ showText = true }: { showText?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  // Encode l'URL et le titre actuels
  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTitle = typeof document !== 'undefined' ? encodeURIComponent(document.title) : '';

  const networks = [
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon />,
      url: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinIcon />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
  ];

  const openSharePopup = (url: string) => {
    window.open(url, 'share', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        {showText && 'Share'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this article</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {networks.map((network, index) => (
              <button
                key={index}
                onClick={() => openSharePopup(network.url)}
                className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-muted transition-colors border border-border"
              >
                {network.icon}
                {network.name}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}