# MyContacts Backend API

A simple REST API for user authentication and contact management, built with Node.js, Express, MongoDB, and JWT.

## Features

- User registration and login
- JWT-based authentication
- Protected contact CRUD endpoints
- Per-user contact access (users can only access their own contacts)

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Token (`jsonwebtoken`)
- `bcrypt` for password hashing

## Project Setup

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
npm install
```

### 2) Create environment variables

Create a `.env` file in the project root:

```env
PORT=5000
CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=your_super_secret_key
```

## Run the Server

- Development (with nodemon):

```bash
npm run dev
```

- Production:

```bash
npm start
```

The API runs on `http://localhost:5000` by default.

## API Base URL

`http://localhost:5000/api/v1`

## Authentication

After login, use the returned token in the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

## Endpoints

### Health Check

- `GET /`

Response:

```json
{ "message": "API is running" }
```

### User Routes

- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `GET /api/v1/users/current` (protected)

#### Register

`POST /api/v1/users/register`

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Login

`POST /api/v1/users/login`

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Success response:

```json
{
  "accessToken": "<jwt_token>"
}
```

### Contact Routes (Protected)

- `GET /api/v1/contacts`
- `POST /api/v1/contacts`
- `GET /api/v1/contacts/:id`
- `PUT /api/v1/contacts/:id`
- `DELETE /api/v1/contacts/:id`

#### Create Contact

`POST /api/v1/contacts`

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "phone": "1234567890"
}
```

## Notes

- `node_modules` should not be committed. Add it to `.gitignore` if needed.
- Make sure MongoDB is reachable via `CONNECTION_STRING` before starting the server.
