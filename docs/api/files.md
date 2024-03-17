## Files

### Get Files

- **URL:** `/api/files`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination. Default is 1.
- **Response:**
  - `200 OK`: Returns an object containing the paginated files and the total number of pages.
  - `500 Internal Server Error`: An error occurred while fetching the files.

### Upload File

- **URL:** `/api/files`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `file` (file): The file to upload.
  - `name` (string): The name of the file.
  - `description` (string): The description of the file.
  - `isPublic` (boolean): Indicates whether the file is public or not.
  - `projectId` (string, optional): The ID of the project associated with the file.
  - `parentId` (string, optional): The ID of the parent file if it's a nested file.
  - `tags` (array of strings, optional): The tags associated with the file.
  - `settings` (object, optional): The settings for the file.
- **Response:**
  - `201 Created`: The file was successfully uploaded. Returns the created file object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while uploading the file.

### Get File Comments

- **URL:** `/api/files/:id/comments`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the file.
- **Response:**
  - `200 OK`: Returns an array of comments for the file.
  - `500 Internal Server Error`: An error occurred while fetching the file comments.

### Create File Comment

- **URL:** `/api/files/:id/comments`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the file.
- **Request Body:**
  - `content` (string): The content of the comment.
  - `parentId` (string, optional): The ID of the parent comment if it's a nested comment.
- **Response:**
  - `201 Created`: The comment was successfully created. Returns the created comment object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the file comment.

### Get File Reactions

- **URL:** `/api/files/:id/reactions`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the file.
- **Response:**
  - `200 OK`: Returns an array of reactions for the file.
  - `500 Internal Server Error`: An error occurred while fetching the file reactions.

### Add or Remove File Reaction

- **URL:** `/api/files/:id/reactions`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the file.
- **Request Body:**
  - `type` (string): The type of the reaction.
- **Response:**
  - `201 Created`: The reaction was successfully added. Returns the created reaction object.
  - `200 OK`: The reaction was successfully removed.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating or removing the file reaction.

### Get File Tags

- **URL:** `/api/files/:id/tags`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the file.
- **Response:**
  - `200 OK`: Returns an array of tags associated with the file.
  - `500 Internal Server Error`: An error occurred while fetching the file tags.

### Add File Tags

- **URL:** `/api/files/:id/tags`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the file.
- **Request Body:**
  - `tags` (array of strings): The tags to add to the file.
- **Response:**
  - `200 OK`: The tags were successfully added to the file. Returns the updated file object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to add tags to the file.
  - `404 Not Found`: The file was not found.
  - `500 Internal Server Error`: An error occurred while adding the file tags.

### Get File by ID

- **URL:** `/api/files/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the file.
- **Response:**
  - `200 OK`: Returns the file object.
  - `404 Not Found`: The file was not found.
  - `500 Internal Server Error`: An error occurred while fetching the file.

### Update File

- **URL:** `/api/files/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the file.
- **Request Body:**
  - `name` (string): The updated name of the file.
  - `description` (string): The updated description of the file.
  - `isPublic` (boolean): The updated public status of the file.
  - `projectId` (string, optional): The updated ID of the project associated with the file.
  - `parentId` (string, optional): The updated ID of the parent file if it's a nested file.
  - `tags` (array of strings, optional): The updated tags associated with the file.
  - `settings` (object, optional): The updated settings for the file.
- **Response:**
  - `200 OK`: The file was successfully updated. Returns the updated file object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to update the file.
  - `404 Not Found`: The file was not found.
  - `500 Internal Server Error`: An error occurred while updating the file.

### Delete File

- **URL:** `/api/files/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the file.
- **Response:**
  - `200 OK`: The file was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to delete the file.
  - `404 Not Found`: The file was not found.
  - `500 Internal Server Error`: An error occurred while deleting the file.
