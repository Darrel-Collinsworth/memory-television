# 👋 READ THIS FIRST — AI Handoff Document
## Memory Television — Darrel Collinsworth

This document is for any AI agent picking up this project on a new machine or session.
Read this file first, then read the others in this `.context/` folder in this order:

1. `PROJECT_BRIEF.md` — What this project is and the creative vision
2. `ARCHITECTURE.md` — Tech stack, file structure, key implementation decisions
3. `PROGRESS.md` — What has been built, current state, known issues

---

## About Darrel (the user)

- **Artist, designer, developer** based in Portland, Maine (currently moving — transitioning to a new city/chapter)
- Has been working with multiple AI assistants across sessions: Loop (ChatGPT), Loop2 (Claude/you), Loop3 (Gemini)
- Works across **two computers** — a desktop and a laptop. Uses git to sync. Updates `.context/` on push so the other machine's AI stays current.
- Prefers concise, direct communication. Doesn't need hand-holding.
- This project is deeply personal — treat the creative decisions with care.

---

## Working Style

- Dev server runs at `localhost:5173` via `npm run dev` from the project root
- Always stop the server when done: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173 | Select-Object -ExpandProperty OwningProcess | Select-Object -Unique) -Force`
- Windows machine, PowerShell — there's a conda PATH warning on shell init, ignore it, commands still work
- Darrel will often ask architectural/conceptual questions before implementation — answer those thoroughly before touching code

---

## Current Priority

The project is in an **asset-gathering pause**. Darrel is in the process of:
- Photographing his Portland studio in 360° equirectangular format for the Nostalgia Nihilism world
- Recording voice narration (ambient room audio + personal reflection) in the studio space
- Settling into a new home before resuming heavy implementation

**Next major implementation milestone:** Nostalgia Nihilism world redesign using real 360° photo environment + voice narration via the CRT system.
