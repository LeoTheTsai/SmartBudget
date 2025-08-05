# 💰 SmartBudget

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SmartBudget** is a full-stack personal finance tracker that helps users manage their budgets, visualize expenses, and gain insights, all in a clean, modern UI.

> Built with the MERN stack: **MongoDB**, **Express**, **React**, **Node.js**

---

## 🧠 Features

### 👤 Authentication
- JWT-based auth
- Login/Register with redirects
- Avatar dropdown with logout

### 💸 Transactions
- Add/edit/delete income & expenses
- Inline notes, tooltips for long entries
- Category & date handling

### 📊 Dashboard & Analytics
- Monthly Budget Progress Bar
- Spending Breakdown Donut Chart
- Spending Trend Line Chart
- Toggle: income vs spending
- Currency formatting and tooltips

### 🔔 Notifications
- Budget alerts on dashboard
- Notification center in the header
- Stored in database with API

### 🌙 UI/UX Enhancements
- Dark mode toggle (persistent)
- Collapsible sidebar (persistent)
- Responsive design for desktop/mobile
- Clean, MUI-based interface

---

## ⚙️ Tech Stack

| Frontend          | Backend         | Database  | Libraries        |
|------------------|-----------------|-----------|------------------|
| React + Vite     | Express.js      | MongoDB   | Chart.js, JWT    |
| TypeScript       | Node.js         | Mongoose  | Material UI      |

---

## 📁 Folder Structure
smartbudget/
├── client/ # React frontend (GitHub Pages)
├── server/ # Node + Express backend (e.g. Render)

---

## 🛠 Setup Instructions

### Prerequisites
- Node.js + npm
- MongoDB URI (Atlas or local)

---

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/smartbudget.git
cd smartbudget
```
### 2.1. Backend Setup (/server)
```bash
cd server
npm install
```
### 2.2. Create a .env file in the /server directory:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```
### 2.3. Then run the server:
```bash
npm run dev
```

### 3.1. Frontend Setup (/client)
```bash
cd ../client
npm install
```
### 3.2. Then build and deploy:
```bash
npm run build
npm run deploy
```

🖼 Screenshots
<img width="2491" height="1103" alt="image" src="https://github.com/user-attachments/assets/8b8f19ef-d225-41dd-9bee-d37988c05023" />


📄 License
This project is licensed under the MIT License.



















