# healthcare-clinic-mobile-system

Full stack clinic system (React Native + Node/Express + MongoDB). The **React Native (Expo) app** lives entirely in the **`frontend/`** folder. The **`backend/`** folder is unchanged.

## Frontend (Expo)

All commands below are run from **`frontend/`** (the mobile app root).

1. `cd frontend`
2. `npm install`
3. `npm start` (or `npx expo start`)
4. Open in an emulator or the Expo Go app on a device.

### Connect to your Express API

1. Edit `frontend/src/constants/apiConfig.js` and set `BASE_URL` (no trailing slash).
2. Typical examples:
   - Android emulator → `http://10.0.2.2:5000`
   - iOS simulator → `http://localhost:5000`
   - Physical phone → `http://<your-pc-lan-ip>:5000`
3. Match JSON shapes where needed (see `frontend/src/services/authService.js` and `frontend/src/services/userService.js`).
4. Android cleartext HTTP for local dev is set in `frontend/app.json`.

### Auth endpoints expected

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `PUT /api/users/change-password`
- `GET /api/users`
- `GET /api/users/:id`

Optional: `POST /api/auth/forgot-password` (handled gracefully if missing).
