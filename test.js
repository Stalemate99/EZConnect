var child = require("child_process").exec;
const path = require("path");
var bluetooth = path.join(__dirname, "asset", "macos", "blueutil");

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

// chmod((err) => {
//   console.log(err);
//     //   bleOn((x) => {
//     //     console.log(x);
//     //   });
// });

bleOn((res) => {
  console.log(res);
});
