# Jellyfin-SideProject

This project is a **side project** designed to integrate with Jellyfin for video management. It provides functionalities for uploading, streaming, and downloading videos, targeting educational or media management use cases.

---

## Features

- **Upload Videos**: Users can upload videos with metadata like course ID, chapter ID, and section ID via a web interface.
- **Stream Videos**: Provides a web-based player for streaming videos stored on the Jellyfin server.
- **Download Videos**: Enables downloading videos directly from the Jellyfin library.

---

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js (Express)
- **Dependencies**: [See package.json](./package.json)
- **Media Server**: Jellyfin

---

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/Jellyfin-SideProject.git
   cd Jellyfin-SideProject
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Jellyfin Server:
   - Update the `app.js` file with your Jellyfin server URL and API key:
     ```javascript
     const jellyfinServer = 'http://localhost:8096';
     const apiKey = '<YOUR_API_KEY>';
     ```

4. Run the server:

   ```bash
   node app.js
   ```

5. Access the application:
   - Upload interface: `http://localhost:3000/upload.html`
   - Video streaming: `http://localhost:3000/watch.html`
   - Download videos: `http://localhost:3000/download.html`

---

## Usage

- **Upload Videos**: Navigate to the upload page and provide the required metadata to upload videos.
- **Watch Videos**: Browse the available videos and stream them directly in your browser.
- **Download Videos**: Download videos to your local device using the download interface.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## Acknowledgments

This project is inspired by Jellyfin, an open-source media server, and aims to enhance its usability with additional management and accessibility features.
