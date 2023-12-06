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


app.use(cors());
app.use(express.json());

let tags = require('./models/tags');
let answers = require('./models/answers');
let questions = require('./models/questions');
let users= require('./models/users');

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
    secret: "supersecret difficult to guess string",
    cookie: {},
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

app.get('/tags', async (req, res) => {
  try {
    
    res.json(await tags.find());
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

app.post("/questions/:questionId", async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const question = await questions.findByIdAndUpdate(questionId);
    res.json(question);
  } catch (err) {
    console.error("Error incrementing views", err);
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
      const newStuff = new questions(newQuestion); // Use 'questions' instead of 'Question'
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

app.post("/login", async (req, res) => {
  const uid= req.body.userName;
  const epw= req.body.passwordHash;
  const user = (await users.find({userName: uid}).exec())[0];
  if(user===null || user ===undefined){
    res.status(401).json({error: 'Invalid credentials'});
  }

  else{
  const verdict = await bcrypt.compare(epw, user.passwordHash);
  console.log("THE VERDICT IS: ", verdict);
  try {
    if(verdict) {
      req.session.user = uid.trim();
      res.status(200).send('Login successful!');
    }
    else {
      res.status(401).json({error: 'Invalid credentials'});
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
});

// app.post("/logout", async(req, res)=>{
//   req.session.destroy(err =>{
//     console.log("Session has been destroyed")
//   });
// });