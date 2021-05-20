var child = require("child_process").exec;
const path = require("path");

var executablePath = path.join(__dirname,"BluetoothCLTools-1.2.0.56.exe");

function run(cmd, cb = () => {}) {
    child(cmd, (error, stdout, stderr) => {
        if (error) {
            cb("error", error);
          } else {
            cb("success", stdout.toString());
          }
    })
}

function testWindows(){
    run("btinfo", (state, output)=> {
        console.log(state);
        if(state === "error"){
           run(executablePath, (state, output)=>{
                if(state === "success"){
                    console.log("Installed on Windows.")
                } 
           }) 
        }
    })
}

try {
    testWindows();   
} catch (error) {
    
}
