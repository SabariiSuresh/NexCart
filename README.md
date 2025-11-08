# 🛒 MEAN Stack eCommerce Website

A full-featured eCommerce platform built using **MongoDB, Express.js,
Angular, and Node.js**, with Cloudinary image upload, category/product
management, cart system, orders, payments, and a modern responsive UI.

## ✅ Features

### 👤 Authentication

-   User Registration & Login
-   Admin Login
-   JWT-based middleware
-   Role-based API access  

# 👤 User Features

-   Browse products
-   Search, filter, and category-wise browsing
-   Add to cart (login required)
-   Add to wishlist(login required)
-   Update/remove cart items (login required)
-   Checkout (login required)
-   View order history(login required)
-   Responsive UI for mobile & desktop
-   

# 🛠️ Admin Features

### ✅ **1. Manage Users**

-   View all registered users
-   Delete users  

### ✅ **2. Manage Products**

-   Add new products
-   Update product details
-   Delete products
-   Manage product images (Cloudinary)
-   Control stock quantity
-   Assign categories
-   Auto-generate product tags

### ✅ **3. Manage Categories**

-   Add category
-   Edit category
-   Delete category
-   Parent--child categories
-   Category image upload
-   Category tree view

### ✅ **4. Manage Orders**

-   View all orders
-   Update order statuses
-   View order items, amounts, and payment details

### ✅ **5. Manage Payments**

-   View all payments
-   Check payment method (COD / Online)
-   Payment statuses
-   Track total revenue
-   Handle failed or pending transactions
   

#  Frontend (Angular 20)

-   Tailwind CSS
-   PrimeNG
-   Responsive product cards
-   Search & filter
-   Category menu

#  Backend (Node.js + Express)

-   RESTful APIs
-   MongoDB + Mongoose
-   JWT authentication
-   Cloudinary uploads

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
