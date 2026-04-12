import { createContext, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    if (!window.ethereum) {
      return undefined;
    }

    const handleAccountsChanged = (accounts) => {
      setWalletAddress(accounts[0] || "");
    };

    const handleChainChanged = (chain) => {
      setChainId(chain);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    setWalletLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      setWalletAddress(accounts[0] || "");
      setChainId(network.chainId.toString());

      return accounts[0];
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        chainId,
        walletLoading,
        connectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
