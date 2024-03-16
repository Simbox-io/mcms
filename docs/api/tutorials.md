## Tutorials

### Get Tutorials

- **URL:** `/api/tutorials`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination. Default is 1.
- **Response:**
  - `200 OK`: Returns an object containing the paginated tutorials and the total number of pages.
  - `500 Internal Server Error`: An error occurred while fetching the tutorials.

### Create Tutorial

- **URL:** `/api/tutorials`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `title` (string): The title of the tutorial.
  - `content` (string): The content of the tutorial.
  - `tags` (array of strings): The tags associated with the tutorial.
  - `collaborators` (array of strings): The IDs of the collaborators for the tutorial.
  - `settings` (object, optional): The settings for the tutorial.
- **Response:**
  - `201 Created`: The tutorial was successfully created. Returns the created tutorial object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the tutorial.

### Unpublish Tutorial

- **URL:** `/api/tutorials/:id/unpublish`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Response:**
  - `200 OK`: The tutorial was successfully unpublished. Returns the unpublished tutorial object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to unpublish the tutorial.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while unpublishing the tutorial.

### Get Tutorial Collaborators

- **URL:** `/api/tutorials/:id/collaborators`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Response:**
  - `200 OK`: Returns an array of collaborators for the tutorial.
  - `500 Internal Server Error`: An error occurred while fetching the tutorial collaborators.

### Add Tutorial Collaborator

- **URL:** `/api/tutorials/:id/collaborators`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Request Body:**
  - `collaboratorId` (string): The ID of the collaborator to add.
- **Response:**
  - `200 OK`: The collaborator was successfully added to the tutorial.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to add collaborators to the tutorial.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while adding the tutorial collaborator.

### Remove Tutorial Collaborator

- **URL:** `/api/tutorials/:id/collaborators`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Request Body:**
  - `collaboratorId` (string): The ID of the collaborator to remove.
- **Response:**
  - `200 OK`: The collaborator was successfully removed from the tutorial.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to remove collaborators from the tutorial.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while removing the tutorial collaborator.

### Get Tutorial Prerequisites

- **URL:** `/api/tutorials/:id/prerequisites`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Response:**
  - `200 OK`: Returns an array of prerequisites for the tutorial.
  - `500 Internal Server Error`: An error occurred while fetching the tutorial prerequisites.

### Add Tutorial Prerequisite

- **URL:** `/api/tutorials/:id/prerequisites`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Request Body:**
  - `requiredKnowledge` (string): The required knowledge for the prerequisite.
  - `requiredTutorialId` (string, optional): The ID of the required tutorial for the prerequisite.
- **Response:**
  - `201 Created`: The prerequisite was successfully added to the tutorial. Returns the created prerequisite object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to add prerequisites to the tutorial.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while adding the tutorial prerequisite.

### Remove Tutorial Prerequisite

- **URL:** `/api/tutorials/:id/prerequisites`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Request Body:**
  - `prerequisiteId` (string): The ID of the prerequisite to remove.
- **Response:**
  - `200 OK`: The prerequisite was successfully removed from the tutorial.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to remove prerequisites from the tutorial.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while removing the tutorial prerequisite.

### Get Tutorial Tags

- **URL:** `/api/tutorials/:id/tags`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Response:**
  - `200 OK`: Returns an array of tags associated with the tutorial.
  - `500 Internal Server Error`: An error occurred while fetching the tutorial tags.

### Add Tutorial Tags

- **URL:** `/api/tutorials/:id/tags`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Request Body:**
  - `tags` (array of strings): The tags to add to the tutorial.
- **Response:**
  - `200 OK`: The tags were successfully added to the tutorial. Returns the updated tutorial object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to add tags to the tutorial.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while adding the tutorial tags.

### Publish Tutorial

- **URL:** `/api/tutorials/:id/publish`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Response:**
  - `200 OK`: The tutorial was successfully published. Returns the published tutorial object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to publish the tutorial.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while publishing the tutorial.

### Get Tutorial by ID

- **URL:** `/api/tutorials/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Response:**
  - `200 OK`: Returns the tutorial object.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while fetching the tutorial.

### Update Tutorial

- **URL:** `/api/tutorials/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Request Body:**
  - `title` (string): The updated title of the tutorial.
  - `content` (string): The updated content of the tutorial.
  - `tags` (array of strings): The updated tags associated with the tutorial.
  - `collaborators` (array of strings): The updated IDs of the collaborators for the tutorial.
  - `settings` (object, optional): The updated settings for the tutorial.
- **Response:**
  - `200 OK`: The tutorial was successfully updated. Returns the updated tutorial object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to update the tutorial.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while updating the tutorial.

### Delete Tutorial

- **URL:** `/api/tutorials/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the tutorial.
- **Response:**
  - `200 OK`: The tutorial was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to delete the tutorial.
  - `404 Not Found`: The tutorial was not found.
  - `500 Internal Server Error`: An error occurred while deleting the tutorial.
