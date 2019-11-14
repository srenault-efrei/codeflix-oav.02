const fs = require('fs')
const path = require('path')
const { Transform } = require('stream')


function duplicate(filename) {

    const ext = path.extname(filename)
    const base = path.basename(filename, ext)

    const readFile = fs.createReadStream(filename) //lecture du fichier 
    let writeStream = fs.createWriteStream('./' + base + '.copy' + ext) // ecriture du fichier
    readFile.pipe(writeStream) // pipe qui sert de passerelle pour ecrire
    console.log(base + ext + ' successufuly duplicated!')
}

function transform(filename, re, cb, inStdout = true) {
    const ext = path.extname(filename)
    const base = path.basename(filename, ext);



    const rstream = fs.createReadStream(filename) //lecture du fichier 

    if (inStdout) {
        let content = ''
        rstream.on('data', chunk => {
            content += chunk.toString().replace(re,cb)
        })

        rstream.on("end", () => {
            console.log(content)
        })
    } else {
        const wstream = fs.createWriteStream('./' + base + '.copy' + ext)
    
     
        const tstream = new Transform({
          transform(chunk, encoding, callback) {
              
            this.push(chunk.toString().replace(re,cb))
    
            callback()
          }
        })
    
        rstream.pipe(tstream).pipe(wstream)
      }

}

module.exports = {
    duplicate,
    transform
}