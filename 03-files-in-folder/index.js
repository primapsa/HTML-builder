const path = require('path');
const fs = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');
fs.promises.readdir(folderPath).then((list) => {
  if(!list.length) return;
  list.forEach((file)=>{
    if(file && /.*\..{2,}/gi.test(file)){
      let filePath = path.join(folderPath, file);      
      fs.stat(filePath, (err, info)=>{
        if(!err && !info.isDirectory()){
          let fileSize = info.size; 
          let fileExtension = path.extname(filePath).substring(1);
          let fileName = path.basename(filePath);         
          fileName = fileName.substring(0, fileName.lastIndexOf('.'));          
          process.stdout.write(`${fileName} - ${fileExtension} - ${fileSize} byte(s)\r\n`);
        }        
      });
    }   
  });  
});
   


