import axios from "axios";

const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
const pinataSecretApiKey = import.meta.env.VITE_PINATA_API_SECRET;

export const uploadJSONToPinata = async (jsonData) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const metadata = { name: "VotingResults" };

  const res = await axios.post(url, {
    pinataMetadata: metadata,
    pinataContent: jsonData
  }, {
    headers: {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
      "Content-Type": "application/json"
    }
  });

  return res.data.IpfsHash;
};
