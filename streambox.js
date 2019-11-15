const fs = require('fs')
const path = require('path')
const { Transform } = require('stream')




function getDuplicateName(fileName) {
    const ext = path.extname(fileName)
    const base = path.basename(fileName, ext)

    return `${base}.duplicate${ext}`
}

function duplicate(filename) {

    const ouptputFilename = getDuplicateName(filename)

    const readFile = fs.createReadStream(filename) //lecture du fichier 
    let writeStream = fs.createWriteStream(ouptputFilename) // ecriture du fichier

    readFile.pipe(writeStream) // pipe qui sert de passerelle pour ecrire
    console.log(base + ext + ' successufuly duplicated!')
}


function transform(filename, re, cb, inStdout = true) {
    const ouptputFilename = getDuplicateName(filename)

    const rstream = fs.createReadStream(filename) //lecture du fichier 

    if (inStdout) {
        let content = ''
        rstream.on('data', chunk => {
            content += chunk.toString().replace(re, cb)
        })

        rstream.on("end", () => {
            console.log(content)
        })
    } else {
        const wstream = fs.createWriteStream(ouptputFilename)


        const tstream = new Transform({
            transform(chunk, encoding, callback) {

                this.push(chunk.toString().replace(re, cb))

                callback()
            }
        })

        rstream.pipe(tstream).pipe(wstream)
    }
}

function generateDate(tabValue) {
    let regex = /(\d{4})(\d{2})(\d{2})/
    let value = tabValue.match(regex)
    let date = value[1] + '-' + value[2] + '-' + value[3]
    return date
}

function cv2json(filename) {
    let finalTab = []
    let obj = {}
    let content = ''

    const rstream = fs.createReadStream(filename)
    const ext = path.extname(filename)
    const base = path.basename(filename, ext)
    let newFile = base + '.json'

    rstream.on('data', chunk => {
        content = chunk.toString()
    })

    rstream.on("end", () => {
        let lines = content.split("\n")
        let lineKeys = lines[0]
        let lineValues = lines[1]
        let splitKeys = lineKeys.split(";")
        let splitValues = lineValues.split(";")

        for (const myKey in splitKeys) {
            if (splitKeys[myKey] == 'activities') {
                splitValues[myKey].split(',')
                let splitActvitiesValues = splitValues[myKey].split(',')
                obj[splitKeys[myKey]] = splitActvitiesValues

            }

            else if (splitKeys[myKey] == 'birth') {
                obj[splitKeys[myKey]] = generateDate(splitValues[myKey])
            }
            else if (splitKeys[myKey] == 'death') {
                obj[splitKeys[myKey]] = generateDate(splitValues[myKey])
            }
            else {
                obj[splitKeys[myKey]] = splitValues[myKey]
            }

        }
        finalTab.push(obj)
        finalTab = JSON.stringify(finalTab, null, 4)

        fs.writeFile(newFile, finalTab, (err) => {
            if (err) throw err;
        });
        console.log(content)

    })

}

function catPipeWC(directory, type, cb) {

    let finalCountWord = 0;
    let promise1 = new Promise(function(resolve, reject) {});
    fs.readdir(directory, function (err, items) {
        for (const key in items) {
            if (path.extname(items[key]) == '.' + type) {
                const rstream = fs.createReadStream(directory + '/' + items[key])
                rstream.on('data', chunk => {
                      // console.log(chunk.toString().length)
                      //  let splitChunk = chunk.toString().split(/\s/g)
                      // console.log(splitChunk)
                    //var splitChunkFiltre = splitChunk.filter( function(val){return val !== ''} );
                    // console.log(splitChunkFiltre)
                   // finalCountWord += splitChunkFiltre.length
                     finalCountWord +=  chunk.toString().length
                    // console.log(finalCountWord)
                })

                

                rstream.on("end", () => {
                    cb(finalCountWord)
                })



            }
        }
    })
}


module.exports = {
    duplicate,
    transform,
    cv2json,
    catPipeWC
}

// function catPipeWC(directory, type, cb) {

    //     let finalCountWord = 0;
    
    //     let promise = new Promise(function (resolve, reject) { });
    
    //     fs.readdir(directory, function (err, items) {
    //         for (const key in items) {
    //             if (path.extname(items[key]) == '.' + type) {
    //                 const rstream = fs.createReadStream(directory + '/' + items[key])
    //                 rstream.on('data', chunk => {
    //                     finalCountWord += chunk.toString().length
    //                 })
    //                 rstream.on("end", () => {
    //                     promise = Promise.resolve(finalCountWord);
    //                 })
    
    //             }
    //         }
    //         promise.then(function(finalCountWord) {
    //             console.log(finalCountWord)
    //                     cb(finalCountWord)
    //           });
    //     })
    // }
    
    
    // module.exports = {
    //     duplicate,
    //     transform,
    //     cv2json,
    //     catPipeWC
    // }