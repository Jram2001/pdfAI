# Project Setup Instructions

This document provides instructions for setting up and running the project, which consists of separate frontend and backend folders. Follow the steps below to configure and start the application.

## Prerequisites
- Node.js and npm installed on your system.
- A valid Gemini API key for the backend.
- The URL of the backend server for the frontend configuration.

## Setup Instructions

### 1. Install Dependencies
Navigate to both the `frontend` and `backend` folders and install the required dependencies.

#### Frontend
1. Open a terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

#### Backend
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 2. Configure Environment Variables

#### Frontend
1. Locate the environment configuration file in the `frontend` folder (e.g., `.env` or similar).
2. Replace the placeholder backend URL with your actual backend server URL. For example:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.com
   ```
   Ensure the URL is correct and accessible.

#### Backend
1. Locate the environment configuration file in the `backend` folder (e.g., `.env` or similar).
2. Replace the placeholder Gemini API key with your own valid Gemini API key. For example:
   ```
   GEMINI_API_KEY=your-gemini-api-key
   ```
   Ensure the API key is valid and securely stored.

### 3. Run the Application

#### Frontend
1. In the `frontend` folder, start the development server:
   ```bash
   npm run dev
   ```
2. The frontend application should now be running, typically accessible at `http://localhost:3000` (or the port specified in your configuration).

#### Backend
1. In the `backend` folder, start the development server:
   ```bash
   npm run dev
   ```
2. The backend server should now be running, typically accessible at `http://localhost:5000` (or the port specified in your configuration).

## Notes
- Ensure both the frontend and backend servers are running simultaneously for full application functionality.
- Verify that the backend URL configured in the frontend matches the actual backend server address.
- Keep your Gemini API key secure and do not expose it in public repositories.

For further assistance, refer to the project documentation or contact the development team.
