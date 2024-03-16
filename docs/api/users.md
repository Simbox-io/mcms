## User

### Get User Data

- **URL:** `/api/user`
- **Method:** `GET`
- **Authentication:** Required
- **Response:**
  - `200 OK`: Returns the user data object.
  - `401 Unauthorized`: The user is not authenticated.
  - `404 Not Found`: The user was not found.
  - `500 Internal Server Error`: An error occurred while fetching the user data.

### Update User

- **URL:** `/api/user`
- **Method:** `PUT`
- **Authentication:** Required
- **Request Body:**
  - `username` (string): The updated username of the user.
  - `firstName` (string): The updated first name of the user.
  - `lastName` (string): The updated last name of the user.
  - `email` (string): The updated email of the user.
  - `bio` (string): The updated bio of the user.
  - `avatar` (string): The updated avatar URL of the user.
- **Response:**
  - `200 OK`: The user was successfully updated. Returns the updated user object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while updating the user.


## Users

### Get Users

- **URL:** `/api/users`
- **Method:** `GET`
- **Authentication:** Required
- **Response:**
  - `200 OK`: Returns an array of users.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the users.

### Get User Followers

- **URL:** `/api/users/:id/followers`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of followers for the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user followers.

### Get User Settings

- **URL:** `/api/users/:id/settings`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns the user settings object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user settings.

### Update User Settings

- **URL:** `/api/users/:id/settings`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Request Body:**
  - `notificationPreferences` (object, optional): The updated notification preferences.
  - `privacySettings` (object, optional): The updated privacy settings.
  - `languagePreference` (string, optional): The updated language preference.
  - `themePreference` (string, optional): The updated theme preference.
  - `emailVerified` (boolean, optional): The updated email verification status.
  - `passwordResetSettings` (object, optional): The updated password reset settings.
  - `accountDeletionSettings` (object, optional): The updated account deletion settings.
- **Response:**
  - `200 OK`: The user settings were successfully updated. Returns the updated user settings object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while updating the user settings.

### Get User Comments

- **URL:** `/api/users/:id/comments`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of comments made by the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user comments.

### Get User Posts

- **URL:** `/api/users/:id/posts`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of posts created by the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user posts.

### Get User Collaborators

- **URL:** `/api/users/:id/collaborators`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of collaborators for the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user collaborators.

### Follow User

- **URL:** `/api/users/:id/follow`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user to follow.
- **Response:**
  - `200 OK`: The user was successfully followed.
  - `400 Bad Request`: The user cannot follow themselves.
  - `401 Unauthorized`: The user is not authenticated.
  - `404 Not Found`: The user to follow was not found.
  - `500 Internal Server Error`: An error occurred while following the user.

### Get User Projects

- **URL:** `/api/users/:id/projects`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of projects associated with the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user projects.

### Get User Reactions

- **URL:** `/api/users/:id/reactions`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an object containing the user's comment reactions and file reactions.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user reactions.

### Get User Spaces

- **URL:** `/api/users/:id/spaces`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of spaces associated with the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user spaces.

### Unfollow User

- **URL:** `/api/users/:id/unfollow`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user to unfollow.
- **Response:**
  - `200 OK`: The user was successfully unfollowed.
  - `401 Unauthorized`: The user is not authenticated.
  - `404 Not Found`: The user to unfollow was not found.
  - `500 Internal Server Error`: An error occurred while unfollowing the user.

### Get User Bookmarks

- **URL:** `/api/users/:id/bookmarks`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of bookmarks associated with the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user bookmarks.

### Get User Profile

- **URL:** `/api/users/:id/profile`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns the user profile object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user profile.

### Update User Profile

- **URL:** `/api/users/:id/profile`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Request Body:**
  - `bio` (string, optional): The updated user bio.
  - `location` (string, optional): The updated user location.
  - `website` (string, optional): The updated user website.
  - `socialLinks` (array, optional): The updated user social links.
  - `skills` (array, optional): The updated user skills.
- **Response:**
  - `200 OK`: The user profile was successfully updated. Returns the updated user profile object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while updating the user profile.

### Get User by ID

- **URL:** `/api/users/:id`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns the user object.
  - `401 Unauthorized`: The user is not authenticated.
  - `404 Not Found`: The user was not found.
  - `500 Internal Server Error`: An error occurred while fetching the user.

### Get User Tutorials

- **URL:** `/api/users/:id/tutorials`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of tutorials associated with the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user tutorials.

### Get User Activities

- **URL:** `/api/users/:id/activities`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of activities associated with the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user activities.

### Get User Following

- **URL:** `/api/users/:id/following`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of users that the user is following.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user following.

### Get User Notifications

- **URL:** `/api/users/:id/notifications`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns an array of notifications associated with the user.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the user notifications.

### Update User Notifications

- **URL:** `/api/users/:id/notifications`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the user.
- **Request Body:**
  - `notificationIds` (array): The IDs of the notifications to update.
  - `isRead` (boolean): The updated read status of the notifications.
- **Response:**
  - `200 OK`: The user notifications were successfully updated.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while updating the user notifications.
