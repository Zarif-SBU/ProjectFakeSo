# Fake Stack Overflow
Fake Stack Overflow is a QandA website similar to Stack Overflow. 

## What I learned
- frontend and backend webdevelopment in JavaScript.
- worked in NodeJS framework
- Used **React**, **Axios** and **Express** libraries to setup backend and frontend communication
- Maintained a NoSQL database using **MongoDB**
- Provide security using cookies, password hashing and sessions

## Dependencies
Server:
- Cors, Nodemon, Express, Mongoose, Bcrypt, Connect-mongo, Express-session
Client:
- Axios

## How to run
Install dependencies
```bash
cd server
npm install
cd client
npm install
```
Install mongodb following this tutorial https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#std-label-install-mdb-community-windows

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

## Functionality
- Welcome Page: A landing page that asks users to either login, register or sign in as a guest.
- Questions Page: View and ask programming-related questions.
  - You can display questions in newest, active(most recently answered) and unanswared(questions with 0 answers) order. Questions are displayed 5 at a time.
  - The menu lets you display either the questions page or tags page
  - Top left also has a button to go to profile page and a logout button
  - The search bar on the top right searches for all the questions that contain the words in the search bar. you can also put squarebrackets around a word to specify the word is a tag and   searches all tags that match the word.
  - Ask question button takes you to a page to post a new question
- Answers Page: Provide answers to questions from the community.
  - Answers and question also contain comments which are displayed 3 at a time.
  - You can upvote and downvote questions and answers and only up vote comments. Voting also affects the reputation of the user that posted the question or answer. Downvote takes away 10 from user reputation repuation while upvote adds 5 to users reputation. You can only comment if you have 50 or more reputation.
  - You can post a new answer using a post answer button at the bottom of the page. Answers are displayed 5 at a time.
- Profile Page: Displays reputation, date your account was created, all your tags, questions and answers. You can edit or delete your questions, answers and tags.
- Tags Page: Click on a tag to display all questions with that specific tag.
