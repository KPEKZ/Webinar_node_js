const express = require('express');
const path = require('path');
const consolidate = require('consolidate');
const port = process.env.port || 8080;
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/task');
const passport = require('./auth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

mongoose.connect('mongodb://localhost:32769/userInfo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



//**************static files**************//

app.use(express.static(path.resolve(__dirname))); //css
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('hbs',consolidate.handlebars);
app.set('view engine','hbs');
app.set('views',path.resolve(__dirname + '/views'));
mongoose.set('useFindAndModify', false);
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'secret', // тут ключики
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize);
app.use(passport.session);

const mustBeAuthenticated = (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/auth');
    }
  };


  //***************tasks**************//
app.use('/tasks', mustBeAuthenticated);


app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.redirect('/tasks');
  });
  
  app.post('/tasks/complete', async (req, res) => {
    await Task.updateOne({_id: req.body.id}, {$set: { completed: true }});
    res.redirect('/tasks');
  });
  
  app.post('/tasks/delete', async (req, res) => {
    await Task.deleteOne({_id: req.body.id});


    res.redirect('/tasks');
  });

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();

    res.render('tasks', { tasks: createTask(tasks)});
  });


  function createTask(task)  //является ли извращением?
  {
      return newTask = task.map(el=>{
          return {
              completed: el.completed,
              title: el.title,
              _id: el._id
          }
      })
  }

  //***************tasks**************//



    function createNewModel(model) //handlebars ругался на безопасность, пришлось создавать функцию,
    {                               // в ней новую модель и передавать в render
        return newUserModel = model.map(el=>{  
            return {                     
                username : el.username,    
                firstname : el.firstname,
                lastname: el.lastname,
                id: el.id,
                avatar: 'http://placekitten.com/64/64',
                email: el.email,
                bio: el.bio,
                password: el.password
            }
    })
}


//***************auth**************//
app.get('/auth',async (req, res)=>{
    const error = !!req.query.error;
    res.render('auth', {error});
app.post('/auth',passport.authenticate);

});
//***************auth**************//


//***************users**************//

app.get('/users', async (req, res)=>{
    try {
        const users = await User.find();
        res.render('User',{ 
            rate :createNewModel(users)
        });
        
    } catch (error) {
        throw error;
    }
    
    
});

app.get('/users/:id', async (req, res)=>{
    const user = await User.findById(req.params.id);

    let arr = new Array();
    arr.push(user);
    res.render('User',{ 
        rate :createNewModel(arr)
     });
});

//***************users**************//



//***************register**************//

app.post('/register', async(req,res)=>{
    const user = new User(req.body);
    const savedUser = await user.save();
    res.redirect('/auth');
})

app.get('/register',async (req, res)=>{
    res.render('register');

});

//***************register**************//



// app.post('/addUser', async (req, res)=>
// {

//     const user = new User(req.body);
//     await user.save();
//     res.redirect('/users');
    
// });


//***************update**************//

app.get('/update/:id', async (req, res)=>
{

    const user = await User.findById(req.params.id);
    
    let arr = new Array();
    arr.push(user);
    let mod = createNewModel(arr);
    res.render('up',{ 
        rate :mod
     });
    
});

app.post('/update', async (req, res)=>
{

    const upModel = {
            
           username: req.body.username,
            firstname : req.body.firstname,
            lastname: req.body.lastname,
            //id: req.body.id,
            avatar: 'http://placekitten.com/64/64',
            email: req.body.email,
            bio: req.body.bio,
            password: req.body.password
        
    }

    //const user = await User.findOneAndUpdate({id: req.body.id},upModel);
   // console.log('User: ', user);
   await User.updateOne({_id: req.body.id}, {$set: {username: req.body.username,
    firstname : req.body.firstname,
    lastname: req.body.lastname,avatar: 'http://placekitten.com/64/64',
    email: req.body.email,
    bio: req.body.bio,
    password: req.body.password
 }});
    // await User.findByIdAndUpdate(req.body.id, upModel, (err, todo)=>{
    //     if (err) return res.status(500);
    // })

  res.redirect('/users');
});

//***************update**************//


//**************delete**************//
app.post('/deleteAll', async (req,res)=>{  //удаление коллекции бд
    
    await mongoose.connection.db.users.drop();

    // await mongoose.connection.db.dropCollection('users', (err,result)=>{
    //     if (err) return res.status(500);
    // })
    console.log('collection was cleared!');
    res.redirect('/users');
});

app.post('/delete/:id',async(req,res)=>
{
    await User.findByIdAndRemove(req.params.id, (err, todo)=>
    {
        if (err) throw res.status(500).send(err);
    });
    
    console.log('user deleted!');
    res.redirect('/users');
});

//**************delete**************//



app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth');
  });


app.listen(port,()=>{
    console.log(`server has been started on the ${port} port`);
    
});

