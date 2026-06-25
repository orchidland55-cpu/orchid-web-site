export const loadGTM = () => {
  // Attendre que la page soit interactive
  if (document.readyState === 'complete') {
    initializeGTM();
  } else {
    window.addEventListener('load', initializeGTM);
  }
};

const initializeGTM = () => {
  // Charger GTM après le chargement complet de la page
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=G-PNVYWFNNY5`;
  document.head.appendChild(script);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-PNVYWFNNY5');
  `;
  document.head.appendChild(script2);
};