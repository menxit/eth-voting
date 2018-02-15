const Votazioni = artifacts.require("./Votazioni.sol");

module.exports = function(deployer) {
    deployer.deploy(Votazioni);
};
