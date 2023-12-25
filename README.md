# Fake Stack Overflow
## About
Welcome to Fake Stack Overflow, a project dedicated to crafting a comprehensive replica of the renowned Stack Overflow platform. This endeavor spans both the frontend and backend of the website, leveraging React, Node.js, Axios, Express, and MongoDB to seamlessly integrate a robust database.

## Table of Contents
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Functionality](#functionality)

## Installation
The project uses MongoDB as the NoSQL database to store data related to this application. 
The repository has a server and client directory. Each directory has the `package.json` and `package-lock.json` files, which list the dependencies of the server and client applications, respectively. To install the necessary dependencies, run the following commands:

```bash
cd server
npm install
cd client
npm install
```
In addition also run these in the server directory
```bash
npm install bcrypt
npm install connect-mongo
npm install express-session
```

## Dependencies
Server:
- Axios
- Nodemon
- Express
- Mongoose
- Bcrypt
- Connect-mongo
- Express-session
Client:
- Axios
- Other Client Dependencies...
## Functionality
- Welcome Page: A landing page that asks users to either login, register or sign in as a guest.
- Questions Page: View and ask programming-related questions.
- 
- Answers Page: Provide answers to questions from the community.
- Profile Page: Manage your user profile and settings.
- Tags Page: Explore questions based on tags and categories.
