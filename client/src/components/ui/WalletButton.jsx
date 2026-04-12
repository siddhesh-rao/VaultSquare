import { useEffect } from "react";

import useAuth from "../../hooks/useAuth";
import useWallet from "../../hooks/useWallet";

const WalletButton = () => {
  const { user, updateProfile } = useAuth();
  const { walletAddress, connectWallet, walletLoading } = useWallet();

  useEffect(() => {
    const syncWallet = async () => {
      if (user && walletAddress && user.walletAddress !== walletAddress) {
        try {
          await updateProfile({ walletAddress });
        } catch (error) {
          console.error("Failed to sync wallet address", error);
        }
      }
    };

    syncWallet();
  }, [user, walletAddress, updateProfile]);

  const label = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "Connect MetaMask";

  return (
    <button type="button" className="button-secondary !px-4 !py-2" onClick={connectWallet} disabled={walletLoading}>
      {walletLoading ? "Connecting..." : label}
    </button>
  );
};

export default WalletButton;
