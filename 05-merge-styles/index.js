const path = require('path');
const fs = require('fs');

const pathDest = path.join(__dirname, 'project-dist');
const pathSrc = path.join(__dirname, 'styles');
const writeHandler = fs.WriteStream(path.join(pathDest,'bundle.css'),'utf-8');

createBundle();
async function createBundle(){
  const files = await fs.promises.readdir(pathSrc);
  if(!files.length) return;
  files.forEach(async (file) =>{
    let filePath = path.join(pathSrc, file);
    let fileExtension = path.extname(filePath).substring(1);  
    if(fileExtension !== 'css') return;
    await new Promise((resolve) => {
      let readHandler = fs.ReadStream(filePath, 'utf-8');
      let writeStream = readHandler.pipe(writeHandler);
      writeStream.on('finish', () => { resolve(true); });
    });   
  });
}