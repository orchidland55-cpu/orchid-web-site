const RAILWAY_URL = import.meta.env.VITE_API_URL;
const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

let intervalId: ReturnType<typeof setInterval> | null = null;

export function startKeepAlive() {
  if (intervalId) return; // déjà démarré

  // Ping immédiat au chargement
  ping();

  // Puis toutes les 14 minutes
  intervalId = setInterval(ping, PING_INTERVAL_MS);
}

export function stopKeepAlive() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

async function ping() {
  try {
    await fetch(`${RAILWAY_URL}/`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // abandonne après 5s
    });
  } catch {
    // silencieux — c'est juste un ping
  }
}