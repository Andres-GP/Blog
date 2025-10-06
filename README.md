# NodeBlog

A simple **Blog application** built with **Node.js**, **Express**, and **MongoDB**.  
This project demonstrates user authentication, CRUD operations for posts, and a clean responsive UI.

---

**Live demo:** [https://blog-3rab.onrender.com/](https://blog-3rab.onrender.com/)

---

## Features

- User registration and login (with hashed passwords using **bcrypt**)
- Guest login
- JWT authentication with cookies
- Session management and flash messages for success/error alerts
- Create, edit, delete posts
- Search posts by title or body content
- Responsive design with a search bar and interactive UI
- Dashboard accessible only for logged-in users

---

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework for Node.js
- **EJS** - Template engine for rendering views
- **MongoDB** - Database for storing users and posts
- **Mongoose** - ODM for MongoDB
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **connect-flash** - Flash messages for success/error notifications
- **express-session** & **connect-mongo** - Session management
- **method-override** - Support for PUT/DELETE HTTP verbs
- **express-ejs-layouts** - Layout management for EJS
- **cookie-parser** - Parse cookies
