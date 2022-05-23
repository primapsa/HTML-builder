const path = require('path');
const fs = require('fs');
const regexp = /{{(?<name>.+?)}}/im;

createBundle();

async function createBundle(){
  prepareFolder('project-dist/assets').then( res => {
    if(res){
      const pathSrc = path.join(__dirname, 'template.html');
      const pathDest = path.join(__dirname, 'project-dist', 'index.html');
      const readHandler = fs.ReadStream(pathSrc, 'utf-8');
      const writeHandler = fs.WriteStream(pathDest, 'utf-8');
      const copyFrom = path.join(__dirname, 'assets');
      const copyTo = path.join(__dirname, 'project-dist','assets');
      copyWithReplace(readHandler, writeHandler);
      mergeFiles('styles','project-dist');
      copyFolder(copyFrom, copyTo);
    }
  });  
 
}

function copyWithReplace(readHandler, writeHandler){
  readHandler.on('data', async (part) => { 
    let modified = await replaceData(part);
    modified = modified.join('\r\n');      
    writeHandler.write(modified);
  });
}

function mergeFiles(from, to ){
  const pathDest = path.join(__dirname, to);
  const pathSrc = path.join(__dirname, from);
  const writeHandler = fs.WriteStream(path.join(pathDest,'style.css'),'utf-8');
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

function replaceData(data){
  if(!regexp.test(data)) return data;
  let part = data.split('\r\n'); 
  let promises = [];
  part.map(line => {
    if(regexp.test(line)){        
      let templateName = line.matchAll(/{{(?<name>.+?)}}/img);
      [...templateName].forEach( name => {
        let replacement =  copyTemplate(name[1]);   
        promises.push(replacement);
      });       
    } else{
      promises.push(line);
    }      
  }); 
  return Promise.all(promises).then(arr => arr); 
}

function copyTemplate(name){
  return new Promise((resolve) => {
    let page = '';
    const fullpath = path.join(__dirname, 'components',`${name}.html`);
    fs.promises.access(fullpath)
      .then(()=>{
        const readTemplate = fs.ReadStream(fullpath);
        readTemplate.on('data', data => page += data );
        readTemplate.on('end', () => resolve(page) );
      })
      .catch(()=>{resolve(''); });    
  });  
}

function prepareFolder(name){
  return new Promise((resolve, reject) => {
    let fullpath = path.join(__dirname, name);
    fs.access(fullpath, err =>{
      if(err){
        fs.mkdir(path.join(__dirname, name),{ recursive: true}, err =>{
          if(err) reject(false);
          resolve(true);   
        });
      }else{
        fs.promises.rm(fullpath, {recursive: true, force: true}).then(()=>{
          fs.mkdir(path.join(__dirname, name),{ recursive: true}, err =>{
            if(err) reject(false);
            resolve(true);   
          });
         
        });        
      }
    });
  });
}
