# Project Name

## Description

Provide a brief description of your project here.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Server](#running-the-server)
5. [Usage](#usage)
6. [Routes Specification](#routes-specification)
7. [Additional Notes](#additional-notes)

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [npm](https://www.npmjs.com/) - Node.js package manager

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install project dependencies:

   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root of the project:

   ```
   JWT_SECRET=your_jwt_secret_key
   EMAIL_PASS=your_email_password
   ORIGIN_URL=http://localhost:3000  # Update with your actual origin URL
   ```

   Replace `your_jwt_secret_key` and `your_email_password` with your desired values.

2. Set up your MongoDB database and update the database connection string in your code.

## Running the Server

Now that you have installed and configured the project, you can run the server:

```bash
npm start
```

The server will start on the specified port, usually `http://localhost:3000`. You can change the port in the `app.js` file if needed.

## Usage

You can use tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/) to interact with the API endpoints. Refer to the API documentation or the provided routes in the code for available endpoints and their functionality.

## Routes Specification

### Admin Routes

1. **User Registration**

   - **Endpoint**: `/signup`
   - **Method**: `POST`
   - **Validation**:
     - `name`: Required
     - `password`: Required
     - `email`: Required
     - `phone_number`: Required
   - **Controller**: `adminControllers.signup`

2. **Email Verification**

   - **Endpoint**: `/email/verification`
   - **Method**: `GET`
   - **Controller**: `adminControllers.verifySave`

3. **User Login**

   - **Endpoint**: `/login`
   - **Method**: `POST`
   - **Validation**:
     - `email`: Required
     - `password`: Required
   - **Controller**: `adminControllers.login`

4. **Password Reset**

   - **Endpoint**: `/password/reset`
   - **Method**: `POST`
   - **Validation**:
     - `email`: Required
   - **Middleware**: `adminControllers.authMiddleware`
   - **Controller**: `adminControllers.resetPassword`

5. **Resetting User Name**

   - **Endpoint**: `/name/reset`
   - **Method**: `POST`
   - **Validation**:
     - `rename`: Required (New name)
   - **Middleware**: `adminControllers.authMiddleware`
   - **Controller**: `adminControllers.resetName`

6. **Deleting a User**

   - **Endpoint**: `/delete/user`
   - **Method**: `POST`
   - **Validation**:
     - `email`: Required
     - `password`: Required
   - **Middleware**: `adminControllers.authMiddleware`
   - **Controller**: `adminControllers.deleteUser`

7. **Deleting an Admin**

   - **Endpoint**: `/delete/admin`
   - **Method**: `POST`
   - **Validation**:
     - `email`: Required
     - `password`: Required
   - **Middleware**: `adminControllers.authMiddleware`
   - **Controller**: `adminControllers.deleteAdmin`

### User Routes

1. **User Registration**

   - **Endpoint**: `/signup`
   - **Method**: `POST`
   - **Validation**:
     - `name`: Required
     - `password`: Required
     - `email`: Required
     - `phone_number`: Required
   - **Controller**: `userController.signup`

2. **Email Verification**

   - **Endpoint**: `/email/verification`
   - **Method**: `GET`
   - **Controller**: `userController.verifySave`

3. **User Login**

   - **Endpoint**: `/login`
   - **Method**: `POST`
   - **Validation**:
     - `email`: Required
     - `password`: Required
   - **Controller**: `userController.login`

4. **Password Reset**

   - **Endpoint**: `/password/reset`
   - **Method**: `POST`
   - **Validation**:
     - `password`: Required
     - `newPassword`: Required
   - **Middleware**: `userController.authMiddleware`
   - **Controller**: `userController.resetPassword`

5. **Resetting User Name**

   - **Endpoint**: `/name/reset`
   - **Method**: `POST`
   - **Validation**:
     - `newName`: Required (New name)
   - **Middleware**: `userController.authMiddleware`
   - **Controller**: `userController.resetName`

6. **Deleting a User

**

   - **Endpoint**: `/delete/user`
   - **Method**: `POST`
   - **Validation**:
     - `email`: Required
     - `password`: Required
   - **Middleware**: `userController.authMiddleware`
   - **Controller**: `userController.deleteAccount`

7. **Adding User Profile Image**

   - **Endpoint**: `/user/addimg`
   - **Method**: `POST`
   - **Validation**:
     - `email`: Required
     - `password`: Required
   - **Middleware**: `userController.authMiddleware`
   - **Controller**: `imagesController.userAddProfileImage`

8. **Previewing Image**

   - **Endpoint**: `/img/:_id`
   - **Method**: `GET`
   - **Controller**: `imagesController.preview`

### Admin Image Routes

1. **Adding Admin Profile Image**

   - **Endpoint**: `/admin/addimg`
   - **Method**: `POST`
   - **Middleware**: `adminController.authMiddleware`
   - **Controller**: `imagesController.adminAddProfileImage`

## Additional Notes

- Make sure your MongoDB server is running and accessible.
- Adjust the routes, controllers, and middleware based on your project requirements.
