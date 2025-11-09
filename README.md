# 🚀 IIT Gandhinagar Odoo Hackathon Project

<div align="center">

![Project Banner](https://img.shields.io/badge/IIT%20Gandhinagar-Odoo%20Hackathon-blue?style=for-the-badge)
![Team](https://img.shields.io/badge/Team-52-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

## 📹 Project Demo Video

Watch our project demonstration video:

**[🎥 Click here to watch the demo video](https://drive.google.com/file/d/1QFCFQrJXYAyuSyNvo2f-W89neX-by27a/view?usp=sharing)**

---

## 👥 Team Information

| Role | Name |
|------|------|
| **Team Leader** | **Kartik Parmar** |
| **Member 2** | **Om Gorajiya** |
| **Member 3** | **Varun Rajai** |

**Team Number:** `52`

---

## 📋 Project Overview

This is a comprehensive business management system built for the IIT Gandhinagar Odoo Hackathon. The application provides a full-stack solution for managing various business operations including sales, purchases, projects, tasks, invoices, expenses, and vendor bills.

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Clerk** - Authentication and user management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB with Mongoose** - Database and ODM
- **Clerk Backend** - Authentication integration
- **CORS** - Cross-origin resource sharing

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration using Clerk
- 📊 **Dashboard** - Comprehensive overview of business metrics
- 📦 **Sales Orders** - Create and manage sales orders with order lines
- 🛒 **Purchase Orders** - Manage purchase orders and vendor interactions
- 📄 **Invoices** - Generate and track invoices
- 💰 **Expenses** - Track business expenses
- 📁 **Projects** - Project management with detailed views
- ✅ **Tasks** - Task creation and tracking
- 🧾 **Vendor Bills** - Manage vendor billing
- 👨‍💼 **Admin Panel** - Administrative controls and user management
- 🎨 **Modern UI** - Beautiful and responsive design

## 📁 Project Structure

```
IIT-Gandhinagar-Odoo-Hackathon/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Express middlewares
│   │   ├── services/      # Business logic services
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Clerk account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IIT-Gandhinagar-Odoo-Hackathon
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   PORT=5000
   ```

   Create a `.env` file in the `client` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000
   ```

5. **Run the application**
   
   Start the server:
   ```bash
   cd server
   npm start
   ```
   
   Start the client (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173` (or the port shown by Vite)
   - Backend API: `http://localhost:5000`

## 📝 API Endpoints

The application provides RESTful APIs for:
- Authentication (`/api/auth`)
- Sales Orders (`/api/sales-orders`)
- Purchase Orders (`/api/purchase-orders`)
- Invoices (`/api/invoices`)
- Expenses (`/api/expenses`)
- Projects (`/api/projects`)
- Tasks (`/api/tasks`)
- Vendor Bills (`/api/vendor-bills`)
- Dashboard (`/api/dashboard`)
- Admin (`/api/admin`)

## 🎯 Key Models

- **SalesOrder** - Sales order management with order lines
- **PurchaseOrder** - Purchase order tracking
- **Invoice** - Invoice generation and management
- **Expense** - Expense tracking
- **Project** - Project management
- **Task** - Task assignment and tracking
- **VendorBill** - Vendor billing management
- **User** - User management

## 🔒 Security Features

- JWT-based authentication via Clerk
- Role-based access control
- Admin panel with restricted access
- Secure API endpoints with authentication middleware

## 📸 Screenshots

Check out the screenshots in the `client/public/` directory to see the application in action!

## 🤝 Contributing

This project was developed for the IIT Gandhinagar Odoo Hackathon by Team 52.

## 📄 License

This project is developed for the IIT Gandhinagar Odoo Hackathon.

---

<div align="center">

**Built with ❤️ by Team 52**

**Kartik Parmar | Om Gorajiya | Varun Rajai**

</div>

