var cqgcertlib = require('./cqgcert-lib');
var util = require("util");

var targetFilePath = cqgcertlib.targetFilePath.toLowerCase();

var npmCaFilePath = cqgcertlib.getNpmCaFilePath();
checkCertPath(npmCaFilePath, "nodejs");

var gitCaFilePath = cqgcertlib.getGitCaFilePath();
checkCertPath(gitCaFilePath, "git");

function checkCertPath(path, target) {
    var pathLowered = path.toLowerCase();
    if (pathLowered != targetFilePath) {
        throw new Error(util.format("CQG CA cert is not installed for %s. Install cqg ca cert or use installer from https://www.npmjs.com/package/cqgcert", target));
    }
}