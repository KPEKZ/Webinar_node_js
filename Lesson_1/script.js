var ansi = require('ansi');
cursor = ansi(process.stdout);
 

cursor
  .red()                 
  .bg.white()             
  .write('Hello World!') 
  .bg.reset()                 
  .write('\n')           

  cursor.hex('#660000').underline()