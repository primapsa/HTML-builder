const path = require('path');
const fs = require('fs');
const folderDest = path.join(__dirname, 'files-copy');
const folderSrc = path.join(__dirname, 'files');
fs.stat(folderDest, err =>{
  if(err) return;
  fs.promises.readdir(folderDest).then((list) =>{
    if(!list.length) return;
    list.forEach((file)=>{
      fs.unlink(path.join(folderDest, file),(err) => err);
    });
  });
});
fs.mkdir(folderDest,{ recursive: true}, err =>{
  if(err) throw new Error(err);
  fs.promises.readdir(folderSrc).then((list) => { 
    if(!list.length) return;
    list.forEach((file)=> {
      if(file) fs.promises.copyFile(path.join(folderSrc,file), path.join(folderDest, file));        
    });  
  });
});