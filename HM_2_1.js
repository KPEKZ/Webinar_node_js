 //----head----//
 const minimist = require('minimist');
 const ansi = require('ansi');
 const argv = minimist(process.argv.slice(2));
 const readLine = require('readline');
 const fs = require('fs');
 const path = process.argv.slice(2)[0];
 //----head----//



  //----variables----//
 let pWin =0; //количество побед
 let pLosing =0; // количество проигрышей
 let pparties =0; // количество партий
 let countWin =0; // количество выигрышей в течении партии
 let countLose = 0; // количество проигрышей в течении партии
 let counts = 10; // количество попыток
 let pathWin = 0; // количество выигрышей в файле
 let pathLose = 0; // количество проигрышей в файле
 let pathPart = 0; // количество всех партий в файле
 check = true;
 cursor = ansi(process.stdout);

 const rl = readLine.createInterface({
    input : process.stdin,
    output : process.stdout,
   
});
//----variables----//



//----functions----//


function takePathVar()
{
   
   fs.readFile(path, 'utf8', (err, data) => {
        if(err) throw err;

        let text = data;
        pathWin = Number(text[0]);
        pathLose = Number(text[2]);
        pathPart = Number(text[4]);
        pWin +=pathWin;
        pLosing += pathLose;
        pparties +=pathPart;

    });
}


function readData()
{
   
    fs.readFile(path, 'utf8', (err, data)=>
    {
        cursor.green().bg.white();
        if (err) throw err;
        console.log('--------- [File Data] ---------');
        cursor.reset();
        cursor.yellow();
        console.log(data);
        cursor.blue();
        console.log('1-e число количество выигранных партий');
        console.log('2-e число количество проигранных партий');
        console.log('3-e число всех партий');
        cursor.reset();
        cursor.green().bg.white();
        console.log('--------- [File Data] ---------');
        cursor.reset();
        console.log();
        menu();
    })
   
}

function data()
{
    cursor.bold().underline();
    cursor.black().bg.white().write('послеигровая статистика:').bg.reset().write('\n');
    cursor.reset();
    cursor.blue().bg.white();
    console.log('Количество угаданных чисел: ' + countWin);
    cursor.red();
    console.log('Количество неугаданных: ' + countLose);
    cursor.green();
    console.log('Количество выйгранных партий: ' + pWin);
    console.log('Количество проигранных партий: ' + pLosing);
    console.log('Количество партий: ' + pparties);
    cursor.reset();

    fs.writeFile(path,`${pWin}\n${pLosing}\n${pparties}`, (err)=>{
        if (err) throw err;
        console.log("file is created");
    })
    
    rl.close();
}

function rules()
{
    cursor.bold();
    cursor.blue().bg.white();
    console.log('нужно угадать загаданное число 1 или 2');
    console.log(`дается ${counts} попыток`);
    console.log('если угаданных чисел больше, то игрок победил!');
    cursor.reset();
    console.log();
    menu();
}

 function menu()
 {
    console.log('--------- [Menu] ---------');
    cursor.bold().bg.green();
    cursor.red();
    cursor.bg.reset();
    console.log("\tНачать партию: 3");
    console.log("\tПравила: 4");
    console.log("\tСтатистика: 5")
    console.log("\tВыйти: exit");
    cursor.reset();
    console.log('--------- [Menu] ---------');

    rl.on('line',(line) =>{
       
        switch (line.trim()) {
            case '3':
                {
                    
                    check = false;
                    rl.pause();
                    game();
                    break;
                }
                
            case '4':
                {
                    rules();
                    break;
                }
               
            case '5':
                {
                    readData();
                    break;
                }
            case 'exit':
                {
                    rl.close();
                    break;
                }
        
            default:
                {
                    //console.log("Нужно ввести то, что указано!")
                    break;
                }
                
        }

    })

   
 }


function getRandomNumber(max)
{
    return Math.floor(Math.random()*Math.floor(max))+1;
}

 

 function game()
 {
     
     rl.resume();
     console.log('Партия началась!');
     console.log(`У вас ${counts} попыток!`);
    rl.on('line',(line) =>{
       
        const numb = getRandomNumber(2);
        console.log(numb);

        if (counts <= 0)
        {
                if (countWin > countLose) 
            {
                console.log('Вы выйграли партию!');
                pWin++;
                pparties++;
                
            }
            else if (countWin < countLose)
            {
                console.log('Вы проиграли партию!');
                console.log('Попробуйте еще раз!');
                pLosing++;
                pparties++;
               
            }
                data();

        }

        if (line == numb) {
            counts--;
            console.log("Вы угадали!");
            countWin++;
            console.log(`У вас ${counts} попыток!`);
            
        } else 
            {
                counts--;
                console.log("Вы не угадали, попробуйте ещё раз!");
                countLose++;
                console.log(`У вас ${counts} попыток!`);
            }
            
    
        if (line === 'exit')
        {
            data();
        } 
       
        
    });
 }

//----functions----//

(function main()
{
    takePathVar();  
    if (check)
    {
        menu();
    }
})();


    