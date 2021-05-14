const { BrowserWindow, app, ipcMain } = require("electron");
const path = require("path");

const Bluetooth = require("./bluetooth");

var Blu;


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
  });
  Blu = new Bluetooth("MACOS"); // pass "LINUX" fro ubuntu
}

app.whenReady().then(createWindow);


// Defining functions for IPC

ipcMain.on("connect", (event) => {
  console.log("Connecting...");
  Blu.bleOn((result) => {
    if (result === "success") {
      console.log("Connected!");
    } else {
      console.log("Error while connecting!");
    }
  });
});

ipcMain.on("disconnect", (event) => {
  console.log("Disconnecting...");
  Blu.bleOff((result) => {
    if (result === "success") {
      console.log("Disconnected!");
    } else {
      console.log("Error while disconnecting!");
    }
  });
});

ipcMain.on("search", (event) => {
  console.log("Searching...");
  Blu.getPaired((result, devices) => {
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
  Blu.connect(address, (result) => {
    if (result === "success") {
      console.log("Device Connected!");
    } else {
      console.log("Invalid device address!");
    }
  });
});

ipcMain.on("remove", (event, address) => {
  Blu.disconnect(address, (result) => {
    if (result === "success") {
      console.log("Device Connected!");
    } else {
      console.log("Invalid device address!");
    }
  });
});
