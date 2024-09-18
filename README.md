# WegenShare

## Overview

WegenShare is a file-sharing platform that allows users to upload, download, list, delete, and share files. It includes user registration, login, and account management features. This project uses Node.js, Express.js, and MongoDB for backend development.

## Features

- User registration and login
- File upload, download, list, delete
- Generate shareable links for files
- Share files with other users
- User logout and account deletion

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Cloud Storage:** AWS S3 (optional)
- **Project Management:** Trello, GitHub

## Installation

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` file** in the root directory of the project and add the following environment variables:

    ```
    DB_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    ```

4. **Run the application:**

    ```bash
    npm start
    ```

## API Endpoints

### User Authentication

- **Register a user**

  - **Endpoint:** `POST /api/auth/register`
  - **Request body:**

    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **Login a user**

  - **Endpoint:** `POST /api/auth/login`
  - **Request body:**

    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

- **Logout a user**

  - **Endpoint:** `POST /api/auth/logout`
  - **Headers:**
    - `Authorization: Bearer <token>`

- **Delete user account**

  - **Endpoint:** `DELETE /api/auth/delete`
  - **Headers:**
    - `Authorization: Bearer <token>`

### File Management

- **Upload a file**

  - **Endpoint:** `POST /api/files/upload`
  - **Headers:**
    - `Authorization: Bearer <token>`
  - **Form-data:**
    - `file: <file>`

- **List files**

  - **Endpoint:** `GET /api/files/list`
  - **Headers:**
    - `Authorization: Bearer <token>`

- **Download a file**

  - **Endpoint:** `GET /api/files/download/:id`
  - **Headers:**
    - `Authorization: Bearer <token>`

- **Delete a file**

  - **Endpoint:** `DELETE /api/files/delete/:id`
  - **Headers:**
    - `Authorization: Bearer <token>`

- **Generate shareable link**

  - **Endpoint:** `POST /api/files/share/link/:id`
  - **Headers:**
    - `Authorization: Bearer <token>`

- **Share file with users**

  - **Endpoint:** `POST /api/files/share/user/:id`
  - **Headers:**
    - `Authorization: Bearer <token>`
  - **Request body:**

    ```json
    {
      "userIds": ["userId1", "userId2"]
    }
    ```

## Troubleshooting

- **Failed Deployment:** Ensure all environment variables are correctly set and the `.env` file is properly configured.
- **Authentication Issues:** Verify that the JWT_SECRET matches across your application and that tokens are valid.

## Contributing

Feel free to open issues or submit pull requests if you want to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Elias Yidnekachew** - www.github.com/ElyasYid
