var http = require('http');
var fs = require('fs');
var os = require('os');
var path = require('path');
var execFile = require('child_process').execFile;
var exec = require('child_process').exec;
var program = require('commander');
var util = require("util");
var pjson = require('./package.json');

var certFileName = "ca-plus-cqg.pem";
var homePath = os.homedir();
var targetFilePath = path.join(homePath, certFileName);
var sourceFilePath = path.join(__dirname, certFileName);

program
    .version(pjson.version);

program
    .command("install")
    .description("Install common ca certificates and cqg ca certificate for nodejs and git")
    .action(function (env, options) {
        console.log("Install common and cqg ca certificates...");
        installCommonPlusCqgCa();
        console.log("Done!");
    });

program
    .command("uninstall")
    .description("Remove custom certificates from nodejs and git")
    .action(function (env, options) {
        console.log("Remove custom certificates from nodejs and git...");
        uninstallCommonPlusCqgCa();
        console.log("Done!");
    });

program
    .command("list")
    .description("Displays currently used certificates")
    .action(function (env, options) {
        console.log("List currently used ca files");
        listCaConfigurations();
    });

program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.help();
  }

function installCommonPlusCqgCa() {
    var targetFileStream = fs.createWriteStream(targetFilePath);
    var sourceFileStream = fs.createReadStream(sourceFilePath);
    sourceFileStream.pipe(targetFileStream);
    registerCommonPlusCqgCa(targetFilePath);
}

function uninstallCommonPlusCqgCa() {
    exec(util.format("npm config delete cafile"), function (err, stdout, stderr) {
        if (err) {
            console.log("npm", err);
            return;
        };
        console.log(stdout);
    });
    execFile("git", ["config", "--global", "--unset", "http.sslCAInfo"], function (err, stdout, stderr) {
        if (err) {
            console.log("git", err);
        };
        console.log(stdout);
    });
}

function listCaConfigurations() {
    exec(util.format("npm config get cafile"), function (err, stdout, stderr) {
        console.log("npm ca file (global)");
        if (err) {
            console.log(err);
            return;
        };
        console.log(stdout);
    });
    execFile("git", ["config", "--get", "http.sslCAInfo"], function (err, stdout, stderr) {
        console.log("git ca file (global)");
        if (err) {
            console.log(err);
        };
        console.log(stdout);
        console.log(stderr);
    });
}

function registerCommonPlusCqgCa(caFile) {
    exec(util.format("npm config set cafile \"%s\"", caFile), function (err, stdout, stderr) {
        if (err) {
            console.log(err);
            return;
        };
        console.log(stdout);
    });
    execFile("git", ["config", "--global", "http.sslCAInfo", caFile], function (err, stdout, stderr) {
        if (err) {
            console.log(err);
        };
        console.log(stdout);
        console.log(stderr);
    });
}