# 🛒 MEAN Stack eCommerce Website

A full-featured eCommerce platform built using **MongoDB, Express.js,
Angular, and Node.js**, with Cloudinary image upload, category
management, product listings, cart system, order management, and modern
responsive UI.

## ✅ Features

### 🗂 Categories

-   Add, edit, delete categories
-   Nested parent--child category structure
-   Category images via Cloudinary
-   Category tree view (PrimeNG)

### 🛍 Products

-   Add products with:
    -   Name
    -   Description
    -   Price
    -   Stock
    -   Category selection
    -   Multiple images
-   Auto-generate tags from product name
-   Search, filter, sort, and pagination
-   User-friendly product cards UI (Tailwind + Angular)

### 🛒 Cart & Checkout

-   Add to cart
-   Update quantity
-   Remove from cart
-   Cart total calculation
-   Checkout with login redirection
-   Order creation with all details

### 📦 Orders

**User** - View order history

**Admin** - Manage all orders - Update order status

### 👤 Authentication

-   User Registration & Login
-   Admin Login
-   JWT-based middleware
-   Role-based API access

###  Frontend (Angular 20)

-   Tailwind CSS styling
-   PrimeNG components
-   Responsive layout
-   Modern UI
-   Category-based browsing
-   Search results page
-   Wishlist counter
-   Improved order detail UI

###  Backend (Node.js + Express)

-   RESTful API architecture
-   MongoDB + Mongoose
-   Cloudinary image upload
-   Secure JWT authentication
-   Validation & error handling
-   Clean controllers/services structure

## ☁ Deployment

### ✅ Frontend → Netlify

-   Angular build optimized
-   Environment variables configured

### ✅ Backend → Render

Environment variables:

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    MONGO_URL=
    JWT_SECRET=

## Folder Structure

    ├── backend
    │   ├── controllers
    │   ├── models
    │   ├── routes
    │   ├── config
    │   └── index.js
    │
    └── frontend
        ├── src
        │   ├── app
        │   │   ├── components
        │   │   ├── services
        │   │   └── guards
        │   ├── assets
        │   └── environments


## Backend Setup

``` bash
cd backend
npm install
```

Create a `.env` file:

    MONGO_URL=your_mongo_uri
    JWT_SECRET=your_secret
    CLOUDINARY_CLOUD_NAME=xxx
    CLOUDINARY_API_KEY=xxx
    CLOUDINARY_API_SECRET=xxx

Run server:

``` bash
nodemon server.js
```

## Frontend Setup

``` bash
cd frontend
npm install
ng serve
```
