

async function runTests() {
    readDir('./', true);
}

async function readDir(dirName : string, recursive = false) { 
    console.log(`${dirName}`)
    for await (const dirEntry of Deno.readDir(dirName)) {
    console.log(`${dirEntry}`)
        if(dirEntry.isDirectory === true) {
            if(recursive) {
                console.log(`${dirName}${dirEntry.name}`)
                await readDir( `${dirName}/${dirEntry.name}`, true);
            }
        }
    }
}

runTests();