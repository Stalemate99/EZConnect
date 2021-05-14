var child = require("child_process").exec;
const path = require("path");


class Bluetooth {

    //  COMMAMNDS
    static cmds = {
        "MAC": {
            ble: path.join(__dirname, "asset", "macos", "blueutil"),
            init: "chmod +x ",
            bleOn: " -p 1",
            bleOff: " -p 0",
            connect: " --connect ",
            disconnect: " --disconnect ",
            getPaired: " --paired",
            getConnected: " --connected"
        },
        "LINUX": {
            ble: path.join(__dirname, "asset", "linux", "bluetoothctl"),
            init: "chmod +x ",
            bleOn: " -p 1",
            bleOff: " -p 0",
            connect: " connect ",
            disconnect: " disconnect ",
            getPaired: " paired-devices",
            getConnected: path.join(__dirname, "asset", "linux", "getconnecteddevice.sh"),
        }
    }

    constructor(os) {
        this.os = os;
        this.ble = Bluetooth.cmds[this.os].ble;
        this.init();
    }

    init() {
        this.run(Bluetooth.cmds[this.os].init + this.ble)
        if(this.os === "LINUX") {
        this.run(Bluetooth.cmds[this.os].init + Bluetooth.cmds[this.os].runBash )
        }
    }

    bleOn(cb) {
        this.run(this.ble + Bluetooth.cmds[this.os].bleOn, cb);
    }

    bleOff(cb) {
        this.run(this.ble + Bluetooth.cmds[this.os].bleOff, cb);
    }

    getPaired(cb) {
        this.run(this.ble + Bluetooth.cmds[this.os].getPaired, cb);
    }

    getConnected(cb) {
        if(this.os === "LINUX") {
            this.run(Bluetooth.cmds[this.os].getConnected, cb);
        } else {
            this.run(this.ble + Bluetooth.cmds[this.os].getConnected, cb);
        }
    }

    connect(mac, cb) {
        this.run(this.ble + Bluetooth.cmds[this.os].connect + mac, cb);
    }

    disconnect(mac, cb) {
        this.run(this.ble + Bluetooth.cmds[this.os].disconnect + mac, cb);
    }

    run(cmd, cb = () => {}) {
        child(cmd, (error, stdout, stderr) => {
            if (error) {
                cb("error", error);
                throw error;
              } else {
                cb("success", stdout.toString());
              }
        })
    }

} 

module.exports = Bluetooth;