## Notifications

### Get User Notifications

- **URL:** `/api/notifications`
- **Method:** `GET`
- **Authentication:** Required
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination. Default is 1.
- **Response:**
  - `200 OK`: Returns an object containing the paginated notifications and the total number of pages.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while fetching the notifications.

### Create Notification

- **URL:** `/api/notifications`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `message` (string): The message of the notification.
  - `link` (string): The link associated with the notification.
  - `settings` (object, optional): The settings for the notification.
- **Response:**
  - `201 Created`: The notification was successfully created. Returns the created notification object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the notification.

### Get Notification by ID

- **URL:** `/api/notifications/:id`
- **Method:** `GET`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the notification.
- **Response:**
  - `200 OK`: Returns the notification object.
  - `401 Unauthorized`: The user is not authenticated.
  - `404 Not Found`: The notification was not found.
  - `500 Internal Server Error`: An error occurred while fetching the notification.

### Update Notification

- **URL:** `/api/notifications/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the notification.
- **Request Body:**
  - `isRead` (boolean): The updated read status of the notification.
  - `settings` (object, optional): The updated settings for the notification.
- **Response:**
  - `200 OK`: The notification was successfully updated. Returns the updated notification object.
  - `401 Unauthorized`: The user is not authenticated.
  - `404 Not Found`: The notification was not found.
  - `500 Internal Server Error`: An error occurred while updating the notification.

### Delete Notification

- **URL:** `/api/notifications/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the notification.
- **Response:**
  - `200 OK`: The notification was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated.
  - `404 Not Found`: The notification was not found.
  - `500 Internal Server Error`: An error occurred while deleting the notification.
