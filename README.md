# 🔗 URL Shortener - Project Assignment for ElysianNXT

This is a URL shortener web application built as a project assignment. It is built with React, a pure Node.js (no-framework) backend, and Google Firestore, all containerized with Docker.

**Live Demo:** [https://shortyurl.ddns.net](https://shortyurl.ddns.net)
![alt text](web.png)

---

## ✨ Features

* **Shorten:** Generates a 7-character short link from any long URL.
* **Redirect:** All generated short links are fully functional and redirect to their original destination.
* **Cache:** If a user submits a URL that has already been shortened, the system returns the existing short link ("Storage/Cache for repeated link" requirement).
* **Secure:** Fully served over HTTPS (SSL).
* **Containerized:** The entire application (frontend and backend) is deployed using Docker Compose.

---

## 🛠️ Tech Stack

* **Frontend:**
    * [![React][React.js]][React-url]
    * [![Emotion][Emotion.sh]][Emotion-url] (for CSS-in-JS, as per assignment requirements)
* **Backend:**
    * [![Node.js][Node.js]][Node-url] (Using the native `http` module, no external frameworks like Express)
* **Database:**
    * [![Firebase][Firebase]][Firebase-url] (Used to store `shortCode` and `longUrl` pairs)
* **Deployment:**
    * [![Nginx][Nginx]][Nginx-url] (Acts as the reverse proxy, handles SSL termination, and serves the React app)
    * [![Docker][Docker]][Docker-url]
    * [![Let's Encrypt][LetsEncrypt]][LetsEncrypt-url] (For SSL Certificates)

---

## 🏗️ Architecture

This project uses a 2-Container architecture:

1.  **`frontend` (Nginx + React):** This container acts as the public-facing gateway. It serves the static React app, handles SSL (HTTPS) termination, and reverse-proxies API calls (`/api/*`) and short-link redirects (`/{shortCode}`) to the backend.
2.  **`backend` (Node.js API):** This is an internal container that listens for requests from the `frontend` proxy. It handles all business logic and communication with the Google Firestore database.

---

## 📞 API Endpoints

* **`POST /api/shorten`**
    * Creates a new short URL.
    * **Body (JSON):** `{ "longUrl": "https://..." }`
    * **Response (JSON):** `{ "shortUrl": "https://.../abcdefg" }`

* **`GET /{shortCode}`** (e.g., `/abcdefg`)
    * Performs a 301 Redirect to the stored `longUrl`.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[Emotion.sh]: https://img.shields.io/badge/Emotion-D269A8?style=for-the-badge&logo=emotion&logoColor=white
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Firebase]: https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black
[Nginx]: https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white
[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[LetsEncrypt]: https://img.shields.io/badge/Let's_Encrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white

[React-url]: https://reactjs.org/
[Emotion-url]: https://emotion.sh/
[Node-url]: https://nodejs.org/
[Firebase-url]: https://firebase.google.com/
[Nginx-url]: https://www.nginx.com/
[Docker-url]: https://www.docker.com/
[LetsEncrypt-url]: https://letsencrypt.org/