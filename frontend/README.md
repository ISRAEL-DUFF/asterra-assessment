# AsterrA Frontend

This is a minimal React frontend for the AsterrA app. It talks to the backend at http://localhost:3001 by default.

## Setup

1. cd frontend
2. npm install
3. npm run dev

Open the site at the address Vite prints (usually http://localhost:5173).

## Features

- Add new users
- Add hobbies for users (select user from dropdown)
- Index table showing users and their hobbies
- Delete button per row (deletes hobby if present; deletes user if hobby is empty)

If your backend runs on a different host/port, update the `BASE` constant in `src/api.js`.
