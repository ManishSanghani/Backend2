# mytube

mytube is a backend API service designed for a video-sharing platform similar to YouTube. It is built with Node.js, Express, and MongoDB (via Mongoose) and provides robust features for managing users, videos, playlists, comments, subscriptions, and dashboard analytics.

## Features

- **User Management**
  - Register, login, logout, and profile management
  - Update avatar and cover images
  - View watch history

- **Video Management**
  - Upload, update, publish/unpublish, and delete videos
  - Video querying with filtering, sorting, and pagination
  - Video and thumbnail storage with Cloudinary

- **Playlist Management**
  - Create playlists and manage videos within them
  - Retrieve playlists by user or ID

- **Comment System**
  - Add, update, delete, and list comments on videos (with pagination)

- **Subscription System**
  - Subscribe/unsubscribe to channels
  - List subscribers and subscriptions

- **Dashboard & Analytics**
  - Fetch channel statistics (total videos, views, likes, subscribers)
  - Channel-specific video listing with pagination and sorting

## Technology Stack

- **Node.js & Express** – API server and routing
- **MongoDB & Mongoose** – Database and schema modeling
- **Cloudinary** – Media file storage
- **Modular Controllers** – Organized feature logic
- **Custom Response/Error Handling** – Consistent API outputs

## Example Endpoints

- `/videos` – Video CRUD operations
- `/playlists` – Playlist management
- `/comments` – Comment management
- `/subscriptions` – Channel subscription management
- `/dashboard` – Channel analytics
- `/users` – User profile and history

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ManishSanghani/mytube.git
   cd mytube
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**

   Create a `.env` file in the project root with the following:
   ```
   MONGODB_URI=your_mongodb_uri
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PORT=8000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## Folder Structure

```
src/
│
├── controllers/     # Feature controllers (user, video, playlist, etc.)
├── models/          # Mongoose models
├── utils/           # Utility functions (responses, errors, async handlers)
├── db/              # Database connection logic
├── index.js         # Application entry point
└── app.js           # Express app configuration
```

## Contributing

Feel free to open issues or submit pull requests for improvements or bug fixes.

## License

[MIT](LICENSE)
