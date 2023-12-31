// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
//TO RUN THE SCRIPT FOR ADMIN, USE THE SCRIPT BELOW THIS COMMENT WHERE YOU WOULD GIVE THE EMAIL AND PASSWORD TO BE UTILIZED FOR ADMIN PRIVLAGES
//****** node server/init.js mongodb://127.0.0.1:27017/fake_so <adminEmail> <adminPassword> *******/


let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let Comment = require('./models/comments');
let User= require('./models/users');

const bcrypt = require('bcrypt');
const saltRounds = 10;

//the commandline after the mongo database is email and password
const adminUsername = userArgs[1];
const adminPassword = userArgs[2];

if (!adminUsername || !adminPassword) {
  console.log('Please provide both username and password for the admin user.');
  process.exit(1);
}

let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
let comments =[];

async function userCreate(name, emailT, password, reputation, signUp, adminT){
    const pwHash= await bcrypt.hash(password, saltRounds);

    let user= new User({
        userName: name, 
        email: emailT,
        passwordHash: pwHash,
        reputation: reputation,
        signDate: signUp,
        admin: adminT
    });

    return await user.save();
}

function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, userEmail) {
  answerdetail = {text:text,
                  userEmail: userEmail      };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views, userEmail) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
    userEmail: userEmail
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

const populate = async () => {
  
  let t1 = await tagCreate('react');
  let t2 = await tagCreate('javascript');
  let t3 = await tagCreate('android-studio');
  let t4 = await tagCreate('shared-preferences');
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'hamkalo', false, "bobrede120@gmail.com");
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'azad', false, "fff@gmail.com");
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'abaya', false);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'alia', false);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', 'sana', false);
  await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], 'Joji John', false, false, 0, "pppp@gmail.com");
  await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], 'saltyPeter', false, 121, "ooo@gmail.com");
  
  //Allows you to create an admin user
  await userCreate("Test Admin", adminUsername, adminPassword, 50, new Date(), true);
  //already set admin
  await userCreate("The Gamer", "moto@gmail.com", "password", 50, new Date(), true);
  await userCreate("User Guy", "eh@gmail.com", "apple", 50, new Date(), false);

  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');