const fs = require('fs');
const path = require('path');
const filename = 'text.txt';
const filePath = path.join(__dirname, filename);
const fileHandler = fs.WriteStream(filePath, 'utf-8');
const {stdin, stdout} = process;
stdout.write('Write something, please...\n');
stdin.on('data', (data)=>{
  data = data.toString();  
  if(!data) return;
  if(data === 'exit\r\n'){
    process.exit();
  }else{
    fileHandler.write(data);}    
});
process.on('exit', ()=>stdout.write('Good work! Bye!'));
process.on('SIGINT', ()=>process.exit());