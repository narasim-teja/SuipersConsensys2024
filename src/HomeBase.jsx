import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Experience from './Experience';
import { useNavigate } from 'react-router-dom';

import { useEnokiFlow } from "@mysten/enoki/react";
import { useSuiClient } from "@mysten/dapp-kit";
import "@suiet/wallet-kit/style.css";

const HomeBase = () => {
  const enokiFlow = useEnokiFlow(); // The EnokiFlow instance
  const client = useSuiClient(); // The SuiClient instance

  const [session, setSession] = useState(null);
  const [suiAddress, setSuiAddress] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [tilesData, setTilesData] = useState([]);
  console.log(tilesData)
  const navigate = useNavigate();

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
      if (session && session.jwt) {
        setSession(session);
      }
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const getAccountInfo = async () => {
    const keypair = await enokiFlow.getKeypair({ network: "testnet" });
    const address = keypair.toSuiAddress();
    setSuiAddress(address);
    setWalletAddress(address);

    const balance = await client.getBalance({ owner: address });
    console.log('Balance:', balance.totalBalance);
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('tilesData')) || [];
    setTilesData(storedData);
  }, []);

  useEffect(() => {
    if (walletAddress && !tilesData.some(tile => tile.wallet === walletAddress)) {
      const newTile = {
        wallet: walletAddress,
        position: tilesData.length + 1
      };
      const updatedTilesData = [...tilesData, newTile];
      setTilesData(updatedTilesData);
      localStorage.setItem('tilesData', JSON.stringify(updatedTilesData));
    }
  }, [walletAddress, tilesData]);

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <button
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate('/resource-map')}
        >
          Resource Map
        </button>
      </div>
      <div className="absolute top-4 right-4 z-10 bg-white text-blue-500 font-semibold rounded-2xl shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 p-2 space-y-2">
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
      <Canvas
        style={{ height: "100vh" }}
        camera={{ position: [0, 80, 0], zoom: 1 }}
      >
        <Suspense fallback={null}>
          {walletAddress ? (
            <Experience
              tileSpacing={2}
              tileWidth={4}
              tilesData={tilesData}
              walletAddress={walletAddress}
            />
          ) : null}
          <Environment preset="forest" />
        </Suspense>
        <OrbitControls enablePan={false} />
        <gridHelper
          args={[200, 40, "#101010", "#050505"]}
          position={[0, -3, 0]}
          rotation={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default HomeBase;
