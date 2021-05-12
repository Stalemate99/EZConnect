const { BrowserWindow, app, ipcMain } = require("electron");
const path = require("path");
var child = require("child_process").exec;
var bluetooth = path.join(__dirname, "asset", "macos", "blueutil");

console.log(bluetooth);

// const isDev = !app.isPackaged;

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    menuBarVisible: false,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // win.setMenu(null);

  win.loadFile("./app/index.html");

  win.once("ready-to-show", () => {
    win.show();
    chmod(console.log);
  });
}

app.whenReady().then(createWindow);

// Utilities

const chmod = (cb) => {
  child(`chmod +x ` + bluetooth, (error, stdout, stderr) => {
    if (error) {
      cb("error", error);
      throw error;
    } else {
      cb("success", stdout);
    }
  });
};

const bleOn = (cb) => {
  child(bluetooth + " -p 1", (error, stdout, stderr) => {
    if (error) {
      cb("error", error);
      throw error;
    } else {
      cb("success", stdout);
    }
  });
};

const bleOff = (cb) => {
  child(bluetooth + " -p 0", (error, stdout, stderr) => {
    if (error) {
      cb("error", stderr);
      throw error;
    } else {
      cb("success", stdout);
    }
  });
};

const blePaired = (cb) => {
  child(bluetooth + " --paired", (error, stdout, stderr) => {
    if (error) {
      cb("error", stderr);
      throw error;
    } else {
      cb("success", stdout.toString().split("\n"));
    }
  });
};

const bleCon = (address, cb) => {
  child(bluetooth + ` --connect ${address}`, (error, stdout, stderr) => {
    if (error) {
      cb("error", stderr);
      throw error;
    } else {
      cb("success", stdout.toString());
    }
  });
};

// ------------------------------------------------------------------------------------------

const bleDis = (address, cb) => {
  child(bluetooth + ` --disconnect ${address}`, (error, stdout, stderr) => {
    if (error) {
      cb("error", stderr);
      throw error;
    } else {
      cb("success", stdout.toString());
    }
  });
};

const bleGetConnected = (cb) => {
  child(bluetooth + " --connected", (error, stdout, stderr) => {
    if (error) {
      cb("error", stderr);
      throw error;
    } else {
      cb("success", stdout.toString().split("\n"));
    }
  });
};

// Defining functions for IPC

ipcMain.on("connect", (event) => {
  console.log("Connecting...");
  bleOn((result) => {
    if (result === "success") {
      console.log("Connected!");
    } else {
      console.log("Error while connecting!");
    }
  });
});

ipcMain.on("disconnect", (event) => {
  console.log("Disconnecting...");
  bleOff((result) => {
    if (result === "success") {
      console.log("Disconnected!");
    } else {
      console.log("Error while disconnecting!");
    }
  });
});

ipcMain.on("search", (event) => {
  console.log("Searching...");
  blePaired((result, devices) => {
    if (result === "success") {
      console.log("Devices found: \n", devices);
      event.sender.webContents.send("paired-devices", devices);
    } else {
      console.log("No devices available!");
    }
  });
});

ipcMain.on("find", (event, address) => {
  console.log("Finding MAC address...");
  bleCon(address, (result) => {
    if (result === "success") {
      console.log("Device Connected!");
    } else {
      console.log("Invalid device address!");
    }
  });
});
