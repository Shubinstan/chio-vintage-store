# Chio Vintage - A Modern E-Commerce Platform

A feature-rich, responsive e-commerce application for a vintage clothing store, built from the ground up with a modern technology stack including React, TypeScript, and Firebase. This project demonstrates a comprehensive understanding of front-end development, state management, and backend-as-a-service (BaaS) integration.

**Live Demo:** [Your Live Site URL Here]

---

## Core Features

This application is built to provide a seamless and professional user experience, incorporating functionalities expected from a modern e-commerce platform.

* **Fully Responsive Design**: A mobile-first approach ensures a flawless user experience on all devices, from small mobile screens to large desktop monitors. The UI is clean, intuitive, and adheres to modern design principles.
* **Real-time Product Catalog**: Products are fetched dynamically from a Firestore database. The catalog supports category-based filtering, price range filtering, and multiple sorting options (price, name), all handled efficiently on the client side.
* **Advanced State Management**: Global state for the shopping cart and user authentication is managed with Zustand, chosen for its simplicity and performance over more boilerplate-heavy solutions like Redux.
* **Persistent Shopping Cart**: The cart's state is persisted across sessions. For guest users, the cart is saved to `localStorage`. Upon login, the guest cart is intelligently merged with the user's cloud-saved cart in Firestore.
* **Secure User Authentication**: Full email and password authentication is handled through Firebase Authentication. The system includes secure registration with password validation, login, and session management.
* **Guest & Authenticated Checkout**: The checkout process is available to all users. Registered users receive a 10% discount on their first purchase, a feature designed to drive user sign-ups.
* **Dynamic Theme Switching**: Users can toggle between light and dark modes, with their preference persisted for a personalized experience.
* **Marketing & UX**: A non-intrusive modal appears for guest users after a set time, offering the registration discount to encourage conversion. User feedback is provided through clean, non-blocking toast notifications.

---

## Technical Stack

This project utilizes a modern and scalable set of technologies chosen to demonstrate proficiency in current front-end development standards.

* **Core**: React, TypeScript
* **Styling**: Styled-Components (with a focus on reusable components and a consistent design system)
* **State Management**: Zustand (for a lightweight, hook-based approach to global state)
* **Routing**: React Router
* **Backend & Database**: Firebase (Authentication, Firestore)
* **Build Tool**: Vite
* **Deployment**: [Vercel / Netlify]

---

## Local Development Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/chio-vintage-store.git](https://github.com/your-username/chio-vintage-store.git)
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd chio-vintage-store
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Configure Environment Variables:**
    * Create a `.env.local` file in the project root.
    * Add your Firebase project configuration keys:
        ```env
        VITE_FIREBASE_API_KEY="YOUR_API_KEY"
        VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
        VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
        VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
        VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
        VITE_FIREBASE_APP_ID="YOUR_APP_ID"
        ```
5.  **Start the development server:**
    ```bash
    npm run dev
    ```
