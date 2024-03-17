## Pages

### Create Page

- **URL:** `/api/pages`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `title` (string): The title of the page.
  - `content` (string): The content of the page.
  - `spaceId` (string): The ID of the space associated with the page.
- **Response:**
  - `201 Created`: The page was successfully created. Returns the created page object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the page.

### Revert Page to Previous Version

- **URL:** `/api/pages/:id/revert`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the page.
- **Request Body:**
  - `version` (number): The version number to revert to.
- **Response:**
  - `200 OK`: The page was successfully reverted to the specified version. Returns the reverted page object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to revert the page.
  - `404 Not Found`: The page or the specified version was not found.
  - `500 Internal Server Error`: An error occurred while reverting the page.

### Get Page Comments

- **URL:** `/api/pages/:id/comments`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the page.
- **Response:**
  - `200 OK`: Returns an array of comments for the page.
  - `500 Internal Server Error`: An error occurred while fetching the page comments.

### Create Page Comment

- **URL:** `/api/pages/:id/comments`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the page.
- **Request Body:**
  - `content` (string): The content of the comment.
  - `parentId` (string, optional): The ID of the parent comment if it's a nested comment.
- **Response:**
  - `201 Created`: The comment was successfully created. Returns the created comment object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the page comment.

### Get Page Versions

- **URL:** `/api/pages/:id/versions`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the page.
- **Response:**
  - `200 OK`: Returns an array of versions for the page.
  - `500 Internal Server Error`: An error occurred while fetching the page versions.

### Get Page by ID

- **URL:** `/api/pages/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the page.
- **Response:**
  - `200 OK`: Returns the page object.
  - `404 Not Found`: The page was not found.
  - `500 Internal Server Error`: An error occurred while fetching the page.

### Update Page

- **URL:** `/api/pages/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the page.
- **Request Body:**
  - `title` (string): The updated title of the page.
  - `content` (string): The updated content of the page.
  - `settings` (object, optional): The updated settings for the page.
- **Response:**
  - `200 OK`: The page was successfully updated. Returns the updated page object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to update the page.
  - `404 Not Found`: The page was not found.
  - `500 Internal Server Error`: An error occurred while updating the page.

### Delete Page

- **URL:** `/api/pages/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the page.
- **Response:**
  - `200 OK`: The page was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to delete the page.
  - `404 Not Found`: The page was not found.
  - `500 Internal Server Error`: An error occurred while deleting the page.
