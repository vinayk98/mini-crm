# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

````js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # mini-crm

    A small CRM demo built with React, TypeScript and Tailwind CSS. It uses Zustand for client state, json-server as a lightweight backend (db.json), and Vite for development.

    This README contains quick setup steps, architecture overview, and the project folder structure to help you get started.

    ## Tech stack
    - React 19 + TypeScript
    - Vite (dev server / build)
    - Tailwind CSS
    - Zustand (state management)
    - json-server (fake REST API using `db.json`)
    - axios (HTTP client)

    ## Prerequisites
    - Node.js (>=16 recommended)
    - npm or yarn

    ## Setup & run
    1. Install dependencies

    ```bash
    npm install
    # or
    # yarn
    ```

    2. Start json-server (serves `db.json` on port 3001)

    ```bash
    npm run server
    # or
    # npx json-server --watch db.json --port 3001
    ```

    3. Start the dev server (Vite)

    ```bash
    npm run dev
    ```

    Open http://localhost:5173 (Vite default) in your browser. The frontend expects the API at http://localhost:3001.

    ## Available npm scripts
    - `npm run dev` — start vite dev server
    - `npm run server` — start json-server (db.json)
    - `npm run build` — build production assets
    - `npm run preview` — preview built app

    ## Architecture & data flow

    - UI: React components in `src/features` and `src/components` render pages and widgets.
    - State: Global application state (leads, notes, followups) is managed with Zustand stores in `src/store`. Components subscribe to stores using selectors.
    - Services: API wrapper functions live in `src/services/*` (axios is configured in `src/services/api.ts`). Stores and components call these services to fetch and mutate data.
    - Backend: `json-server` serves `db.json` with REST endpoints (e.g., `/leads`, `/notes`, `/followups`). The server is intentionally simple for local dev and prototyping.

    Data flow example (create a note):
    1. UI calls `useNotesStore().addNote(payload)`.
    2. Store calls `createNote` in `src/services/notePage.ts` which POSTs to `/notes`.
    3. Store updates local state (and may refetch the canonical list) so the UI shows the new note.

    ## Folder structure (key files)

    Top-level

    ```
    db.json                # fake backend data for json-server
    package.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      assets/
      components/
        DashboardLayout.tsx
        InputField.tsx
        StatusBadge.tsx
      features/
        auth/
        leads/
          LeadsPage.tsx
          LeadDetailPage.tsx
        notes/
        followups/
      services/
        api.ts
        leadService.ts
        notePage.ts
        followup.ts
      store/
        leadStore.ts
        notesStore.ts
        followupStore.ts
      types/
        lead.ts
        leadFormData.ts
    ```

    ## Common endpoints (json-server)
    - GET /leads
    - GET /leads/:id
    - GET /notes
    - POST /notes
    - GET /followups
    - POST /followups

    You can also query with params: `/notes?leadId=123` and `/followups?leadId=123`.

    ## Debugging tips
    - If notes or followups appear missing in the UI, verify the json-server is running and pointing at the same `db.json` file (restart the server after edits).
    - Use curl or Postman to hit the API directly:

    ```bash
    curl 'http://localhost:3001/notes'
    curl 'http://localhost:3001/notes?leadId=463'
    ```

    - Open DevTools → Network to inspect requests and responses from the frontend.

    ## Next steps / improvements
    - Normalize ID types across the app (strings vs numbers) to tighten TypeScript types.
    - Add tests (Jest/RTL) and basic CI for lint/build checks.
    - Consider replacing json-server with a lightweight Node/Express mock server if you need custom logic.

    ---

    If you want, I can add a short developer guide section (how to add a new store, how to wire a page to the store, or how to seed `db.json`) — tell me which and I'll append it.

  }])
````
