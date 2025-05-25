 Welcome to **[Penguin87-fullstack-Ecom]
﻿# Chanon2003-Penguin87-Ecom-FullStack

# สารบัญ
 - [ขั้นตอนการใช้งาน](#%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B8%B2%E0%B8%99)
 - [แรงบันดาลใจ](#-%E0%B9%81%E0%B8%A3%E0%B8%87%E0%B8%9A%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B2%E0%B8%A5%E0%B9%83%E0%B8%88)
 - [ขั้นตอนการใช้งาน](#-%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B8%B2%E0%B8%99)
 - [npmPackages ที่ใช้ในโปรเจกต์](#-npm-Packages-%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B9%83%E0%B8%99%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%80%E0%B8%88%E0%B8%81%E0%B8%95%E0%B9%8C)
 - [การใช้งานภายในเว็บไซต์](#-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%A0%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%99%E0%B9%80%E0%B8%A7%E0%B9%87%E0%B8%9A%E0%B9%84%E0%B8%8B%E0%B8%95%E0%B9%8C)
 - [CREDIT](#-credit)

## 🛒 Fullstack Ecommerce Web Application

เว็บไซต์นี้เป็น **เว็บแอปพลิเคชัน Fullstack** ที่พัฒนาขึ้นเพื่อฝึกฝนและเรียนรู้การทำงานของระบบ Fullstack เบื้องต้น โดยมีฟีเจอร์ครบทั้งฝั่งผู้ใช้งานและแอดมิน พร้อมระบบจัดการสินค้าและคำสั่งซื้อ รวมถึงระบบความปลอดภัยเบื้องต้น

### 🧱 เทคโนโลยีที่ใช้

-   **Frontend:** Vite + React.js + Tailwind CSS
    
-   **Backend:** Node.js + Express.js
    
-   **Database:** PostgreSQL + Prisma ORM
    
-   **ภาพและไฟล์:** Cloudinary + Multer
    
-   **Auth & Security:** JWT, bcrypt, helmet, xss-clean, express-rate-limit
    
-   **Communication:** Axios (frontend ↔ backend)
    
-   **อื่น ๆ:** dotenv, CORS

## 🌟 ฟีเจอร์หลัก

### ✅ Auth & User

-   Register / Login / Forgot Password
    
-   Email Verification
    
-   Role-based Access (Admin / User)
    
-   JWT Authentication
    
-   OTP with time limit
    
-   Profile Picture Upload
    
-   Add/Edit Address
    

### 🛒 Product & Order

-   Add / Edit / Delete Product
    
-   Add Category & Subcategory
    
-   Order System + Order History
    
-   Quantity & Sales Tracking
    
-   Online Payment & Pay by Cash
    

### 🛡 ระบบป้องกันหลังบ้าน

-   ป้องกัน XSS, SQL Injection, Rate Limit, Helmet
    
-   ใช้ Prisma ORM แทน raw SQL เพื่อความปลอดภัย
    
-   ข้อมูลสำคัญจัดการผ่าน `.env`
    

### 🖼️ Image Handling (Cloudinary)

-   รองรับ Upload / Edit / Delete รูปภาพ
    
-   ระบบลบรูปเก่าจาก Cloudinary เมื่อมีการเปลี่ยนแปลง
    
-   แก้ปัญหาการสะสมไฟล์ใน Cloud (ที่ต้นฉบับไม่มี)
    

### ⚙️ Admin Features

-   จัดการ User: เปลี่ยน Role, Activate / Deactivate
    
-   ดูและจัดการ Orders
    
-   Dashboard แสดงยอดขายและสต็อกสินค้า
    

### 📱 Responsive Design

-   ปรับแต่ง UI ให้เหมาะทั้ง PC และ Mobile
    

----------

## 🔗 แรงบันดาลใจ

โปรเจกต์นี้อ้างอิงจากผลงานของ [Dynamic Coding with Amit](https://github.com/IsAmitprajapati/-Build-a-COMPLETE-Fullstack-ecommerce-Responsive-MERN-App-React-Redux-Nodejs-MongoDB-Express)  
ซึ่งเป็นระบบ MERN Stack โดยผมได้นำมาพัฒนาเพิ่มเติมในส่วนต่าง ๆ ให้มีความ **ยืดหยุ่น ปลอดภัย และใช้งานได้จริงมากยิ่งขึ้น** เช่น:

1.  เปลี่ยนจาก MongoDB → PostgreSQL + Prisma
    
2.  เพิ่มระบบความปลอดภัยเชิงลึก
    
3.  จัดการรูปภาพบน Cloudinary อย่างเหมาะสม
    
4.  ปรับ UI/UX ให้ใช้งานได้ดีทั้ง Desktop & Mobile


 
## ขั้นตอนการใช้งาน
```bash
git clone https://github.com/Chanon2003/Penguin87-fullstack-Ecom.git
cd Penguin87-fullstack-Ecom

cd client
npm install

cd server
npm install

#อย่าลืมเพิ่มหรือใช้ .env ของตัวเอง  
npm run dev

.env (frontend)
VITE_STRIPE_PUBLIC_KEY = ""
VITE_API_BACKEND_URL = 'http://localhost:8080' || ["you local host??"]

.env (backend)
PORT = 8080
DATABASE_URL="postgres://postgres:[password]@localhost:5432/[projectname]"
RESEND_API = ""
SECRET_KEY_ACCESS_TOKEN = ""
SECRET_KEY_REFRESH_TOKEN = ""

CLOUDINARY_CLOUD_NAME = ""
CLOUDINARY_API_KEY = ""
CLOUDINARY_API_SECRET_KEY = ""

STRIPE_SECRET_KEY = ""
STRIPE_ENPOINT_WEBHOOK_SECRET_KEY = ""

FRONTEND_URL = 'http://localhost:5173' || ["you local host??"]

*** "ผมใช้ prismaOrm ในการ connect"
npm  install prisma --save-dev 
npx prisma init
``

## 📦 npm Packages ที่ใช้ในโปรเจกต์
### ✅ **Frontend (React + Vite)**
```bash
#สร้างโปรเจกต์ + ติดตั้งพื้นฐาน
npm create vite@latest
npm install

#ติดตั้ง Tailwind CSS
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

#Routing
npm install react-router-dom

#Icon และ Animation
npm install react-icons
npm install react-type-animation

#Notifications
npm install react-hot-toast

#HTTP Client
npm install axios

#Redux Toolkit
npm install @reduxjs/toolkit
npm install react-redux

#Table UI
npm install @tanstack/react-table

#UI & Alerts
npm install sweetalert2
npm install react-infinite-scroll-component

#Form Handling
npm install react-hook-form

#Stripe Payment (Frontend)
npm install --save @stripe/react-stripe-js @stripe/stripe-js

```
### 🛠 **Backend (Express.js + Node.js)**
```bash
# สร้างโปรเจกต์ + ติดตั้งพื้นฐาน
npm init -y
npm install

# Core packages
npm install express cors dotenv morgan helmet express-validator
npm install cookie-parser
npm install jsonwebtoken bcryptjs
npm install pg

# Prisma ORM (สำหรับ PostgreSQL)
npm install prisma --save-dev
npx prisma init

# Email + API call
npm install resend
npm install axios xss
npm install express-rate-limit

# Image Upload & Cloudinary
npm install cloudinary
npm install multer

# Validation
npm install zod

# Security & Utilities
npm install crypto

# Stripe Payment (Backend)
npm install --save stripe

```
## ขั้นตอนการใช้งาน
```bash
git clone https://github.com/Chanon2003/PortFolio1.git
cd PortFolio1

npm install

📦 ใช้เทคโนโลยีหลัก ได้แก่:
-   Vite
-   React.js
-   Tailwind CSS
-   React Router DOM

*หากยังไม่ได้ติดตั้งแพ็กเกจเหล่านี้แบบแยก (หากยังไม่ได้อยู่ใน `package.json`):
npm install react-router-dom

npm run dev

```

## 📦 npm Packages ที่ใช้ในโปรเจกต์
### ✅ **Frontend (React + Vite)**
```bash
สร้างโปรเจกต์ + ติดตั้งพื้นฐาน
npm create vite@latest
npm install

ติดตั้ง Tailwind CSS
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

Routing
npm install react-router-dom

Icon และ Animation
npm install react-icons
npm install react-type-animation

Notifications
npm install react-hot-toast

HTTP Client
npm install axios

Redux Toolkit
npm install @reduxjs/toolkit
npm install react-redux

Table UI
npm install @tanstack/react-table

UI & Alerts
npm install sweetalert2
npm install react-infinite-scroll-component

Form Handling
npm install react-hook-form

Stripe Payment (Frontend)
npm install --save @stripe/react-stripe-js @stripe/stripe-js

```


## 🧭 การใช้งานภายในเว็บไซต์

เมื่อเข้าเว็บไซต์แล้ว สามารถเลื่อนดูเนื้อหาต่าง ๆ โดยสามารถปรับ **Responsive** ได้ทั้ง **pc** และ **mobile** รายละเอียดการใช้งานภายในตัวหน้าเว็บดังนี้:

### 1. 🔹 Register && Login
สมัครบัญชีและ login เพื่อเข้าถึงการสั่งซื้อ
![enter image description here](https://cdn.discordapp.com/attachments/1078550032820736083/1358431411505332458/image.png?ex=67f3d156&is=67f27fd6&hm=1f9d49a977b6be32656b8c087730c7d560d9e7e0a16c724b8a1211d7ae4251ee&)
### *Login*
![enter image description here](https://cdn.discordapp.com/attachments/1078550032820736083/1358431634780590331/image.png?ex=67f3d18c&is=67f2800c&hm=a64bf4b16de500deefeecb47ce439e35d44ac7cba8602c0820e0a327c3f73f84&)

### 2. 🔹 order
เลือกสินค้าที่ต้องการ ตามจำนวน เพิ่มในตะกล้าสินค้า สามารถดู รูปภาพ รายละเอียด จำนวนสินค้า ส่วนลด ราคา ได้ทีกดที่รูป order หรือสามารถ search by Text 
![enter image description here](https://cdn.discordapp.com/attachments/1078550032820736083/1358431954042749158/image.png?ex=67f3d1d8&is=67f28058&hm=4fe42a219fbe43f2d0ebe16c5308100fc4a2b3288820e8005bfc96e73bed4d66&)

### 3. 🔹 payment

ส่วนสุดท้ายจะเป็นการจ่ายเงินซึ่งต้อง add address มาอย่างน้อย 1 ที่ แล้วเลือกพร้อมกับ เลือกวิธีจ่ายเงินมี 2 ช่องทาง 1.จ่ายผ่านช่องทางออนไลน์ 2.ชำระเงินโดยเก็บเงินปลายทาง  หลังจากชำระเงืนเสร็จก็รอดู order
![enter image description here](https://cdn.discordapp.com/attachments/1078550032820736083/1358432287485591603/image.png?ex=67f3d227&is=67f280a7&hm=ca3c7ab6cec1b65916e71fb182fd0666ef615f50cef7a3a63b2c7a43209627e5&)
![enter image description here](https://media.discordapp.net/attachments/1078550032820736083/1358433008322875592/image.png?ex=67f3d2d3&is=67f28153&hm=1491ce0eef9a0370ba10c6060271e895f2b196d4d3bd488eb3473afe87a22ed5&=&format=webp&quality=lossless)


### ในส่วนของ ADMIN 
สามารถ Add Category,Add SubCategory,AddProduct รวมถึงจัดการ user 
![enter image description here](https://cdn.discordapp.com/attachments/1078550032820736083/1358433253819813918/image.png?ex=67f3d30e&is=67f2818e&hm=005f10f0dfeffdde9021c63a34e8bd09f57bc1ae9e7456ae40751eed3ff1515e&)

***ถ้าอยากดูเพิ่มเติมให้ไปดูที่ Port แล้วกด คลิกชื่อ Project จะปรากฎวิดิโอแนะนำ 🌐 Web Application เบื้องต้น***
https://port-folio1-one.vercel.app/



## 🙏 CREDIT


โปรเจกต์นี้ได้รับแรงบันดาลใจและอ้างอิงโค้ดมาจากผลงานของ [IsAmitprajapati](https://github.com/IsAmitprajapati)  
สามารถดูเพิ่มเติมได้ที่ช่อง YouTube: [Dynamic Coding with Amit](https://www.youtube.com/watch?v=sgJlE0utgHU&t)

ซึ่งโปรเจกต์นี้ได้รับการปรับปรุงและพัฒนาเพื่มเติมโดย:  
**ผู้สร้างโปรเจกต์: [Chanon](https://github.com/Chanon2003)**

