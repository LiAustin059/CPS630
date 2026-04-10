# EventHub

## Overview

EventHub is a modern, real-time web application designed to connect communities through organized events. Its core purpose is to serve as a premium platform where users can discover, join, and discuss social gatherings in their area. Designed with a highly polished "cinematic dark mode" aesthetic, EventHub provides a seamless and visually stunning user experience.

### How It Works
Users can browse a public catalogue of events hosted by the community. By creating an account and authenticating, users unlock the ability to manage their own events and participate in others. Every event has a dedicated live discussion board (chat) that attendees can use to coordinate in real-time.

### Key Features
- **Create Event:** Authenticated users can host new events, specifying the name, location, and date via an intuitive, glassmorphic modal.
- **Delete Event:** Event organizers retain full control and can delete their events, removing them natively from the platform.
- **Event Chat:** A real-time, persistent WebSocket discussion board for attendees to communicate within the context of a specific event.
- **Quick Sharing:** Users can quickly copy the Event ID or generate a deep-link URL (via the Share button) to distribute event details directly to friends for instant access.
- **Profile Dashboard:** A personalized "Bento Grid" dashboard tracking organized vs. joined events.
- **Responsive Navigation:** Interactive cards and a dynamic ambient background that reacts to the user's cursor.

---

## Architecture

EventHub is built on the **MERN** stack (MongoDB, Express, React, Node.js) with real-time bidirectional event-based communication.

### Key Architectural Decisions
1. **Real-time WebSockets:** We integrated **Socket.IO** alongside standard REST endpoints to handle the heavy, persistent load of the Event Chat system without exhausting standard HTTP limits. 
2. **Context-Driven State Management:** Global authentication and session persistence are securely managed entirely via React's Context API (`AuthContext`), binding securely to `localStorage` and JWTs.
3. **Feature-Driven Component Structure:** Code is modularized into features as best as possible (e.g., `components/events/`, `components/chat/`, `components/layout/`) to strictly enforce separation of concerns.

### API Endpoints

#### Authentication Routes
- `POST /api/auth/register` - Creates a new user and returns a signed JWT.
- `POST /api/auth/login` - Authenticates an existing user and returns a signed JWT.
- `GET /api/auth/me` - Validates the JWT and returns the current user's profile and populated event metrics.

#### Event Routes
- `GET /api/events` - Retrieves a populated catalogue of all public events.
- `POST /api/events` - Creates a new event linked to the authenticated user schema.
- `GET /api/events/:id` - Retrieves detailed metadata for a specific event.
- `PUT /api/events/:id` - Updates an existing event (Restricted to the Event Owner).
- `DELETE /api/events/:id` - Deletes an event completely (Restricted to the Event Owner).
- `POST /api/events/:id/join` - Appends the authenticated user to the Event's attendee array.

#### WebSocket Events (Socket.IO)
- `joinEventChat` (Input: `eventId`) - Subscribes the user's socket to the specific event room and retrieves history.
- `sendChatMessage` (Input: `eventId`, `text`) - Broadcasts a timestamped message Payload to the room.
- `chatMessage` (Output) - Emits formatted incoming chat packets to active room listeners.

---

## Documentation

### How to Run the Project

1. **Clone the Repository**
   Make sure you are in the project root: `CPS630/`.

2. **Start the Backend Server**
   Open a new terminal window and navigate to the `server/` directory:
   ```bash
   cd server
   npm install
   ```
   Start the Node Express server:
   ```bash
   npm run start
   ```

3. **Start the Frontend Client**
   Open a second terminal window and navigate to the `client/` directory:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### How to Use the Application
1. **Explore:** Open your browser to `http://localhost:5173`. The landing page automatically fetches and lists all active events. You can utilize the search bar and date filter without logging in.
2. **Authentication:** Click **Sign Up** in the navigation bar to create an account. Passwords are securely hashed.
3. **Hub Activity:** Once authenticated, click **Create Event** in the header. Fill out the details to organize an event. It will instantly appear on the global board.
4. **Participation:** Browse to any event you did not create. Click the card to view its deeper details (`/events/:id`). From the action center, click **Join Event**.
5. **Real-time Chat:** Once joined, the interface will offer to **Open Event Chat**. Clicking this bridges your session to the WebSocket server, allowing you to instantly message other attendees on that screen.
6. **Profile Data:** Simply click your Avatar in the top right to visit your specific management dashboard, which breaks down your organized vs. participating lists!