## Activities

### Get User Activities

- **URL:** `/api/activities`
- **Method:** `GET`
- **Authentication:** Required
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination. Default is 1.
- **Response:**
  - `200 OK`: Returns an object containing the paginated activities and the total number of pages.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the activities.

### Create Activity

- **URL:** `/api/activities`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `activityType` (string): The type of the activity.
  - `entityId` (string): The ID of the entity associated with the activity.
  - `entityType` (string): The type of the entity associated with the activity.
- **Response:**
  - `201 Created`: The activity was successfully created. Returns the created activity object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the activity.
