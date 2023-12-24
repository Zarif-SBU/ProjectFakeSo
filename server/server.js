// Run this script to launch the server.ags.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
var cors = require('cors');
const bcrypt = require('bcrypt');
const port = 8000;

const saltRounds = 10;
const sessionSecret = process.argv[2];

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true,
}));

app.use(express.json());

let tags = require('./models/tags');
let answers = require('./models/answers');
let questions = require('./models/questions');
let users= require('./models/users');
let comments = require('./models/comments');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//TERMINATE GRACEFULLY
process.on('SIGINT', ()=>{  
  console.log('Server closed. Database instance disconnected');
  server.close(()=>{
      db.close(() => {
        process.exit(0);
      });
    });
});


let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to database'))
  .catch(error => console.error('Error connecting to database:', error));
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.on('connected', function() {
  console.log('Connected to database');
});

app.use(
  session({
    secret: "${secret}",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      domain: 'localhost',
      secure: false, // Set to true if using HTTPS
      httpOnly: true,

    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/fake_so'})
  })
);


const addMsgToRequest = function (req, res, next) {
  req.msg = 'Intercepted Request';
  next();
}

const addMsgToResponse = function(req, res, next) {
  res.msg = 'Intercepted Response';
  next();
}



app.get('/questions', async (req, res) => {
  try {
    const test= await questions.find();
    res.json(test);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/answers', async (req, res) => {
  try {
    res.json(await answers.find());
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/users', async (req, res)=>{
  try{
    res.json(await users.find());
  }
  catch(error){
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tags', async (req, res) => {
  try {
    
    res.json(await tags.find());
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/comments', async (req, res) => {
  try {
    res.json(await comments.find());
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/getreputation/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const user = (await users.find({ email: userEmail }).exec())[0];
    if (user) {
      res.json(user.reputation);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching reputation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('user/:email/getUserName', async (req, res) =>{
  try {
    if(req.params.email === "Guest"){
      res.json("Guest");
    }
    else{
      const user = (await users.find({email: req.params.email}).exec())[0];
      res.json(user.userName);
    }
  } catch(error) {
    console.error("Error getting user name", error);
    res.status(500).json({ message: 'Server Error' });
  }

});

app.use("/createQuestion", addMsgToRequest);
app.use('/createQuestion', addMsgToResponse);

app.post("/questions/:questionId/increment-views", async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const question = await questions.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json(question);
  } catch (err) {
    console.error("Error incrementing views", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post("/question/increment-vote", async (req, res) => {
  const questionId = req.body.question._id;
  const email = req.body.userEmail;
  
  let question;
  let user;
  let userReputation;
  question = await questions.findById(questionId);
  user = await users.findOne({ email: question.userEmail });
  if (question.upVoteEmails.includes(email)) {
    question = await questions.findByIdAndUpdate(
      questionId,
      {
        $inc: { votes: -1 },
        $pull: { upVoteEmails: email },
      },
      { new: true }
    );
    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: -5 } },
      { new: true, select: 'reputation' }
    );

  } else if (question.downVoteEmails.includes(email)) {
    question = await questions.findByIdAndUpdate(
      questionId,
      {
        $inc: { votes: 2 },
        $pull: { downVoteEmails: email },
        $addToSet: { upVoteEmails: email },
      },
      { new: true }
    );
    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: 15 } },
      { new: true, select: 'reputation' }
    );
  } else {
    question = await questions.findByIdAndUpdate(
      questionId,
      {
        $inc: { votes: 1 },
        $addToSet: { upVoteEmails: email },
      },
      { new: true }
    );
    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: 5 } },
      { new: true, select: 'reputation' }
    );
  }
  res.json({ question, userReputation });
});

app.post("/question/decrement-vote", async (req, res) => {
  const questionId = req.body.question._id;
  const email = req.body.userEmail;

  let question;
  let user;
  let userReputation;

  question = await questions.findById(questionId);

  question = await questions.findById(questionId);
  user = await users.findOne({ email: question.userEmail });

  if (question.downVoteEmails.includes(email)) {
    question = await questions.findByIdAndUpdate(
      questionId,
      {
        $inc: { votes: 1 },
        $pull: { downVoteEmails: email },
      },
      { new: true }
    );

    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: 10 } },
      { new: true, select: 'reputation' }
    );
  } else if (question.upVoteEmails.includes(email)) {
    question = await questions.findByIdAndUpdate(
      questionId,
      {
        $inc: { votes: -2 },
        $pull: { upVoteEmails: email },
        $addToSet: { downVoteEmails: email },
      },
      { new: true }
    );

    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: -15 } },
      { new: true, select: 'reputation' }
    );
  } else {
    question = await questions.findByIdAndUpdate(
      questionId,
      {
        $inc: { votes: -1 },
        $addToSet: { downVoteEmails: email },
      },
      { new: true }
    );

    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: -10 } },
      { new: true, select: 'reputation' }
    );
  }

  res.json({ question, userReputation });

});

app.post("/answer/increment-vote", async (req, res) => {
  const answerId = req.body.answer._id;
  const email = req.body.userEmail;

  let answer;
  let user;
  let userReputation;
  answer = await answers.findById(answerId);
  user = await users.findOne({ email: answer.userEmail });
  if (answer.upVoteEmails.includes(email)) {
    answer = await answers.findByIdAndUpdate(
      answerId,
      {
        $inc: { votes: -1 },
        $pull: { upVoteEmails: email },
      },
      { new: true }
    );
    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: -5 } },
      { new: true, select: 'reputation' }
    );
  } else if (answer.downVoteEmails.includes(email)) {
    answer = await answers.findByIdAndUpdate(
      answerId,
      {
        $inc: { votes: 2 },
        $pull: { downVoteEmails: email },
        $addToSet: { upVoteEmails: email },
      },
      { new: true }
    );
    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: 15 } },
      { new: true, select: 'reputation' }
    );
  } else {
    answer = await answers.findByIdAndUpdate(
      answerId,
      {
        $inc: { votes: 1 },
        $addToSet: { upVoteEmails: email },
      },
      { new: true }
    );
    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: 5 } },
      { new: true, select: 'reputation' }
    );
  }

  res.json({ answer, userReputation });
});

app.post("/answer/decrement-vote", async (req, res) => {
  const answerId = req.body.answer._id;
  const email = req.body.userEmail;

  let answer;
  let user;
  let userReputation;
  answer = await answers.findById(answerId);
  user = await users.findOne({ email: answer.userEmail });

  if (answer.downVoteEmails.includes(email)) {
    answer = await answers.findByIdAndUpdate(
      answerId,
      {
        $inc: { votes: 1 },
        $pull: { downVoteEmails: email },
      },
      { new: true }
    );
    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: 10 } },
      { new: true, select: 'reputation' }
    );
  } else if (answer.upVoteEmails.includes(email)) {
    answer = await answers.findByIdAndUpdate(
      answerId,
      {
        $inc: { votes: -2 },
        $pull: { upVoteEmails: email },
        $addToSet: { downVoteEmails: email },
      },
      { new: true }
    );
    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: -15 } },
      { new: true, select: 'reputation' }
    );
  } else {
    answer = await answers.findByIdAndUpdate(
      answerId,
      {
        $inc: { votes: -1 },
        $addToSet: { downVoteEmails: email },
      },
      { new: true }
    );
    userReputation = await users.findByIdAndUpdate(
      user._id,
      { $inc: { reputation: -10 } },
      { new: true, select: 'reputation' }
    );
  }

  res.json({ answer, userReputation });
});

app.post("/comment/increment-vote", async (req, res) => {
  const commentId = req.body.comment._id;
  const email = req.body.userEmail;

  let comment;

  comment = await comments.findById(commentId);

  if (comment.upVoteEmails.includes(email)) {
    comment = await comments.findByIdAndUpdate(
      commentId,
      {
        $inc: { votes: -1 },
        $pull: { upVoteEmails: email },
      },
      { new: true }
    );
  } else {
    comment = await comments.findByIdAndUpdate(
      commentId,
      {
        $inc: { votes: 1 },
        $addToSet: { upVoteEmails: email },
      },
      { new: true }
    );
  }

  res.json(comment);
});

app.post("/questions/:questionId", async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const question = await questions.findByIdAndUpdate(questionId);
    res.json(question);
  } catch (err) {
    console.error("Error fetching questions", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post("/answers/:answerId", async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const answer = await questions.findByIdAndUpdate(answerId);
    res.json(answer);
  } catch (err) {
    console.error("Error fetching answer", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.use("/questions/:questionId/add-answer", addMsgToRequest);
app.use("/questions/:questionId/add-answer", addMsgToResponse);


app.post("/questions/:questionId/add-answer", async(req, res) =>{
  try{
    const newAns = req.body.answerId;
    const questionIdAns = req.params.questionId;
    // Find the question by ID and push the new answer to the answers array
    const questionTwo = await questions.findByIdAndUpdate(
      questionIdAns,
      { $push: { answers: newAns } },
      { new: true }
    );


    if (!questionTwo) {
      // If the question with the given ID is not found
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(questionTwo);
  }
  catch(err){
    console.error("Error adding answer", err);
    res.status(500).json({ message: 'Server Error' });
  }


});



app.post('/createQuestion', async (req, res) => {
  try {
      const newQuestion = req.body;
      if(newQuestion.asked_by === "Guest"){
        newQuestion.asked_by="Anonymous";
      }
      else{
        const user = await users.findOne(
          { email: newQuestion.userEmail },
          { userName: 1, _id: 0 }
        );
        newQuestion.asked_by = user.userName;
      }
      
      const newStuff = new questions(newQuestion);
      await newStuff.save();
      console.log('Question created successfully');
      res.status(201).json({ message: 'Question created successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
});


app.use("/createAnswer", addMsgToRequest);
app.use("/createAnswer", addMsgToResponse);

app.post("/createAnswer", async (req, res) => {
  try {
      const newAnswer = req.body;
      if(newAnswer.ans_by === "Guest"){
        newAnswer.ans_by = "Anonymous";
      }
      else{
        const user = await users.findOne(
          { email: newAnswer.userEmail },
          { userName: 1, _id: 0 }
        );
        newAnswer.ans_by = user.userName;
      }
      const newAnswerStuff = new answers(newAnswer);
      await newAnswerStuff.save();
      console.log('Answer created successfully');

      res.status(201).json({ message: 'Answer created successfully', answerId: newAnswerStuff._id });
  } catch (err) {
    console.error('Error creating answer:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.use("/createTag", addMsgToRequest);
app.use('/createTag', addMsgToResponse);

app.post("/createTag", async (req, res) => {
  try {
    const newTag = req.body;
    const newTagStuff = new tags(newTag);
    await newTagStuff.save();
    console.log('Tag created successfully');

    res.status(201).json({ message: 'Tag created successfully', tagId: newTagStuff._id });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.post('/addUserToTag', async (req, res) => {
  try {
      const { name, userEmail } = req.body;
      const tag = await tags.findOne({ name });
      if (!tag) {
          return res.status(404).json({ error: 'Tag not found' });
      }
      if (!tag.userEmails.includes(userEmail)) {
          tag.userEmails.push(userEmail);
          const updatedTag = await tag.save();
          return res.json({ message: 'User added to tag successfully', updatedTag });
      } else {
          return res.status(400).json({ error: 'UserEmail already exists in the tag' });
      }
  } catch (error) {
      console.error('Error adding user to tag:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/createComment', async (req, res) => {
  try {
    const text = req.body.text;
    const email = req.body.userEmail;
    const user = await users.findOne(
      { email: email},
      { userName: 1, _id: 0 }
    );
    
    const userName = user.userName;
    let newComment = new comments({
      text: text,
      comment_by: userName,
      comment_date_time: new Date(),
      votes: 0,
      userEmail: email
    });

    let savedComment = await newComment.save();
    const id = req.body.id;
    const isItQuestion = req.body.isItQuestion;
    if(isItQuestion) {
      await questions.findByIdAndUpdate(
        id,
        { $push: { comments: savedComment._id } },
        { new: true }
      );
    }
    else {
      await answers.findByIdAndUpdate(
        id,
        { $push: { comments: savedComment._id } },
        { new: true }
      );
    }
    res.json({ message: 'Comment created successfully', comment: savedComment });
  } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/questions/:questionId', async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const question = await questions.findById(questionId);
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post("/guest", async (req,res)=>{
  const name=req.body.email;
  try{
    req.session.user=name.trim();
    res.status(200).send("Guest Login Successful");
    res.send(req.session.sessionID);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
  

});

app.post("/login", async (req, res) => {
  const email= req.body.email;
  const epw= req.body.passwordHash;
  const user = (await users.find({email: email}).exec())[0];
  if(user===null || user ===undefined){
    res.status(401).json({error: 'Invalid credentials'});
  }

  else{
  const verdict = await bcrypt.compare(epw, user.passwordHash);
  try {
    if(verdict) {
      req.session.user = email.trim();
      res.status(200).send('Login successful!');
      res.send(req.session.sessionID);
    }
    else {
      res.status(402).json({error: 'Invalid credentials'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}
});

app.post("/register", async (req, res) =>{
  const salt= await bcrypt.genSalt(saltRounds);
  const uName=req.body.userName;
  const emailName= req.body.email;
  if (await users.findOne({email: emailName})) {
    res.status(409).send('User with that email already exists');
  } else {
    const pwHash=await bcrypt.hash(req.body.passwordHash, salt);
    const newUser = new users({
      userName:uName,
      email: emailName,
      passwordHash: pwHash,
    });

    try {
      await newUser.save();
      res.status(201).send('Registration successful');
    }
    catch (err) {
      res.status(500).send('Error registering User');
    }
  }
});

app.get('/session', async (req, res) => {
  let loginS=true;
  let name="";
  //N is user name, D is user date, and R is user reputation
  let userN="";
  let userD="";
  let userR=0;
  let userA=false;
  let userObj=null;

  if(req.session.user){
      loginS=false;
      name=req.session.user;
      if(req.session.user ==="Guest"){
        userN="Guest";
      }
      else{
        userObj= (await users.find({email: req.session.user}));
        userN= (await users.find({email: req.session.user}).exec())[0].userName;
        userD= (await users.find({email: req.session.user}).exec())[0].date;
        userR= (await users.find({email: req.session.user}).exec())[0].reputation;
        userA = (await users.find({email: req.session.user}).exec())[0].admin;
      }
  }
  else{
      loginS=true;
      name="Guest";
  }
  res.json({ session: req.session, login: loginS, userStuff: name, userNN: userN, userDD: userD, userRR: userR, userAA: userA, 
    userOO: userObj });
});


app.post("/logout", async (req, res) => {
  req.sessionStore.destroy((err) => {
    console.log("error stuff: ", err)
  });
  res.status(200).send('Log out Successful');

});

app.get("/users/getQuestions/:userEmail", async (req, res)=>{
  try {
    let email=req.params.userEmail;
    let test=await questions.find({userEmail: email});
    res.json(test);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/users/getTags/:userEmail", async (req, res) =>{
  try{
    const email = req.params.userEmail;
    const userTags = await tags.find({ userEmails: email });
    res.json({ userTags });
  }
  catch(error){
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/users/getAnswers/:userEmail", async (req, res)=>{
  try {
    let userEmail = req.params.userEmail;
    res.json(await answers.find({userEmail: userEmail}));
  }
  catch(error) {
    console.error('Error fetching answers: ', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});


app.get("/users/getAnsweredQuestions/:answerIds", async (req, res) => {
  try {
    const answerIds = req.params.answerIds.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
    const questionsArray = await questions.find({ answers: { $in: answerIds } });
    res.json(questionsArray);
  } catch (error) {
    console.error('Error fetching questions: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/editQuestion/:questionID", async (req, res) => {
  try{
    //find the question first by locating it through ID
    const questionID=req.params.questionID;
    const qstStuff=req.body;

    const question = await questions.findByIdAndUpdate(questionID,
      {title: qstStuff.title,
       text: qstStuff.text, 
       tags: qstStuff.tags,
       ask_date_time: qstStuff.ask_date_time,
       summary: qstStuff.summary
      },
      {new: true}
      );
      console.log('Question updated successfully');
      res.status(201).json({ message: 'Question updated successfully' });
  }
  catch(error){
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/editAnswer/:answerID", async (req, res) => {
  try{
    //find the question first by locating it through ID
    const answerID=req.params.answerID;
    const ansStuff=req.body;

    const answer = await answers.findByIdAndUpdate(answerID,
      {
       text: ansStuff.text, 
       ans_date_time: ansStuff.ans_date_time,
      },
      {new: true}
      );
      console.log('Answer updated successfully');
      res.status(201).json({ message: 'Answer updated successfully' });
  }
  catch(error){
    console.error('Error updating answer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/deleteQuestion/:questionId", async (req, res) =>{
  try {
    const questionId = req.params.questionId;

    // Use findByIdAndDelete to find and delete the question
    const deletedQuestion = await questions.findByIdAndDelete(questionId);

    if (deletedQuestion) {
      res.json({ message: 'Question deleted successfully', deletedQuestion });
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/deleteUser/:userId", async(req, res) =>{
  try{
    
    const userId=req.params.userId;
    //then we get the username
    const user = await users.findById(userId);

    const userEmail= user.email;
    console.log("this is the user email: ", userEmail);

    //we then delete the user from the database
    const deletedUser = await users.findByIdAndDelete(userId);
    //then search through the questions model and delete the question with the associated userName
    const deletedQuestions = await questions.deleteMany({ userEmail: userEmail });
    console.log("these are the deleted questions: ", deletedQuestions);

    if(deletedUser){
      res.json({message: "User deleted successfully", deletedUser, deletedQuestions});
    }
    else{
      res.status(404).json({error: "User not found"});
    }
  }
  catch(error){
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/deleteAnswer/:answerId", async (req, res)=>{
  try {
      const answerId = req.params.answerId;
      // Use findByIdAndDelete to find and delete the answer
      const deletedAnswer = await answers.findByIdAndDelete(answerId);
      // remove the answer from the question array
      

      if (deletedAnswer) {
        await questions.updateMany({}, { $pull: { answers: answerId } });
        res.json({ message: 'Answer deleted successfully', deletedAnswer });
      } else {
        res.status(404).json({ error: 'Answer not found' });
      }
    } catch (error) {
      console.error('Error deleting Answer:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/deleteTag", async (req, res) =>{
  try{
    //we get the tag object
    const tagObj=req.body;
    //if there are more than one user on the tag, then we don't delete it
    if(tagObj.userEmails.length>1){
      res.status(404).send("Tag is being used");
    }
    else{
      //first removes that ID from the database entirely from tags
      const deletedTag= await tags.findByIdAndDelete(tagObj._id);
      console.log("This is the deleted tag they found: ", deletedTag);
      
      res.status(200).send("Tag is good");
    }
  }
  catch(error){
      console.error('Error deleting Tag:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/editTag/:tagName", async (req, res)=>{
  try {
    //req.params will have the tagObj id from before and req.body will have the new tag
    const tagId = req.params.tagName;
    const tagObj= await tags.findById(tagId);
    // const tagIt = await tags.findOne({ name: tagName });

    // If there are more than one user on the tag, then we don't delete
    if (tagObj.userEmails.length > 1) {
      res.status(404).send("Tag is being used");
    } else {
      const reTag = await tags.findByIdAndUpdate(
        tagObj._id,
        {
          name: req.body.name,
        },
        {
          new: true,
        }
      );
      console.log('Tag updated successfully');
      res.status(201).send("Tag is Good");
    }
  } catch (error) {
    console.error('Error editing Tag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});