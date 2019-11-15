
const fs = require("fs");
const { duplicate, transform, cv2json, catPipeWC } = require('./streambox')

const args = process.argv.slice(2)

if (args.length !== 1) {
    console.log("usage: node main.js <FILENAME>")
    process.exit(0)
}
else {
    const filename = args[0];
    if (!fs.existsSync(filename)) {
        console.log(`The file ${filename} does not exist.`);
        process.exit(-1)
    }
    else {
        //    duplicate(filename)
        // transform(filename, /Chopin/g, function (strReplace) {
        //     return strReplace.toUpperCase()
        // }, false)

        // transform(filename, /Chopin/g, function (strReplace) {
        //     return strReplace.toUpperCase()
        // }, true)

        // cv2json(filename)
        catPipeWC(filename, 'md', result => {
            console.log(result)
        })
    }


}
