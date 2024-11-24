# Full-Stack Application with Vue.js, Node.js, Express, and PostgreSQL (Neon DB)

## Overview

This project is a full-stack web application consisting of a **Vue.js frontend**, **Node.js backend** with **Express**, and **PostgreSQL** (Neon DB) for data storage. The frontend handles the user interface and interactions, while the backend manages the API routes, authentication, and database operations using Sequelize ORM. The application allows users to interact with the backend via API calls and supports a secure authentication system.

---

## Frontend Setup

### Dependencies:
- **Vue.js**: The core JavaScript framework for building the user interface.
- **Vue Router**: Used for routing between pages.
- **VeeValidate**: Form validation library for Vue.js.
- **Axios**: For making HTTP requests to the backend API.
- **Yup**: Schema validation library used for client-side form validation.
- **Vue Toast Notification**: For showing toast notifications.
- **Tailwind CSS**: Utility-first CSS framework for styling the application.

### Installation:
1. Navigate to the `frontend` directory in your terminal:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Backend Setup

### Dependencies:   
- **Express**: The web framework for Node.js.
- **Sequelize ORM**: ORM for PostgreSQL.
- **Dotenv**: For loading environment variables from a `.env` file.
- **bcrypt**: For password hashing.
- **jsonwebtoken**: For handling JWT authentication.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **cookie-parser**: To parse cookies in HTTP requests.
- **nodemon**: For automatic server restarts during development.

### Installation:
1. Navigate to the `backend` directory in your terminal:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## Database Setup

### Database Configuration:
1. Create a PostgreSQL database on Neon DB.
2. Connect to the database using the `dotenv` library.
3. Define the database models using Sequelize ORM.
4. Synchronize the models with the database.

### functionality:
- User registration and login.
- Secure authentication using JSON Web Tokens (JWT).
- User profile management.
- Password reset functionality.
- admin create edit delete user
- user change password 
- user update profile
