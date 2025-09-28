# Internet Café Booking System

## Team Members
- **Aung Myint Myat**
- 6530126

---

## Project Description
The **Internet Café Booking System** is a web-based application built with **Next.js** and **MongoDB** to manage customer records and PC bookings in an internet café.

---

## Features
- **Customer Management:** Add and view customers.  
- **PC Slots (1–20):** 20 fixed computers represented as green (available) or red (occupied).  
- **Booking System:**  
  - Select customer and book a PC.  
  - Occupied PCs turn red automatically.  
  - Delete bookings when finished → PC turns back green.  
- **Simple UI:** Two tabs (Customers and Bookings) with a clean card-style layout.  
- **Deployment:** Hosted on **Azure VM** with **Nginx reverse proxy** and **PM2 process manager**.  

---

## Tech Stack
- **Frontend:** Next.js (React)  
- **Backend:** Next.js API routes + Mongoose  
- **Database:** MongoDB Atlas  
- **Server:** Azure Virtual Machine (Linux, Ubuntu)  
- **Deployment Tools:** PM2, Nginx  

---

## Screenshots
_Add UI screenshots here (Customers page, Bookings page, PC slots)._  

---

## Deployment Link
👉 [Production App](http://wad-aung.southeastasia.cloudapp.azure.com/bookings)  

---

## How to Use
1. Go to **Customers** tab → add a customer.  
2. Switch to **Bookings** tab → pick a customer and an available PC.  
3. Confirm booking → PC slot turns red.  
4. End session by clicking **Delete** → PC slot turns back green.  

---

## Video Demo
👉 Upload an **unlisted video** to YouTube and paste the link here.  
