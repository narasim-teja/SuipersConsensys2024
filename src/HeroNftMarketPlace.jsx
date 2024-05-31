import React, { useState, useEffect } from 'react';
import Card from './Card';
import WeaponsCard from './WeaponsCard';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useNavigate } from 'react-router-dom';
import { useEnokiFlow } from "@mysten/enoki/react";
import { useSuiClient } from "@mysten/dapp-kit";
import "@suiet/wallet-kit/style.css";
import { Toaster, toast } from 'react-hot-toast';

const HeroNftMarketPlace = () => {
  const client = useSuiClient(); // The SuiClient instance
  const enokiFlow = useEnokiFlow(); // The EnokiFlow instance

  const [session, setSession] = useState(null);
  const [suiAddress, setSuiAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [accountLoading, setAccountLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(''); // Added the missing state
  const [counterLoading, setCounterLoading] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [nftCount, setNftCount] = useState(0); // Added state to store the number of NFTs

  const navigate = useNavigate();

  const handleDeployHero = async () => {
    await incrementCounter("1","2","2");
    navigate('/home-base');
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

  async function incrementCounter(name, strength, address) {
    
      setCounterLoading(true);
      console.log("In here");

      // Create a new transaction block
      const txb = new TransactionBlock();

      // Add some transactions to the block...
      txb.moveCall({
        arguments: [
          txb.pure.string(name),
          txb.pure.string(strength),
          txb.pure.string(""),
          txb.pure.address(address),
        ],
        target:
          "0x9b32a12ad79bbbac0cb6c2d01a0e47c35baaab90dbd722dd4f20a4b7b61360ef::nft::mint_and_transfer",
      });

      try {
        // Sponsor and execute the transaction block, using the Enoki keypair
        const res = await enokiFlow.sponsorAndExecuteTransactionBlock({
          transactionBlock: txb,
          network: "testnet",
          client,
        });
        setCounterLoading(false);
        console.log(res);
        return res;
      } catch (error) {
        setCounterLoading(false);
        throw error;
      }
    };


  const mintNFT = (name, strength) => {
    incrementCounter(name, strength, suiAddress);
  };

  const fetchNFTs = async () => {
    if (!suiAddress) return;
    try {
      const objects = await client.getOwnedObjects({ owner: suiAddress });
      console.log(objects);
      const nftData = objects.data.filter(obj => obj.type && obj.type.includes("nft"));
      console.log("NFTs:", objects.data.length);
      setNfts(nftData);
      setNftCount(objects.data.length); // Update the number of NFTs
    } catch (error) {
      console.error("Error fetching NFTs", error);
    }
  };

  async function MintHomeBase() {
    setCounterLoading(true);

    // Create a new transaction block
    const txb = new TransactionBlock();

    txb.moveCall({
      arguments: [
        txb.pure("0xd710735500fc1be7dc448b783ad1fb0b5fd209890a67e518cc47e7dc26856aa6"),
        
      ],
      target:
        "0x9b32a12ad79bbbac0cb6c2d01a0e47c35baaab90dbd722dd4f20a4b7b61360ef::nft::mint_and_transfer",
    });

    try {
      // Sponsor and execute the transaction block, using the Enoki keypair
      const res = await enokiFlow.sponsorAndExecuteTransactionBlock({
        transactionBlock: txb,
        network: "testnet",
        client,
      });
      setCounterLoading(false);
      console.log(res);
      return res;
    } catch (error) {
      setCounterLoading(false);
      throw error;
    }
  }

  const heroes = [
    {
      image: "./hero.webp",
      price: "FREE",
      assault: "50",
      heal: "30",
      shield: "20",
      level: "1",
      info: "This hero excels in assault with moderate healing capabilities.",
      type: "Common",
    },
    {
      image: "./hero.webp",
      price: "10 SUI",
      assault: "60",
      heal: "40",
      shield: "30",
      level: "2",
      info: "A balanced hero with strong assault and healing abilities.",
      type: "Rare",
    },
    {
      image: "./hero.webp",
      price: "25 SUI",
      assault: "70",
      heal: "50",
      shield: "40",
      level: "3",
      info: "This hero has superior assault skills and excellent healing power.",
      type: "Epic",
    },
    {
      image: "./hero.webp",
      price: "50 SUI",
      assault: "80",
      heal: "60",
      shield: "50",
      level: "4",
      info: "A top-tier hero with unmatched assault and healing capabilities.",
      type: "Legendary",
    },
  ];

  const weapons = [
    {
      image: "./weapon1.webp",
      name: "Sword of Power",
      price: "5 SUI",
    },
    {
      image: "./weapon2.webp",
      name: "Shield of Valor",
      price: "8 SUI",
    },
    {
      image: "./weapon3.webp",
      name: "Bow of Speed",
      price: "7 SUI",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster />
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">HERO NFT MARKETPLACE</h1>
        <div className="bg-white text-blue-500 font-semibold rounded-2xl shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 p-2 space-y-2">
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
                window.location.href =
                  await enokiFlow.createAuthorizationURL({
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
      </div>

      <div className="flex flex-col items-center p-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => setSelectedOption("mint")}
        >
          Mint to Play
        </button>
        <button
          onClick={handleDeployHero}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Deploy the Hero
        </button>
      </div>
      <div className="flex justify-center space-x-4 p-4">
        <button
          className={`py-2 px-4 rounded ${
            selectedOption === "mint" ? "bg-gray-700" : "bg-gray-800"
          }`}
          onClick={() => {
            setSelectedOption("mint");
          }}
        >
          Mint Hero NFTs
        </button>
        <button
          className={`py-2 px-4 rounded ${
            selectedOption === "weapons" ? "bg-gray-700" : "bg-gray-800"
          }`}
          onClick={() => setSelectedOption("weapons")}
        >
          Purchase Weapons
        </button>
        <button
          className={`py-2 px-4 rounded ${
            selectedOption === "account" ? "bg-gray-700" : "bg-gray-800"
          }`}
          onClick={() => {
            setSelectedOption("account");
            fetchNFTs();
          }}
        >
          Your Account
        </button>
      </div>
      {selectedOption === "mint" && (
        <div className="overflow-y-auto p-4 max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {heroes.map((hero, index) => (
              <Card
                key={index}
                image={hero.image}
                price={hero.price}
                assault={hero.assault}
                heal={hero.heal}
                shield={hero.shield}
                level={hero.level}
                info={hero.info}
                type={hero.type}
                onMint={mintNFT}
              />
            ))}
          </div>
        </div>
      )}
      {selectedOption === "weapons" && (
        <div className="overflow-y-auto p-4 max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {weapons.map((weapon, index) => (
              <WeaponsCard
                key={index}
                image={weapon.image}
                name={weapon.name}
                price={weapon.price}
              />
            ))}
          </div>
        </div>
      )}
      {selectedOption === "account" && (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-white text-2xl font-bold text-center">
            Number of NFTs: {nftCount}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroNftMarketPlace;
