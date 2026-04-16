# Sportz: Technical & Design Guide

This guide provides the technical and design specifications for building the Sportz dashboard.

## 🎨 Solid Modern Design System
We are using a **High-Contrast Sport** aesthetic. 

### Colors
- **Main BG**: `#0f172a` (Deep Slate)
- **Cards/Surfaces**: `#1e293b` (Solid Charcoal)
- **Accent**: `#3b82f6` (Electric Blue)
- **Live/Success**: `#10b981` (Emerald)
- **Warning/Error**: `#ef4444` (Sport Red)

### Layout & Borders
- **No Glassmorphism**: All cards must be solid colors.
- **Borders**: Sharp `1px` borders using `rgba(255, 255, 255, 0.05)` for definition.
- **Shadows**: Large, subtle shadows (`box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)`) to create depth.

---

## 🏗️ Component Architecture

### 1. MatchCard.jsx (Dashboard)
- **Data Model**: Follows `matches` schema (id, sport, homeTeam, awayTeam, status, scores).
- **Interaction**: Hover state with slight scale and border-color change.

### 2. LiveScoreboard.jsx (Detail View Header)
- Focuses on the real-time score total.
- Uses bold typography (e.g., `Montserrat`) for an athletic look.

### 3. CommentaryTimeline.jsx
- **Data Model**: Follows `commentary` schema (minute, message, actor).
- **Animation**: Uses `AnimatePresence` for smooth "slide-in" animations from the top.

---

## ⚡ Integration Details

### WebSocket Protocol (`useSportzWS.js`)
You must handle the subscription lifecycle to stay in sync with the backend:
```javascript
// On Component Mount (or Match Change)
ws.send(JSON.stringify({ type: "subscribe", matchId: currentMatchId }));

// On Message Event
socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === "commentary") {
    // Update local state with new live update
    setCommentary(prev => [msg.data, ...prev]);
  }
};
```

### API Mapping
- `GET /matches` -> Returns `{ data: [...] }` list of all matches.
- `GET /matches/:id/commentary` -> Returns `{ data: [...] }` history for specific match.

---

## 💡 Best Practices
- **Optimistic Updates**: Update the UI immediately if you implement manual score pushes.
- **Auto-Reconnect**: Implement an exponential backoff strategy for the WebSocket connection.
- **Animation**: Use Framer Motion `layout` prop on cards for smooth reshuffling when new matches are added.
