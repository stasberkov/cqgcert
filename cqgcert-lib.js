var http = require('http');
var fs = require('fs');
var os = require('os');
var path = require('path');
var execFile = require('child_process').execFile;
var execFileSync = require('child_process').execFileSync;
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var util = require("util");

var certFileName = "ca-plus-cqg.pem";
var homePath = os.homedir();
exports.targetFilePath = path.join(homePath, certFileName);
var sourceFilePath = path.join(__dirname, certFileName);

exports.installCaFiles = function () {
    var targetFileStream = fs.createWriteStream(exports.targetFilePath);
    var sourceFileStream = fs.createReadStream(sourceFilePath);
    sourceFileStream.pipe(targetFileStream);
    exports.registerCaFiles(exports.targetFilePath);
}

exports.resetCaFiles = function () {
    exports.resetNpmCaFile();
    exports.resetGitCaFile();
}

exports.listCaFiles = function () {
    console.log("npm ca file: ", exports.getNpmCaFilePath());
    console.log("git ca file: ", exports.getGitCaFilePath());
}

exports.registerCaFiles = function (caFile) {
    exports.registerNpmCaFile(caFile);
    exports.registerGitCaFile(caFile);
}

exports.resetNpmCaFile = function () {
    exec(util.format("npm config delete cafile"), function (err, stdout, stderr) {
        if (err) {
            console.log("npm", err);
            return;
        };
        console.log(stdout);
    });
}

exports.resetGitCaFile = function () {
    execFile("git", ["config", "--global", "--unset", "http.sslCAInfo"], function (err, stdout, stderr) {
        if (err) {
            console.log("git", err);
        };
        console.log(stdout);
    });
}

exports.registerNpmCaFile = function (caFile) {
    exec(util.format("npm config set cafile \"%s\"", caFile), function (err, stdout, stderr) {
        if (err) {
            console.log(err);
            return;
        };
        console.log(stdout);
    });
}

exports.registerGitCaFile = function (caFile) {
    execFile("git", ["config", "--global", "http.sslCAInfo", caFile], function (err, stdout, stderr) {
        if (err) {
            console.log(err);
        };
        console.log(stdout);
    });
}

exports.getGitCaFilePath = function () {
    var gitRes = execFileSync("git", ["config", "--get", "http.sslCAInfo"]).toString();
    var filePath = gitRes.replace(/[\n\t\r]/g, "");
    return filePath;
}

exports.getNpmCaFilePath = function () {
    var nodeRes = execSync("npm config get cafile").toString();
    var filePath = nodeRes.replace(/[\n\t\r]/g, "");
    return filePath;
}