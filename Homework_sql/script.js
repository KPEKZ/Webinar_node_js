const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');
const consolidate = require('consolidate');
const request = require('request');
const cheerio = require('cheerio');
const Task = require('./models/tasks.js');
const port = process.env.port || 8080;


//static files
app.use(express.static(path.resolve(__dirname))); //css
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('hbs',consolidate.handlebars);
app.set('view engine','hbs');
app.set('views',path.resolve(__dirname + '/views'));




app.post('/addUser',async (req, res)=>{ //добавление пользователя

    let id = await Task.setRandomId();
    let nameUser = req.body.login;
    let message = "user added!";
    let post = {id: id, name: nameUser};
    Task.addUser('users',post);
    console.log("user added!");
    res.redirect('/users');

});

app.get('/addUser',async (req, res)=>{ //добавление пользователя

    res.sendFile(path.resolve(__dirname,'index.html'));

});

app.get('/users',async (req, res)=>{ //получение пользователей

    let users = await Task.getAll(`users`); // получаем пользователей  
    
        res.render('res',{
            rate :users
         });

});


app.get('/users/:id', async (req, res)=>{ 

        const id = req.params.id;
        let user = await Task.getById('users',id);
        console.log('user: ', user);
        res.render('res',{
            rate :user
         });


});

app.post('/delete/:id',(req,res)=>
{
    const id = req.params.id;
    Task.delete('users',id);
    console.log('user deleted!');
    res.redirect('/users');
});


app.post('/deleteAll', (req,res)=>{ //удаление всех данных с таблицы
    Task.deleteAll('users');
    console.log('table was cleared!');
    res.redirect('users');
});

app.get('/update/:id', async (req,res)=> //изменение имени пользователя
{
    const id = req.params.id;
    let user = await Task.getById('users',id);
    res.render("update.hbs", {
        user : user
    })
});

app.post('/update', async (req, res)=>{ //изменение имени пользователя

    const nameUser = req.body.login;
    const id = req.body.id;
    Task.update('users',id,nameUser);
    console.log('updated!');
    res.redirect('/users');
});

app.get('/',(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'index.html'));
});

app.listen(port,()=>{
    console.log(`server has been started on the ${port} port`);
});

