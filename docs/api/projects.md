## Projects

### Get Projects

- **URL:** `/api/projects`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination. Default is 1.
- **Response:**
  - `200 OK`: Returns an object containing the paginated projects and the total number of pages.
  - `500 Internal Server Error`: An error occurred while fetching the projects.

### Create Project

- **URL:** `/api/projects`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `name` (string): The name of the project.
  - `description` (string): The description of the project.
  - `collaborators` (array of strings): The IDs of the collaborators for the project.
  - `tags` (array of strings): The tags associated with the project.
  - `settings` (object, optional): The settings for the project.
- **Response:**
  - `201 Created`: The project was successfully created. Returns the created project object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the project.

### Get Project Comments

- **URL:** `/api/projects/:id/comments`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the project.
- **Response:**
  - `200 OK`: Returns an array of comments for the project.
  - `500 Internal Server Error`: An error occurred while fetching the project comments.

### Create Project Comment

- **URL:** `/api/projects/:id/comments`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the project.
- **Request Body:**
  - `content` (string): The content of the comment.
  - `parentId` (string, optional): The ID of the parent comment if it's a nested comment.
- **Response:**
  - `201 Created`: The comment was successfully created. Returns the created comment object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the project comment.

### Get Project Collaborators

- **URL:** `/api/projects/:id/collaborators`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the project.
- **Response:**
  - `200 OK`: Returns an array of collaborators for the project.
  - `500 Internal Server Error`: An error occurred while fetching the project collaborators.

### Add Project Collaborator

- **URL:** `/api/projects/:id/collaborators`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the project.
- **Request Body:**
  - `collaboratorId` (string): The ID of the collaborator to add.
- **Response:**
  - `200 OK`: The collaborator was successfully added to the project.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to add collaborators to the project.
  - `404 Not Found`: The project was not found.
  - `500 Internal Server Error`: An error occurred while adding the project collaborator.

### Remove Project Collaborator

- **URL:** `/api/projects/:id/collaborators`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the project.
- **Request Body:**
  - `collaboratorId` (string): The ID of the collaborator to remove.
- **Response:**
  - `200 OK`: The collaborator was successfully removed from the project.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to remove collaborators from the project.
  - `404 Not Found`: The project was not found.
  - `500 Internal Server Error`: An error occurred while removing the project collaborator.

### Get Project Files

- **URL:** `/api/projects/:id/files`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the project.
- **Response:**
  - `200 OK`: Returns an array of files for the project.
  - `500 Internal Server Error`: An error occurred while fetching the project files.

### Create Project File

- **URL:** `/api/projects/:id/files`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the project.
- **Request Body:**
  - `name` (string): The name of the file.
  - `description` (string): The description of the file.
  - `isPublic` (boolean): Indicates whether the file is public or not.
  - `parentId` (string, optional): The ID of the parent file if it's a nested file.
  - `tags` (array of strings, optional): The tags associated with the file.
  - `settings` (object, optional): The settings for the file.
- **Response:**
  - `201 Created`: The file was successfully created. Returns the created file object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to create files in the project.
  - `404 Not Found`: The project was not found.
  - `500 Internal Server Error`: An error occurred while creating the project file.

### Get Project Tags

- **URL:** `/api/projects/:id/tags`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the project.
- **Response:**
  - `200 OK`: Returns an array of tags associated with the project.
  - `500 Internal Server Error`: An error occurred while fetching the project tags.

### Add Project Tags

- **URL:** `/api/projects/:id/tags`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the project.
- **Request Body:**
  - `tags` (array of strings): The tags to add to the project.
- **Response:**
  - `200 OK`: The tags were successfully added to the project. Returns the updated project object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to add tags to the project.
  - `404 Not Found`: The project was not found.
  - `500 Internal Server Error`: An error occurred while adding the project tags.

### Get Project by ID

- **URL:** `/api/projects/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the project.
- **Response:**
  - `200 OK`: Returns the project object.
  - `404 Not Found`: The project was not found.
  - `500 Internal Server Error`: An error occurred while fetching the project.

### Update Project

- **URL:** `/api/projects/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the project.
- **Request Body:**
  - `name` (string): The updated name of the project.
  - `description` (string): The updated description of the project.
  - `collaborators` (array of strings): The updated IDs of the collaborators for the project.
  - `tags` (array of strings): The updated tags associated with the project.
  - `settings` (object, optional): The updated settings for the project.
- **Response:**
  - `200 OK`: The project was successfully updated. Returns the updated project object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to update the project.
  - `404 Not Found`: The project was not found.
  - `500 Internal Server Error`: An error occurred while updating the project.

### Delete Project

- **URL:** `/api/projects/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the project.
- **Response:**
  - `200 OK`: The project was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to delete the project.
  - `404 Not Found`: The project was not found.
  - `500 Internal Server Error`: An error occurred while deleting the project.

## Reactions