
const fs = require("fs");
const { duplicate,transform } = require('./streambox')


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
       // duplicate(filename)
        transform(filename,'CHIPPIN',function(strReplace){
            return strReplace.toUpperCase()
        },true)
    }

}
