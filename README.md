<img src="https://socialify.git.ci/juniorSarh/React-Native-Restuarent-App/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="React-Native-Restuarent-App" width="640" height="320" />

# 🍽️ React Native Restaurant App

## 📌 Overview
This project is a **React Native Restaurant App** that allows users to view food menus, customize orders, and place them directly through the application. The app demonstrates CRUD operations, user authentication, cart management, checkout, and admin management.


## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/react-native-restaurant-app.git
cd react-native-restaurant-app
```
## Install dependances
```bash
npm i
```
## Start the app
```bash
npm start
```

## 🚀 Features

### ✅ User Features
- **Authentication**
  - Register and login using Email & Password
  - Update profile details (Name, Email, Address, Contact, Card)
  - Registered users are required to place orders

- **Menu Browsing**
  - View food menus categorized by type (Desserts, Beverages, Burgers, Mains, Starters, etc.)
  - View food item details: Name, Description, Price, Image
  - Customize items with sides, drinks, extras, and optional ingredients
  - Adjust quantity of items

- **Cart Management**
  - Add, edit, and remove items
  - Clear the entire cart
  - Navigate to item detail to customize extras
  - Checkout available for registered users

- **Checkout & Orders**
  - Change delivery address if needed
  - Select/change payment method
  - Place order
  - Store order details in database for processing
  - Supports testing with Stripe, PayPal, or other payment APIs

---

### ⚙️ Admin Features
- Separate **Admin Dashboard**
  - Add and update food items
  - Manage restaurant details
  - View order history
  - Analyze data using charts

---

## 🧩 Technical Requirements
- React Native with reusable components
- User Authentication
- CRUD operations for menu and orders
- Local and cloud storage for orders and user profiles
- Payment integration (Stripe, PayPal, etc.)
- Optional: Admin analytics and charts
- Offline accessibility for menu browsing

---

