const Login = ({ connectWallet }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white">
      <div className="welcome_message mb-8 text-center">
        <p className="text-4xl font-extrabold">Welcome to Voting DApp</p>
      </div>
      
      <button
        onClick={connectWallet}
        className="px-6 py-4 bg-white text-black rounded-lg font-bold font-montserrat border-2 border-white hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 hover:text-white transition-colors duration-300"
      >
        Connect Wallet
      </button>
      
      <div className="login_rules_block mt-8 text-center">
        <p className="text-sm">
          Please connect your wallet to participate in the voting process.
        </p>
      </div>
    </div>
  );
};

export default Login;