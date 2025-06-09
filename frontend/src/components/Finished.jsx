import { useState } from "react";
import { uploadJSONToPinata } from "../utils/uploadToPinata";

const Finished = ({ candidates }) => {
  const [ipfsHash, setIpfsHash] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadToIPFS = async () => {
    setIsUploading(true);
    try {
      const data = candidates.map((c) => ({
        name: c.name,
        voteCount: c.voteCount,
      }));

      const hash = await uploadJSONToPinata({ results: data });
      setIpfsHash(hash);
    } catch (error) {
      console.error("Upload to IPFS failed:", error);
      alert("Failed to upload results to IPFS.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white">
      <h1 className="text-4xl font-bold mb-8">Voting Results</h1>

      <div className="w-full max-w-2xl">
        <table className="w-full border-2 border-white rounded-lg overflow-hidden mb-8">
          <thead>
            <tr className="bg-pink-700 bg-opacity-20">
              <th className="p-3 border-2 border-white">Candidate</th>
              <th className="p-3 border-2 border-white">Votes</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.index} className="hover:bg-white hover:bg-opacity-10 hover:text-black shadow shadow-xl">
                <td className="p-3 border-2 border-white">{candidate.name}</td>
                <td className="p-3 border-2 border-white text-center">{candidate.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xl text-center mb-4">
          The voting period has ended. Thank you for participating!
        </p>

        <div className="text-center">
          <button
            onClick={handleUploadToIPFS}
            className="bg-red-500 hover:bg-red-900 px-4 py-2 rounded text-white"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Results to IPFS"}
          </button>

          {ipfsHash && (
            <p className="mt-4">
              ✅ Uploaded:{" "}
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-yellow-200"
              >
                View on IPFS
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finished;
