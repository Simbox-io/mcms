## Spaces

### Get Spaces

- **URL:** `/api/spaces`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination. Default is 1.
  - `search` (string, optional): The search query for filtering spaces.
- **Response:**
  - `200 OK`: Returns an object containing the paginated spaces and the total number of pages.
  - `500 Internal Server Error`: An error occurred while fetching the spaces.

### Create Space

- **URL:** `/api/spaces`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `name` (string): The name of the space.
  - `description` (string): The description of the space.
  - `projectId` (string, optional): The ID of the project associated with the space.
  - `collaborators` (array of strings): The IDs of the collaborators for the space.
  - `settings` (object, optional): The settings for the space.
- **Response:**
  - `201 Created`: The space was successfully created. Returns the created space object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the space.

### Get Recently Viewed Spaces

- **URL:** `/api/spaces/recently-viewed`
- **Method:** `GET`
- **Authentication:** Required
- **Response:**
  - `200 OK`: Returns an array of recently viewed spaces.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the recently viewed spaces.

### Record Space View

- **URL:** `/api/spaces/recently-viewed`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `spaceId` (string): The ID of the space to record the view for.
- **Response:**
  - `200 OK`: The space view was successfully recorded.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while recording the space view.

### Get Space Collaborators

- **URL:** `/api/spaces/:id/collaborators`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the space.
- **Response:**
  - `200 OK`: Returns an array of collaborators for the space.
  - `500 Internal Server Error`: An error occurred while fetching the space collaborators.

### Add Space Collaborator

- **URL:** `/api/spaces/:id/collaborators`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the space.
- **Request Body:**
  - `collaboratorId` (string): The ID of the collaborator to add.
- **Response:**
  - `200 OK`: The collaborator was successfully added to the space.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to add collaborators to the space.
  - `404 Not Found`: The space was not found.
  - `500 Internal Server Error`: An error occurred while adding the space collaborator.

### Remove Space Collaborator

- **URL:** `/api/spaces/:id/collaborators`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the space.
- **Request Body:**
  - `collaboratorId` (string): The ID of the collaborator to remove.
- **Response:**
  - `200 OK`: The collaborator was successfully removed from the space.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to remove collaborators from the space.
  - `404 Not Found`: The space was not found.
  - `500 Internal Server Error`: An error occurred while removing the space collaborator.

### Get Space by ID

- **URL:** `/api/spaces/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the space.
- **Response:**
  - `200 OK`: Returns the space object.
  - `404 Not Found`: The space was not found.
  - `500 Internal Server Error`: An error occurred while fetching the space.

### Update Space

- **URL:** `/api/spaces/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the space.
- **Request Body:**
  - `name` (string): The updated name of the space.
  - `description` (string): The updated description of the space.
  - `projectId` (string, optional): The updated ID of the project associated with the space.
  - `collaborators` (array of strings): The updated IDs of the collaborators for the space.
  - `settings` (object, optional): The updated settings for the space.
- **Response:**
  - `200 OK`: The space was successfully updated. Returns the updated space object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to update the space.
  - `404 Not Found`: The space was not found.
  - `500 Internal Server Error`: An error occurred while updating the space.

### Delete Space

- **URL:** `/api/spaces/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the space.
- **Response:**
  - `200 OK`: The space was successfully deleted.
  - `401 Unauthorized`: The useris not authenticated.
  - `403 Forbidden`: The user is not authorized to delete the space.
  - `404 Not Found`: The space was not found.
  - `500 Internal Server Error`: An error occurred while deleting the space.

### Export Space

- **URL:** `/api/spaces/:id/export`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the space.
- **Query Parameters:**
  - `format` (string): The format for exporting the space (e.g., 'json', 'markdown', 'html').
- **Response:**
  - `200 OK`: Returns the exported space data in the specified format.
  - `400 Bad Request`: The specified export format is invalid.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to export the space.
  - `404 Not Found`: The space was not found.
  - `500 Internal Server Error`: An error occurred while exporting the space.

### Import Space

- **URL:** `/api/spaces/:id/import`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the space.
- **Request Body:**
  - `format` (string): The format of the imported space data (e.g., 'json', 'markdown', 'html').
  - `data` (string): The imported space data.
- **Response:**
  - `200 OK`: The space was successfully imported. Returns the updated space object.
  - `400 Bad Request`: The specified import format is invalid.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to import the space.
  - `404 Not Found`: The space was not found.
  - `500 Internal Server Error`: An error occurred while importing the space.

### Get Space Views

- **URL:** `/api/spaces/:id/views`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the space.
- **Response:**
  - `200 OK`: Returns an array of views for the space.
  - `500 Internal Server Error`: An error occurred while fetching the space views.

### Record Space View

- **URL:** `/api/spaces/:id/views`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the space.
- **Response:**
  - `200 OK`: The space view was successfully recorded.
  - `401 Unauthorized`: The user is not authenticated.
  - `404 Not Found`: The space was not found.
  - `500 Internal Server Error`: An error occurred while recording the space view.

### Get Space Pages

- **URL:** `/api/spaces/:id/pages`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the space.
- **Response:**
  - `200 OK`: Returns an array of pages for the space.
  - `500 Internal Server Error`: An error occurred while fetching the space pages.

### Create Space Page

- **URL:** `/api/spaces/:id/pages`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the space.
- **Request Body:**
  - `title` (string): The title of the page.
  - `content` (string): The content of the page.
  - `settings` (object, optional): The settings for the page.
- **Response:**
  - `201 Created`: The page was successfully created. Returns the created page object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to create pages in the space.
  - `404 Not Found`: The space was not found.
  - `500 Internal Server Error`: An error occurred while creating the space page.
