# Fake Stack Overflow
## About
Fake Stack Overflow is a project to create a Stack-Overflow like website. This project spans both the frontend and backend of the website, using React, Node.js, Axios, Express, and MongoDB.

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
## Dependencies
Server:
- Cors
- Nodemon
- Express
- Mongoose
- Bcrypt
- Connect-mongo
- Express-session
Client:
- Axios

## Starting the website
in the client directory
```bash
npm start
```
in the client directory
```bash
mongod --bind_ip 127.0.0.1     
```
in root directory 
```bash
mongosh
nodemon server/server.js
```
if you get an error from nodemon then open up command prompt in administrative mode and type the same command in the root directory

## Code

## Functionality
- Welcome Page: A landing page that asks users to either login, register or sign in as a guest.
  <img width="1280" alt="image" src="https://github.com/Zarif-SBU/ProjectFakeSo/assets/123431894/c2a09686-28f9-4b58-a4f7-30b846c69b13">
  - Registration checks if user entered a valid email format, if the password includes username or email or not.
  <img width="1280" alt="registration_Page" src="https://github.com/Zarif-SBU/ProjectFakeSo/assets/123431894/2f434ca7-8236-4d56-8ecc-b467438fe6f9">
  - Login: sends a server request to see if user with that email or password exists and if not then an error is displayed saying "email or password is incorrect"
  <img width="1280" alt="login_Page" src="https://github.com/Zarif-SBU/ProjectFakeSo/assets/123431894/916603fd-d962-48be-82e0-5b493e69273a">
- Questions Page: View and ask programming-related questions.
  <img width="1280" alt="questions_Page" src="https://github.com/Zarif-SBU/ProjectFakeSo/assets/123431894/c7793a57-a805-45e3-ad07-059fb5067ca1">
  - You can display questions in newest, active(most recently answered) and unanswared(questions with 0 answers) order. Questions are displayed 5 at a time.
  - The side menu lets you display either the questions page or tags page
  - Top left also has a button to go to profile page and a logout button
  - The search bar on the top right searches for all the questions that contain the words in the search bar. you can also put squarebrackets around a word to specify the word is a tag and   searches all tags that match the word.
  - Ask question button takes you to a page to post a new question
    <img width="1279" alt="ask_question" src="https://github.com/Zarif-SBU/ProjectFakeSo/assets/123431894/bf012203-6a0f-48c1-b05b-968711db85a2">
- Answers Page: Provide answers to questions from the community.
  - Answers and question also contain comments which are displayed 3 at a time.
  - You can upvote and downvote questions and answers and only up vote comments. Voting also affects the reputation of the user that posted the question or answer. Downvote takes away 10 from user reputation repuation while upvote adds 5 to users reputation. You can only comment if you have 50 or more reputation.
  - You can post a new answer using a post answer button at the bottom of the page. Answers are displayed 5 at a time.
  <img width="1280" alt="answer_Page" src="https://github.com/Zarif-SBU/ProjectFakeSo/assets/123431894/43ed89df-1ddc-4975-8f44-7c1d190eecf4">
- Profile Page: Displays reputation, date your account was created, all your tags, questions and answers. You can edit or delete you questions, answers and tags as well by clicking on them.
  <img width="1280" alt="profile_Page" src="https://github.com/Zarif-SBU/ProjectFakeSo/assets/123431894/78382c18-1be9-4158-9661-c8cfbe9e839d">
  <img width="1280" alt="profile_Page2" src="https://github.com/Zarif-SBU/ProjectFakeSo/assets/123431894/6420ac82-0f55-420e-ad54-b1d44c3a824b">

- Tags Page: Click on a tag to display all questions with that specific tag.
  <img width="1280" alt="tags_Page" src="https://github.com/Zarif-SBU/ProjectFakeSo/assets/123431894/ede57064-e9c6-4fa8-91b2-d917a50b4d8f">
