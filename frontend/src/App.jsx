import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./constants/constant.js";
import Login from "./components/Login.jsx";
import Finished from "./components/Finished.jsx";
import Connected from "./components/Connected.jsx";
import { uploadJSONToPinata } from "./utils/uploadToPinata.js";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState("");
  const [canVote, setCanVote] = useState(true);
  const [votingStartTime, setVotingStartTime] = useState(null);
  const [votingEndTime, setVotingEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    getCandidates();
    getCurrentStatus();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (!votingStatus || timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [votingStatus, timeRemaining]);

  async function vote() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contractInstance.vote(number);
    await tx.wait();

    checkVotingEligibility();
    getCandidates();
  }

  async function checkVotingEligibility() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
    const voterAddress = await signer.getAddress();
    const voteStatus = await contractInstance.voters(voterAddress);
    setCanVote(!voteStatus);
  }

  async function getCandidates() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const candidatesList = await contractInstance.getAllVotesOfCandiates();

      const formattedCandidates = candidatesList.map((candidate, index) => ({
        index,
        name: candidate.name,
        voteCount: Number(candidate.voteCount),
      }));

      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  }

  async function getCurrentStatus() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

      const status = await contractInstance.getVotingStatus();
      setVotingStatus(status);

      const start = await contractInstance.votingStart();
      const end = await contractInstance.votingEnd();
      const remaining = await contractInstance.getRemainingTime();

      setVotingStartTime(Number(start));
      setVotingEndTime(Number(end));
      setTimeRemaining(Number(remaining));

      if (!status) {
        uploadResultsToIPFS();
      }
    } catch (error) {
      console.error("Error fetching voting status or times:", error);
    }
  }

  async function uploadResultsToIPFS() {
    try {
      const results = candidates.map((c) => ({ name: c.name, voteCount: c.voteCount }));
      const hash = await uploadJSONToPinata({ results });
      console.log("Results uploaded to IPFS with hash:", hash);
    } catch (err) {
      console.error("Failed to upload voting results to IPFS:", err);
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
      checkVotingEligibility();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        checkVotingEligibility();
      } catch (err) {
        console.error("Error connecting to MetaMask:", err);
      }
    } else {
      alert("MetaMask not detected in your browser.");
    }
  }

  function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  function formatSeconds(seconds) {
    if (seconds <= 0) return "Voting has ended";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white">
      <div className="text-center py-4">
        {votingStartTime && votingEndTime && (
          <>
            <p>🕒 <strong>Voting Start:</strong> {new Date(votingStartTime * 1000).toLocaleString()}</p>
            <p>⏳ <strong>Voting End:</strong> {new Date(votingEndTime * 1000).toLocaleString()}</p>
            <p>⏱ <strong>Time Left:</strong> {formatSeconds(timeRemaining)}</p>
          </>
        )}
      </div>

      {votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction={vote}
            showButton={canVote}
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished candidates={candidates} />
      )}
    </div>
  );
}

export default App;
