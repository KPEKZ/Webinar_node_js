const request = require('request');
const cheerio = require('cheerio');
const readLine = require('readline');
const ansi = require('ansi');
cursor = ansi(process.stdout);
const logger = require('clix-logger')({ coloredOutput: true });//библиотека для цветного вывода
// установка: npm i clix-logger
let word = "hello";


const rl = readLine.createInterface({
    input : process.stdin,
    output : process.stdout,
   
});
 

console.log("Введите слово на английском");
console.log("Для выхода введите logexit");
rl.on("line",(line)=>{
word = line;
request(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200120T163823Z.7bb103fdefce1a07.97d3d9da4ad75918093ac27a6cb02de93e6848f8&lang=en-ru&format=plain&text=${word}`, function (error, response, body) {
if (!error && response.statusCode == 200) {
    const value = JSON.parse(body);
    console.log('################################################################');
        logger.success("\tПеревод выполнен успешно!");
        cursor.yellow();
       console.log(value.text[0]);
       cursor.reset();
     
    console.log('################################################################');
    
    if (line === "logexit")
    {
        logger.success("Вы успешно вышли!");
        rl.close();
    }
        
}
});
});

