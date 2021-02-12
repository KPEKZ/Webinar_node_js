const express = require('express');
const app = express();
//const mysql = require('mysql');
const path = require('path');
const consolidate = require('consolidate');
const request = require('request');
const cheerio = require('cheerio');
//const Task = require('./models/tasks.js');
const port = process.env.port || 8080;
const mongoose = require('mongoose');
const User = require('./models/User'); // без .js


mongoose.connect('mongodb://localhost:32769/userInfo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


//static files
app.use(express.static(path.resolve(__dirname))); //css
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('hbs',consolidate.handlebars);
app.set('view engine','hbs');
app.set('views',path.resolve(__dirname + '/views'));


    function createNewModel(model) //handlebars ругался на безопасность, пришлось создавать функцию,
    {                               // в ней новую модель и передавать в render
        return newUserModel = model.map(el=>{  
            return {                         
                firstname : el.firstname,
                lastName: el.lastName,
                id: el.id,
                avatar: 'http://placekitten.com/64/64',
                email: el.email,
                bio: el.bio
            }
    })
}


app.get('/users', async (req, res)=>
{
    const users = await User.find();
    
    res.render('User',{ 
        rate :createNewModel(users)
     });

 
    
});

app.get('/users/:id', async (req, res)=>
{
    const user = await User.findById(req.params.id);
    let arr = new Array();
    arr.push(user);
    res.render('User',{ 
        rate :createNewModel(arr)
     });
});

app.post('/addUser', async (req, res)=>
{

    const user = new User(req.body);
    await user.save();
    res.redirect('/users');
    
});

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
                          
            firstname : req.body.firstname,
            lastName: req.body.lastname,
            //id: req.body.id,
            avatar: 'http://placekitten.com/64/64',
            email: req.body.email,
            bio: req.body.bio
        
    }

    console.log(upModel);
    
    await User.findByIdAndUpdate(req.body.id, upModel, (err, todo)=>{
        if (err) return res.status(500);
    })

  res.redirect('/users');
});


app.post('/deleteAll', async (req,res)=>{  //удаление всех данных
    
    await mongoose.connection.db.dropCollection('userInfo', (err,result)=>{
        if (err) return res.status(500);
    })
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


app.listen(port,()=>{
    console.log(`server has been started on the ${port} port`);
});

