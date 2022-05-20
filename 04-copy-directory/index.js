const path = require('path');
const fs = require('fs');
const folderDest = path.join(__dirname, 'files-copy');
const folderSrc = path.join(__dirname, 'files');
fs.mkdir(folderDest,{ recursive: true}, err =>{
  if(err) throw new Error(err);
  fs.promises.readdir(folderSrc).then((list) => { 
    if(!list.length) return;
    list.forEach((file)=> {
      if(file) fs.promises.copyFile(path.join(folderSrc,file), path.join(folderDest, file));        
    });  
  });
});