## Onboarding

### Update Onboarding Preferences

- **URL:** `/api/onboarding/preferences`
- **Method:** `PUT`
- **Authentication:** Required
- **Request Body:**
  - `receiveNotifications` (boolean): Indicates whether the user wants to receive notifications.
  - `receiveUpdates` (boolean): Indicates whether the user wants to receive updates.
  - `languagePreference` (string): The user's preferred language.
  - `themePreference` (string): The user's preferred theme.
- **Response:**
  - `200 OK`: The onboarding preferences were successfully updated. Returns the updated user object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while updating the onboarding preferences.

### Follow During Onboarding

- **URL:** `/api/onboarding/follow`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `type` (string): The type of entity to follow ('space' or 'user').
  - `id` (string): The ID of the entity to follow.
- **Response:**
  - `200 OK`: The entity was successfully followed.
  - `400 Bad Request`: The specified follow type is invalid.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while following the entity.

### Update Onboarding Profile

- **URL:** `/api/onboarding/profile`
- **Method:** `PUT`
- **Authentication:** Required
- **Request Body:**
  - `username` (string): The updated username of the user.
  - `bio` (string): The updated bio of the user.
  - `firstName` (string): The updated first name of the user.
  - `lastName` (string): The updated last name of the user.
  - `avatar` (string): The updated avatar URL of the user.
- **Response:**
  - `200 OK`: The onboarding profile was successfully updated. Returns the updated user object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while updating the onboarding profile.

### Get Onboarding Suggestions

- **URL:** `/api/onboarding/suggestions`
- **Method:** `GET`
- **Authentication:** Required
- **Response:**
  - `200 OK`: Returns an object containing suggested spaces and users for the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the onboarding suggestions.