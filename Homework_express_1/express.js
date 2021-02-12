const express = require('express');
const app = express();
const path = require('path');
const consolidate = require('consolidate');
const request = require('request');
const cheerio = require('cheerio');
const cookieParser = require('cookie-parser');
//const session = require('express-session');
//const connect = require('connect');
let arrNews = new Array(); // массив новостей


function randomize(number)
{
    return Math.floor(Math.random()*number);
}


//static files
app.use(express.static(path.resolve(__dirname)));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('hbs',consolidate.handlebars);
app.set('view engine','hbs');
app.set('views',__dirname);
app.use(cookieParser());
//app.use(session());


app.listen(8000,()=>{
    console.log("server has been started!");
});

app.get('/news',(req, res)=>{
    res.render('res',{
        rate :arrNews
     });
     console.log("Cookies: ", req.cookies);
});

app.post('/delete',(req,res)=>
{
    arrNews = [];
    res.render('res',{
        rate :arrNews
     });
});

app.post('/news',(req, res)=>
{

    request('https://news.mail.ru/?from=menu', function (error, response, body) {
        if (!error && response.statusCode == 200) {
                const $ = cheerio.load(body);
                let countNews = req.body.countNews; //количество новостей
                console.log(countNews);
                res.cookie('limit',countNews);
                console.log("Cookies: ", req.cookies);
                let temp =0;
                while (countNews > 0)
                {
                    const rate = $('.list__item').eq(randomize(temp)).text();
                    arrNews.push(rate)
                    countNews--;
                    temp++;
                    
                }
                
                res.render('res',{
                    rate : arrNews
                 });
                 
        }
        });

        
        

});

app.get('/',(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'index.html'));
    console.log("Cookies: ", req.cookies);
    
});

// app.get('/setcookie', function(req, res){
//     // setting cookies
//     res.cookie('username', 'john doe', { maxAge: 900000, httpOnly: true });
//     return res.send('Cookie has been set');
// });

// app.get('/getcookie', function(req, res) {
//     var username = req.cookies['username'];
//     if (username) {
//         return res.send(username);        
//     }

//     return res.send('No cookie found');
// });

