# Quick Note Application

A small full-stack note-taking application built with Node.js, Express, HTML, CSS and JavaScript.

## Features
- Create notes
- View saved notes
- Edit notes
- Delete notes
- Persistent JSON storage through an Express API
- Responsive interface

## Run locally

1. Install Node.js.
2. Open a terminal in this project folder.
3. Run:
   `npm install`
4. Start:
   `npm start`
5. Open:
   `http://localhost:3000`

## API
- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
