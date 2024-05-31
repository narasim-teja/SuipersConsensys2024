import React from 'react';
import { extend } from '@react-three/fiber';
import { CylinderGeometry, MeshStandardMaterial } from 'three';
import { Text } from '@react-three/drei';
import md5 from 'md5';

// Extend the Three.js namespace
extend({ CylinderGeometry, MeshStandardMaterial });

// Function to convert wallet address to a color
const getColorFromWallet = (walletAddress) => {
  const hash = md5(walletAddress);
  const r = parseInt(hash.slice(0, 2), 16);
  const g = parseInt(hash.slice(2, 4), 16);
  const b = parseInt(hash.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

const Experience = ({ tileSpacing = 4.4, tileWidth = 10, position = [0, 0, 0], tilesData, walletAddress }) => {
  const generateHexagonGrid = () => {
    let result = [];
    const tileSize = (tileWidth / Math.sqrt(3)) * 1;

    // Calculate grid positions relative to the center
    const positions = [];

    for (let q = -tilesData.length; q <= tilesData.length; q++) {
      for (let r = Math.max(-tilesData.length, -q - tilesData.length); r <= Math.min(tilesData.length, -q + tilesData.length); r++) {
        const s = -q - r;
        positions.push({ q, r, s });
      }
    }

    positions.sort((a, b) => Math.abs(a.q) + Math.abs(a.r) + Math.abs(a.s) - (Math.abs(b.q) + Math.abs(b.r) + Math.abs(b.s)));

    positions.slice(0, tilesData.length).forEach(({ q, r }, index) => {
      const x = (q - r) * (tileSize + tileSpacing) * Math.sqrt(3) / 2;
      const z = (q + r) * (tileSize + tileSpacing) * 3 / 2;
      const tileData = tilesData.find(tile => tile.position === index + 1);
      const color = tileData ? getColorFromWallet(tileData.wallet) : 'gray';
      const isCurrentWallet = tileData && tileData.wallet === walletAddress;

      const label = `(${q}, ${r}) #${index + 1}`; // Label for each hexagon

      result.push(
        <mesh
          key={`${q}-${r}`}
          position={[x + position[0], position[1], z + position[2]]}
          receiveShadow
        >
          <cylinderGeometry args={[tileWidth, tileWidth, 1, 6]} />
          <meshStandardMaterial attach="material" color={color} />
          <Text
            position={[0, 1, 0]} // Position the text above the hexagon
            fontSize={1}
            rotation={[-Math.PI / 2, 0, 0]}
            color={isCurrentWallet ? "yellow" : "#fff000"}
          >
            {label}
          </Text>
          {isCurrentWallet && (
            <Text
              position={[0, 1, 0.5]} // Position the "Home Base" text below the position text
              fontSize={1}
              rotation={[-Math.PI / 2, 0, 0]}
              color="yellow"
            >
              Home Base
            </Text>
          )}
        </mesh>
      );
    });

    return result;
  };

  return <>{generateHexagonGrid()}</>;
};

export default Experience;
