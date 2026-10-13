# RAG Chatbot

A responsive, single-page document chat frontend built with React, Vite, and Tailwind CSS.

## Component structure

- `src/App.jsx` owns the selected theme, locally selected document, and responsive panel state.
- `src/components/Sidebar.jsx` renders workspace navigation, searchable history/recent activity, and local document selection.
- `src/components/ChatPanel.jsx` renders the welcome state, prompt-fill suggestions, and keyboard-friendly message composer.
- `src/components/DocumentPanel.jsx` renders essential details for a locally selected document.
- `src/components/Icon.jsx` provides the shared inline SVG icon set.
- `src/App.css` contains the workspace layout, component styling, responsive breakpoints, and theme tokens. `src/index.css` loads Tailwind and sets global defaults.

## Setup

Node.js and npm are required. From the project directory:

```sh
npm install
npm run dev
```

Tailwind CSS v4 is integrated through `@tailwindcss/vite` in `vite.config.js` and loaded by `src/index.css`. The application uses Vite's development server for local preview.

## Frontend-only behavior

This project does not include or simulate a RAG/AI backend. Questions are not sent; submitting one displays a clear notice. Selecting a local file displays its actual name, file type, and size for the current browser session; it does not upload, parse, or index the file. No sample conversations, documents, or previews are included. To provide answers and retrieved citations, connect a real document-ingestion and retrieval API.

Suggested prompts only fill the composer; they do not submit messages or generate answers. Sidebar search filters available recent local file activity. Conversation history remains empty until real conversation persistence is connected.

The document information panel remains hidden until a local file is selected. At tablet and mobile widths it opens as a side drawer. The navigation can collapse on desktop and opens as a drawer on mobile. Both drawers can be dismissed with Escape or their close controls.

## Validation

```sh
npm run lint
npm run build
```
