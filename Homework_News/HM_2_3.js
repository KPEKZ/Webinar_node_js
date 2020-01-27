//const http = require('http');
//const url = require('url');
const request = require('request');
const cheerio = require('cheerio');
const logger = require('clix-logger')({ coloredOutput: true });//библиотека для цветного вывода
// установка: npm i clix-logger
let countNews = 20;//количество новостей
// https://news.mail.ru/?from=menu -ссылка новостей с Mail.ru
//pull
request('https://news.mail.ru/?from=menu', function (error, response, body) {
if (!error && response.statusCode == 200) {
    const $ = cheerio.load(body);
    console.log('###################################################');
    logger.ok('Список новостей с сайта Mail.ru:');
    while(countNews > 0)
    {
        
        const rate = $('.list__item').eq(countNews).text();
        logger.success(rate)
       
        countNews--;
    }
    console.log('###################################################');
}
});
