# Client (frontend)

This folder contains the React + Vite frontend.

Key notes:

- The client uses an `apiClient` axios instance at `src/utils/apiClient.ts` which sets the base URL to `/api` and exposes `setAuthToken(token)` to attach the `Authorization` header automatically.
- To run locally:

```powershell
cd client
npm install
npm run dev
```

The dev server proxies API requests to the server, so the frontend can call `/api/*` directly.
