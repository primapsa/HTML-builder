const path = require('path');
const fs = require('fs');
const folderDest = path.join(__dirname, 'files-copy');
const folderSrc = path.join(__dirname, 'files');

prepareCopy();
async function  prepareCopy() {
  const isFolder = await fs.promises.stat(folderDest);
  if(isFolder){
    const files = await fs.promises.readdir(folderDest);
    if(files.length){
      files.forEach(async file => {
        await fs.promises.rm(path.join(folderDest, file),{recursive: true, force: true, maxRetries: 5});
      });
    }
    copyFolder(folderSrc, folderDest);    
  }
  else{
    fs.promises.mkdir(folderDest,{recursive: true});
  }
}

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
