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
  copyFolder(folderSrc, folderDest);
});

function copyFolder(src, dest){
  fs.promises.readdir(src).then( list => {
    list.forEach(file => {
      fs.promises.stat(path.join(src, file)).then( stat => {
        if(stat.isDirectory()){
          fs.promises.mkdir(path.join(dest, file),{recursive: true}).then(()=>{
            copyFolder(path.join(src, file), path.join(dest, file));
          });
        }else{         
          fs.promises.copyFile(path.join(src, file), path.join(dest, file));
        }
      });
    });
  });
}
