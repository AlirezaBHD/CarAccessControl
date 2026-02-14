<img width="1504" height="688" alt="cover image" src="./docs/images/cover.png" />

# 🚗 CarAccessControl (Parking & LPR System)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![.NET](https://img.shields.io/badge/.NET-9.0-purple.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-green.svg)

**CarAccessControl** is a comprehensive, modern solution for automated parking management and vehicle access control using License Plate Recognition (LPR). Built with performance and scalability in mind, it leverages **.NET 9** for a robust backend and **React.js** for a dynamic, multi-lingual frontend.

---

## 📸 Screenshots

| English | Arabic 
|:---:|:---:
| ![Dashboard](./docs/images/english/en-dashboard.png) | ![Realtime](./docs/images/arabic/ar-dashboard.png)
| ![Dashboard](./docs/images/english/en-owner-detail.png) | ![Realtime](./docs/images/arabic/ar-owner-detail.png)
---

## 🌟 Key Features

*   **🤖 AI-Powered LPR:** Seamless integration with AI models for accurate license plate recognition from camera feeds.
*   **⚡ Real-time Monitoring:** Instant updates on the dashboard using **SignalR** when a car approaches or enters.
*   **🌍 Multi-lingual Support:** Complete UI localization (English & Arabic) using **i18next**.
*   **📊 Advanced Reporting:** Generate detailed Excel reports of traffic logs using **ClosedXML**.
*   **🛡️ Robust Validation:** Clean and maintainable validation logic via **FluentValidation**.
*   **📷 Image Processing:** Handling camera snapshots and image manipulation with **OpenCvSharp4**.
*   **RESTful API:** Well-structured API endpoints following REST principles.

---

## 🏗️ Architecture & Tech Stack

This project is designed as a decoupled system where the backend handles logic and hardware integration, while the frontend provides a responsive interface.

### Backend (.NET 9)
*   **Framework:** ASP.NET Core (.NET 9)
*   **Database:** PostgreSQL (with Entity Framework Core)
*   **Real-time Communication:** SignalR
*   **Object Mapping:** AutoMapper
*   **Validation:** FluentValidation
*   **Reporting:** ClosedXML
*   **Image Processing:** OpenCvSharp4
*   **AI Integration:** Consumes an external AI Model API for plate recognition.

### Frontend (React.js)
*   **Framework:** React 18
*   **Language:** JavaScript (JSX)
*   **Localization:** i18next (English / Arabic)
*   **State Management:** Context API
*   **Styling:** Tailwind CSS

---

## 🔄 How It Works

1.  **Capture:** The IP Camera captures an image of the vehicle at the gate.
2.  **Process:** The backend receives the image and processes it via **OpenCvSharp4**.
3.  **Recognition:** The image is sent to the **AI Model** service.
4.  **Result:** The AI returns the recognized license plate text.
5.  **Real-time Alert:** The result (Plate Number + Access Status + Photo) is pushed instantly to the Frontend via **SignalR**.

---

## 🐳 Installation & Setup  
Since the AI Model relies on a private Docker image, follow these steps to get started:

### 1. Prerequisites
Ensure you have **Docker** and **Docker Compose** installed on your machine.

### 2. Load AI Model Image
The AI model image is not hosted on public registries due to its size.
1.  Download the image file (`plate-recognition.tar`) from **[LINK]**.
2.  Place the file in the root directory (or a specific folder like `./docker-images`).
3.  Run the following command to load the image into Docker:

```bash
# Example if the file is in 'docker-images' folder

docker load -i docker-images/plate-recognition.tar
```

### 3. Run the System

Once the image is loaded, start the application stack:

```bash
docker compose up -d
```

After the containers are up and running, you can access the services at:
http://localhost:80

---

## 📖 API Documentation 
Swagger UI is available at: http://localhost:8000/swagger

---

## 📄 License  

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.
