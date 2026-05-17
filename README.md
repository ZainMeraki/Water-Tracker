> ## Water Usage Tracker
>
> A clean, responsive web app for monitoring household water consumption measured in cubic meters (m³). Designed for people who want to track usage patterns and identify potential pipe leaks by comparing daytime and overnight meter readings.
>
> ### Features
>
> - Log daily meter readings split into **day (awake)** and **night (asleep)** periods
> - **Night shower support** — mark nights where someone showers; the shower volume is measured separately and subtracted from the overnight total, so it isn't misread as a leak
> - **Automatic leak detection** — any net overnight consumption above a configurable threshold is flagged with a warning
> - **Persistent storage** — all data is saved to `localStorage` and survives page refreshes and browser restarts
> - **Dark mode** — manual toggle with preference saved between sessions, plus automatic detection of system preference on first load
> - **CSV export** — download all logged data as a `.csv` file, ready to open in Excel, Google Sheets, or Numbers
> - **Summary tiles** — running totals for day use, net night use, shower use, and number of nights flagged
>
> ### Tech stack
>
> - [React 18](https://react.dev/) — UI and component state
> - [Vite](https://vitejs.dev/) — development server and build tooling
> - [Tailwind CSS v3](https://tailwindcss.com/) — utility-first styling with `class`-based dark mode
>
> ### Build for production
>
> ```bash
> npm run build
> npm run preview
> ```
>
> ### Project structure
>
> ```
> src/
> ├── App.jsx # Root component, manages dark mode
> ├── main.jsx # React entry point
> ├── index.css # Tailwind directives
> ├── hooks/
> │ └── useStorage.js # localStorage persistence and row logic
> └── components/
> ├── WaterTracker.jsx # Main layout and toolbar
> ├── TrackerRow.jsx # Individual table row with inputs
> ├── SummaryCards.jsx # Summary stat tiles
> └── exportCSV.js # CSV generation utility
