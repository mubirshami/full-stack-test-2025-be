# ChatGPT Clone – Frontend

Next.js frontend application for the ChatGPT Clone, built to work with the Express + MongoDB backend API.

This frontend handles:

* User authentication (Email/Password & Google OAuth)
* Chat interface
* Message sending and polling for LLM responses

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** TailwindCSS
* **State Management:** React Hooks / Context
* **API Communication:** REST (Axios / Fetch)

---

## Prerequisites

* Node.js (v14 or higher)
* npm or yarn
* Backend API running locally

---

## Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> This must match the backend server URL.

4. Start the development server:

```bash
npm run dev
```

5. Open in browser:
   👉 [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

* `npm run dev` – Start development server
* `npm run build` – Build for production
* `npm run start` – Start production server
* `npm run lint` – Run ESLint

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── login/          # Login page
│   │   ├── register/       # Register page
│   │   ├── chat/           # Chat interface
│   │   └── ...
│   ├── components/        # Reusable UI components
│   ├── services/          # API calls (auth, chats, messages)
│   ├── context/           # Auth / App context
│   └── utils/             # Helpers & constants
├── public/                # Static assets
└── package.json
```

---

## Pages

* `/login` – User login
* `/register` – User registration
* `/chat` – Chat interface
* `/` – Redirects to `/login`

---

## API Integration

The frontend communicates with the backend via:

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/google`

### Chats

* `GET /api/chats`
* `POST /api/chats`
* `GET /api/chats/:chatId`
* `PUT /api/chats/:chatId`
* `DELETE /api/chats/:chatId`

### Messages

* `GET /api/chats/:chatId/messages`
* `POST /api/chats/:chatId/messages`

After sending a message, the frontend **polls**:

```http
GET /api/chats/:chatId/messages
```

to retrieve the simulated LLM response.

---

## Authentication

All protected routes require a JWT token.

The frontend stores the token (e.g. in `localStorage`) and sends it in headers:

```http
Authorization: Bearer <your-token>
```

---

## Troubleshooting

### Tailwind / Module Errors

If you see module resolution issues:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Issues

If port 3000 is busy:

```bash
npm run dev -- -p 3001
```

---

## Development Notes

* Backend must be running on `http://localhost:3000`
* Frontend reads API base URL from:

```
NEXT_PUBLIC_API_URL
```

---