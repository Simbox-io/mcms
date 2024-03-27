## Admin

### Update Admin Settings

- **URL:** `/api/admin/settings`
- **Method:** `PUT`
- **Authentication:** Required (Admin)
- **Request Body:**
  - `siteTitle` (string): The updated site title.
  - `siteDescription` (string): The updated site description.
  - `logo` (string): The updated logo URL.
  - `accentColor` (string): The updated accent color.
  - `fileStorageProvider` (string): The updated file storage provider.
- **Response:**
  - `200 OK`: The admin settings were successfully updated. Returns the updated admin settings object.
  - `401 Unauthorized`: The user is not authenticated or not an admin.
  - `500 Internal Server Error`: An error occurred while updating the admin settings.

### Get Recent Posts

- **URL:** `/api/admin/posts`
- **Method:** `GET`
- **Authentication:** Required (Admin)
- **Response:**
  - `200 OK`: Returns an array of recent posts.
  - `401 Unauthorized`: The user is not authenticated or not an admin.
  - `500 Internal Server Error`: An error occurred while fetching the recent posts.

### Create Post (Admin)

- **URL:** `/api/admin/posts`
- **Method:** `POST`
- **Authentication:** Required (Admin)
- **Request Body:**
  - `title` (string): The title of the post.
  - `content` (string): The content of the post.
  - `authorId` (string): The ID of the author for the post.
  - `tags` (array of strings): The tags associated with the post.
  - `settings` (object, optional): The settings for the post.
- **Response:**
  - `201 Created`: The post was successfully created. Returns the created post object.
  - `401 Unauthorized`: The user is not authenticated or not an admin.
  - `500 Internal Server Error`: An error occurred while creating the post.

### Get User Details

- **URL:** `/api/admin/users/:id`
- **Method:** `GET`
- **Authentication:** Required (Admin)
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: Returns the user details object.
  - `401 Unauthorized`: The user is not authenticated or not an admin.
  - `404 Not Found`: The user was not found.
  - `500 Internal Server Error`: An error occurred while fetching the user details.

### Update User (Admin)

- **URL:** `/api/admin/users/:id`
- **Method:** `PUT`
- **Authentication:** Required (Admin)
- **Parameters:**
  - `id` (string): The ID of the user.
- **Request Body:**
  - `username` (string): The updated username of the user.
  - `firstName` (string): The updated first name of the user.
  - `lastName` (string): The updated last name of the user.
  - `email` (string): The updated email of the user.
  - `bio` (string): The updated bio of the user.
  - `avatar` (string): The updated avatar URL of the user.
  - `role` (string): The updated role of the user.
- **Response:**
  - `200 OK`: The user was successfully updated. Returns the updated user object.
  - `401 Unauthorized`: The user is not authenticated or not an admin.
  - `500 Internal Server Error`: An error occurred while updating the user.

### Delete User (Admin)

- **URL:** `/api/admin/users/:id`
- **Method:** `DELETE`
- **Authentication:** Required (Admin)
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response:**
  - `200 OK`: The user was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated or not an admin.
  - `500 Internal Server Error`: An error occurred while deleting the user.

### Get Analytics

- **URL:** `/api/admin/analytics`
- **Method:** `GET`
- **Authentication:** Required (Admin)
- **Response:**
  - `200 OK`: Returns an object containing analytics data.
  - `401 Unauthorized`: The user is not authenticated or not an admin.
  - `500 Internal Server Error`: An error occurred while fetching the analytics.
