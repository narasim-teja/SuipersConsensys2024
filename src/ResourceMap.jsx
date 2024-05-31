import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, OrbitControls } from "@react-three/drei";
import Ground from "./Ground";
import Nature from "./Nature";
import Character from "./Character";
import * as THREE from "three";
import TeleportCylinder from './TeleportCylinder';

import { useEnokiFlow } from "@mysten/enoki/react";
import { useSuiClient } from "@mysten/dapp-kit";
import "@suiet/wallet-kit/style.css";

function ResourceMap() {
  const enokiFlow = useEnokiFlow(); // The EnokiFlow instance
  const client = useSuiClient(); // The SuiClient instance

  const [session, setSession] = useState(null);
  const [suiAddress, setSuiAddress] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const characterRef = useRef();
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);

  const fov = 60;
  const aspect = 1920 / 1080;
  const near = 1.0;
  const far = 1000.0;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(25, 10, 25);

  const light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(-100, 100, 100);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.bias = -0.001;
  light.shadow.mapSize.width = 4096;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 500.0;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500.0;
  light.shadow.camera.left = 50;
  light.shadow.camera.right = -50;
  light.shadow.camera.top = 50;
  light.shadow.camera.bottom = -50;

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

  const handleTeleport = () => {
    console.log("Teleporting...");
    window.location.href = "https://suipers.replit.app/";
  };

  return (
    <div className="w-full h-screen bg-fuchsia-100">
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
      <Canvas camera={camera}>
        <hemisphereLight {...hemiLight} />
        <directionalLight {...light} />
        <ambientLight intensity={0.1} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Ground />
          <perspectiveCamera {...camera} />
          <Character ref={characterRef} camera={camera} />
          <TeleportCylinder characterRef={characterRef} onTeleport={handleTeleport} />
          <gridHelper
            args={[1000, 300, "#101010", "#050505"]}
            position={[0, 1, 0]}
            rotation={[0, 0, 0]}
          />
          <Nature />
        </Suspense>
        <fog attach="fog" color="#ffffff" near={50} far={300} />
      </Canvas>
      <Loader
        dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`}
        initialState={(active) => active}
      />
    </div>
  );
}

export default ResourceMap;
