import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useEnokiFlow } from "@mysten/enoki/react";

import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { getFaucetHost, requestSuiFromFaucetV0 } from "@mysten/sui.js/faucet";

import { toast } from "sonner";
// import { BalanceChange } from "@mysten/sui.js/client";

const LandingPage = () => {
  const client = useSuiClient(); // The SuiClient instance
  const enokiFlow = useEnokiFlow(); // The EnokiFlow instance

  const [session, setSession] = useState(null);
  const [suiAddress, setSuiAddress] = useState(null);
  console.log(suiAddress);
  const [balance, setBalance] = useState(0);
  const [accountLoading, setAccountLoading] = useState(true);

  const navigate = useNavigate();

  const handleJoinNow = () => {
    navigate('/hero-NFT-marketPlace');
  };

  useEffect(() => {
    completeLogin();
  }, []);

  useEffect(() => {
    if (session) {
      getAccountInfo();
    }
  }, [session]);

  const completeLogin = async () => {
    try {
      await enokiFlow.handleAuthCallback();
    } catch (error) {
      console.error("Error handling auth callback", error);
    } finally {
      const session = await enokiFlow.getSession();
      console.log("Session", session);

      if (session && session.jwt) {
        setSession(session);
      }

      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const getAccountInfo = async () => {
    setAccountLoading(true);

    const keypair = await enokiFlow.getKeypair({ network: "testnet" });
    const address = keypair.toSuiAddress();
    setSuiAddress(address);

    const balance = await client.getBalance({ owner: address });
    setBalance(parseInt(balance.totalBalance) / 10 ** 9);

    setAccountLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 px-4 overflow-hidden">
      <div className="absolute top-4 right-4 bg-white text-blue-500 font-semibold rounded-2xl shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 z-10 p-4 space-y-2">
        {session && suiAddress ? (
          <>
            <div>{suiAddress}</div>
            <button
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              onClick={async () => {
                await enokiFlow.logout();
                window.location.reload();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={async () => {
              window.location.href = await enokiFlow.createAuthorizationURL({
                provider: "google",
                clientId: import.meta.env.REACT_APP_GOOGLE_CLIENT_ID,
                redirectUrl: window.location.href.split("#")[0],
                network: "testnet",
              });
            }}
          >
            Sign in with Google
          </button>
        )}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 text-center z-10">
        Welcome to SuiPPERS
      </h1>
      {session && (
        <button onClick={handleJoinNow} className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 z-10">
          Join Now
        </button>
      )}
      <div className="absolute inset-0 z-0">
        <img src="/landing.webp" alt="Battlefield Background" className="w-full h-full object-cover opacity-80" />
      </div>
    </div>
  );
};

export default LandingPage;
