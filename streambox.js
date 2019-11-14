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

function transform(filename, re, cb, instdout = true) {
    const ext = path.extname(filename)
    const base = path.basename(filename, ext);



    const readFile = fs.createReadStream(filename) //lecture du fichier 
    let writeStream = fs.createWriteStream('./' + base + '.copy' + ext) // ecriture du fichier

    if (instdout) {
        let content = ''
        readFile.on('data', chunk => {
            content += chunk.toString()
        })

        readFile.on("end", () => {
            console.log(content)
        })
    } else {
        const tstream = new Transform({
            transform(chunk, encoding, callback) { // chunck c la donne du fichier recupre en binaire
                this.push(chunk.toString().replace(re, str => cb(str))) //chunck c la donne du fichier recupre en binaire
                callback()
            }

        })

        readFile.pipe(tstream).pipe(writeStream)
    }

}

module.exports = {
    duplicate,
    transform
}