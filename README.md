# Food Rush ---> Food Dilivery System

FoodRush is a modern online food delivery platform built using the MERN stack.  
This repository contains the **frontend application** of FoodRush, developed using React and TailwindCSS.

The application provides separate interfaces and features for Customers, Restaurant Owners, Delivery Partners, and Administrators.

---

## 🚀 Live Project

Frontend: [https://foodrush-fds.netlify.app/](https://foodrush-fds.netlify.app/)

Backend API: https://be-fds.onrender.com

---

## 📌 Features

### 👤 Customer Features

- User registration and login
- Email verification
- Secure authentication
- Profile management
- Profile picture upload
- Update personal information
- Browse approved restaurants
- Search restaurants
- Filter restaurants
- View restaurant details
- Browse restaurant menus
- View menu item details
- Add food items to cart
- Update cart quantities
- Remove items from cart
- Favorite restaurants
- Favorite food items
- Place orders
- Online payment integration
- View payment status
- View order history
- Track order status
- Schedule food deliveries
- Customer reviews and ratings
- Restaurant rating
- Delivery rating
- View restaurant responses to reviews

---

### 🏪 Restaurant Owner Features

- Restaurant owner registration/application
- Restaurant profile management
- Restaurant logo upload
- Restaurant banner upload
- Restaurant description management
- Manage restaurant information
- Manage opening hours
- Manage delivery settings
- Manage menu items
- Add menu items
- Update menu items
- Delete menu items
- Upload menu images
- View restaurant orders
- Update order status
- View customer reviews
- Respond to customer reviews
- Update responses to reviews
- View restaurant ratings

---

### 👨‍💼 Admin Features

- Admin dashboard
- View restaurant statistics
- Manage restaurant applications
- Approve restaurants
- Reject restaurants
- View all restaurants
- Manage restaurant status
- View customer reviews
- Moderate customer reviews
- Approve reviews
- Reject inappropriate reviews
- Add moderation notes
- View review statistics
- Monitor customer feedback

---

## ⭐ Reviews & Ratings

FoodRush includes a complete customer feedback system.

Customers can provide:

- Restaurant rating
- Delivery rating
- Written feedback

Restaurant owners can:

- View customer reviews
- Respond to reviews
- Update their responses

Administrators can:

- View all reviews
- Approve reviews
- Reject inappropriate reviews
- Add moderation notes

---

## 💳 Payment Integration

FoodRush uses **Razorpay** for online payment processing.

The frontend provides:

- Secure checkout flow
- Payment initiation
- Payment status handling
- Successful payment confirmation
- Failed payment handling
- Order/payment status feedback

> Razorpay test mode is used during development and testing.

---

## 🛒 Cart Management

Customers can manage their food cart with:

- Add item to cart
- Increase quantity
- Decrease quantity
- Remove item
- View cart total
- Continue shopping
- Proceed to checkout

The UI also provides appropriate feedback when an item is successfully added to the cart.

---

## 🔐 Authentication & Authorization

FoodRush uses secure authentication mechanisms to protect user accounts and role-specific pages.

Supported roles include:

- Customer
- Restaurant Owner
- Admin

Protected routes are implemented to prevent unauthorized access to role-specific dashboards and features.

---

## 🧾 Form Validation

The application includes client-side validation for important forms such as:

- Registration
- Login
- Profile update
- Restaurant application
- Menu creation
- Menu update
- Review submission
- Restaurant response

Validation provides clear and user-friendly error messages to help users correct invalid input.

---

## 📱 Responsive Design

The FoodRush frontend is designed to work across different screen sizes.

Supported layouts include:

- Desktop
- Laptop
- Tablet
- Mobile

TailwindCSS utility classes are used to create responsive layouts and reusable UI components.

---

## 🎨 UI & Styling

The frontend is built using:

- React
- TailwindCSS
- Responsive layouts
- Reusable components
- Toast notifications
- Loading states
- Error states
- Empty states
- Confirmation dialogs

The UI provides feedback for successful operations, validation errors, API failures, loading states, and other user actions.

---

## 🧰 Tech Stack

### Frontend

- React.js
- React Router
- TailwindCSS
- Axios
- JavaScript
- React Toastify

### Authentication

- JWT-based authentication
- Protected routes
- Role-based access control

### Payment

- Razorpay

### Real-Time Features

- Socket.IO

### API Communication

- Axios
- REST APIs

### Development Tools

- Vite
- Git
- GitHub
- VS Code

---

## 🔑 Demo Credentials

### 👤 Customer

Email: karan@example.com
Password: 123456
Email: anshu@example.com
Password: 123456

### 🏪 Restaurant Owner

Email: khanna@example.com
Password: 123456
Email: sonam@example.com
Password: 123456

### 👨‍💼 Admin

Email: raj@example.com
Password: 123456

### ⚙️ Installation & Setup

```bash
git clone https://github.com/Rkthak/FE-FDS.git
cd FE-FDS
npm install

npm run dev

```

## 👨‍💻 Developer

**Raj Kumar**

FoodRush — Food Delivery System

Built using the MERN Stack.
