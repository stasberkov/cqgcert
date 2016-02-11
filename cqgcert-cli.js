var program = require('commander');
var cqgcertlib = require('./cqgcert-lib');
var pjson = require('./package.json');

program
    .version(pjson.version);

program
    .command("install")
    .description("Install common ca certificates and cqg ca certificate for nodejs and git")
    .action(function (env, options) {
        console.log("Install common and cqg ca certificates...");
        cqgcertlib.installCaFiles();
        console.log("Done!");
    });

program
    .command("reset")
    .description("Reset CA certificate configuration")
    .action(function (env, options) {
        console.log("Reset CA certificate configuration...");
        cqgcertlib.resetCaFiles();
        console.log("Done!");
    });

program
    .command("list")
    .description("Displays currently used CA files")
    .action(function (env, options) {
        cqgcertlib.listCaFiles();
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.help();
}