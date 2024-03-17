## Authentication

### Register User

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Request Body:**
  - `username` (string): The username of the user.
  - `email` (string): The email of the user.
  - `password` (string): The password of the user.
  - `firstName` (string): The first name of the user.
  - `lastName` (string): The last name of the user.
- **Response:**
  - `201 Created`: The user was successfully registered.
  - `400 Bad Request`: The email already exists.
  - `500 Internal Server Error`: An error occurred during registration.

### Authenticate User

- **URL:** `/api/auth/[...nextauth]`
- **Method:** `GET` or `POST`
- **Authentication:** Required
- **Response:**
  - `200 OK`: The user is authenticated. Returns the session object.
  - `401 Unauthorized`: The user is not authenticated.