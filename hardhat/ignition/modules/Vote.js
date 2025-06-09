const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VoteModule", (m) => {
  
  const candidateNames = ["Sarath", "Vignesh", "Adharv","Jishnu"];
  const durationInMinutes = 10;

  const Vote = m.contract("Voting", [candidateNames, durationInMinutes]);

  return { Vote };
});
