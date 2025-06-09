const Connected = ({ account, candidates, number, handleNumberChange, voteFunction, showButton }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white">
     
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col items-center">
        <div className="welcome_message mb-6">
          <p className="text-2xl font-bold">Welcome, Voter!</p>
        </div>
        
        <div className="connected_header mb-6 w-full text-center">
          <p className="text-lg font-bold">Your Account: {account}</p>
        </div>
        
        <div className="voting_block w-full max-w-md mb-6">
          <p className="font-bold mb-4">Cast Your Vote</p>
          
          <input
            type="number"
            value={number}
            onChange={handleNumberChange}
            placeholder="Enter candidate number"
            className="w-full px-4 py-3 bg-white text-black rounded-lg border-2 border-white font-bold text-center mb-4"
          />
          
          {showButton && (
            <button
              onClick={voteFunction}
              className="w-full px-6 py-3 bg-white text-black rounded-lg font-bold font-montserrat border-2 border-white hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 hover:text-white transition-colors duration-300"
            >
              Vote
            </button>
          )}
        </div>
        
        <div className="rules_block text-center">
          <p className="text-xs">
            By voting, you agree to the terms and conditions of this decentralized voting application.
          </p>
        </div>
      </div>
      
      
      <div className="w-full md:w-1/2 p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Candidates</h2>
        
        <table className="w-full border-2 border-black rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-pink-700 bg-opacity-20">
              <th className="p-3 border-2 border-white">Number</th>
              <th className="p-3 border-2 border-white">Name</th>
              <th className="p-3 border-2 border-white">Votes</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.index} className="hover:bg-pink-300 hover:bg-opacity-10">
                <td className="p-3 border-2 border-white text-center">{candidate.index+1}</td>
                <td className="p-3 border-2 border-white text-center">{candidate.name}</td>
                <td className="p-3 border-2 border-white text-center">{candidate.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Connected;