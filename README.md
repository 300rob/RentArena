# RentArena
A full-stack web app for renting sports facilities like football pitches, basketball courts, and tennis courts. Users can browse and book facilities, chat in real-time, and owners can manage their listings.

---

## Tech Stack
| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, TailwindCSS, Zustand |
| Backend | Node.js, Express.js, MongoDB, Socket.io, Cloudinary |

---

## Key Features
- Role-based access (Admin, Owner, User)
- Facility browsing, searching, and booking
- Real-time messaging between users
- Owner dashboard for managing facilities
- Secure authentication (JWT & bcrypt)

---

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB installed and running

---

## Backend Setup

```bash
cd back-end
npm install
```

Update your `back-end/.env` file with:

| Variable | Description |
|----------|-------------|
| `MONGO_URL` | Your MongoDB connection string |
| `JWT_SECRET` | A secure random string |
| `FRONTEND_URL` | Usually `http://localhost:5173` |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |

> Also update your credentials in `nodemailerConfig.js` (`user`, `pass`)

```bash
npm run dev
```
> Runs on `http://localhost:5000`

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
> Runs on `http://localhost:5173`

Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```