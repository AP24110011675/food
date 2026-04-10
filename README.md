# FoodHub - Premium MERN Food Ordering System

![FoodHub Hero](https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80)

FoodHub is a state-of-the-art, production-ready MERN stack web application designed for a seamless food ordering experience. Inspired by leading platforms like Zomato, it combines premium aesthetics with high-performance architecture.

## 🚀 Key Features

- **Dynamic Homepage**: Modern, high-conversion landing page with featured restaurant discovery.
- **Advanced Filtering**: Search by name or filter by categories with instant feedback.
- **Optimized Performance**: Leverages React memoization (`useMemo`, `useCallback`) and professional state management.
- **Robust Security**: JWT-based authentication with secure cookie/local storage handling.
- **Order Tracking**: Visual stepper-based order status tracking from preparation to delivery.
- **Production Error Handling**: Centralized error middleware on backend and Axios interceptors on frontend.
- **Fully Responsive**: Crafted with modern CSS and Framer Motion for smooth, premium feel on all devices.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Styling**: Modern Vanilla CSS with CSS Variables
- **API**: RESTful API with Axios integration

## 📂 Project Structure

```text
├── backend/          # MVC Backend Architecture
│   ├── config/       # Database & Env config
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Auth & Error handling
│   ├── models/       # Mongoose Schemas
│   └── routes/       # API Route definitions
├── frontend/         # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Global state (Cart, Auth)
│   │   ├── pages/      # View components
│   │   ├── services/   # API abstraction
│   │   └── assets/     # High-quality images
└── server.js         # Production server entry point
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB connection string

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Create a `.env` file in the root:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```
4. Start the development servers:
   ```bash
   npm run dev
   ```

## 🧪 Development Context
This project was built with a focus on **scalability** and **UX excellence**. Every component is memoized to prevent redundant renders, and the backend is structured to handle high-traffic interactions gracefully.