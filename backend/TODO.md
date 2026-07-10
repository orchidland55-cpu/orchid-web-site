# TODO - Admin Login CSP Fix

## Information gathered
- Backend logs show requests to `/api/auth/login`, `/api/auth/verify`, and `/api/analytics/track-page` are being blocked in the browser by CSP (`connect-src`).
- Express/helmet in `backend/index.js` has `contentSecurityPolicy: false`, so CSP is likely coming from the **frontend admin hosting** (or a different server layer), not from helmet.
- Need to allow the Railway backend domain in the browser `connect-src` policy so login can reach the backend.

## Plan
1. Inspect `backend/index.js` and existing security/CSP middleware to confirm whether backend is emitting CSP headers (it currently disables helmet CSP).
2. Implement server-side headers to make CORS/preflight work; ensure cookies/credentials are allowed.
3. Add a middleware that explicitly sets a permissive `Content-Security-Policy` for **api routes only** (or disable CSP for the backend responses) so that the admin app can reach the API.
4. Re-run server and verify that the browser no longer blocks `connect-src` calls.

## Dependent files
- `index.js`

## Followup steps
- Start backend.
- Open admin page and test login.
- If still blocked, update CSP in the frontend/hosting config (outside this repo).

