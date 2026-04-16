# Implementation Plan: Sportz Real-Time Dashboard

This document serves as the high-level roadmap and project definition for building the **Sportz Frontend**.

## 🥅 Project Overview
**Sportz** is a real-time sports aggregator project designed to showcase high-performance data streaming. The backend (Express + WebSockets) is already built to provide live match data and minute-by-minute commentary.

### Project Objective
The goal is to create a React/Vite frontend that connects to your existing infrastructure to provide a "live stadium" experience for users, focusing on speed and clear data visualization.

---

## 🛠️ Existing Backend Infrastructure
This plan is built to utilize your established backend in `src/`:
- **Data Source**: Drizzle ORM managing `matches` and `commentary` tables.
- **REST APIs**: `GET /matches` (List) and `GET /matches/:id/commentary` (History).
- **Real-Time Layer**: WebSocket server on `/ws` using JSON-based subscription.

---

## 🚀 High-Level Implementation Roadmap

### Phase 1: Environment Setup
- Initialize Vite + React project.
- Install `framer-motion`, `lucide-react`, and `axios`.

### Phase 2: Integration Layer
- Build the API client for existing REST routes.
- Implement the WebSocket hook based on the `src/ws/server.js` logic.

### Phase 3: UI Construction
- Develop the Dashboard using `MatchCard` components.
- Develop the Live Match view with the Commentary timeline.

### Phase 4: Polish & Performance
- Add smooth transitions for incoming data.
- Optimize connection handling (auto-reconnect).

---

## Open Questions
- Should we prioritize a specific sport (Football/Cricket) for the initial UI layout?
- Do you want a "Live" filter on the dashboard by default?
