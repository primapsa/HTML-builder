const path = require('path');
const fs = require('fs');
const pathDest = path.join(__dirname, 'project-dist');
const pathSrc = path.join(__dirname, 'styles');
const writeHandler = fs.WriteStream(path.join(pathDest,'bundle.css'),'utf-8');
fs.promises.readdir(pathSrc).then((list) => { 
  if(!list.length) return;
  
  list.forEach((file)=> {
    if(!file) return;
    let filePath = path.join(pathSrc, file);
    let fileExtension = path.extname(filePath).substring(1);    
    if(fileExtension !== 'css') return;
    let readHandler = fs.ReadStream(filePath, 'utf-8');
    readHandler.pipe(writeHandler);
  });  
});
