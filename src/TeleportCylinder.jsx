import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TeleportCylinder = ({ characterRef, onTeleport }) => {
  const cylinderRef = React.useRef();

  useFrame(() => {
    if (!characterRef.current || !cylinderRef.current) return;

    const characterPosition = new THREE.Vector3();
    characterRef.current.getWorldPosition(characterPosition);

    const cylinderPosition = new THREE.Vector3();
    cylinderRef.current.getWorldPosition(cylinderPosition);

    const distance = characterPosition.distanceTo(cylinderPosition);

    // Debug logs to verify positions and distance
    // console.log('Character Position:', characterPosition);
    // console.log('Cylinder Position:', cylinderPosition);
    // console.log('Distance:', distance);

    // Adjust the radius as per your cylinder size
    if (distance < 10) {
      console.log('Teleport triggered');
      onTeleport();
    }
  });

  return (
    <mesh ref={cylinderRef} position={[-3, 1, 40]}>
      <cylinderGeometry args={[20, 20, 150, 32, 1, true]} />
      <meshStandardMaterial color="blue" wireframe />
    </mesh>
  );
};

export default TeleportCylinder;
