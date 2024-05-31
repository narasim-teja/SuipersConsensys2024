import { useLoader } from "@react-three/fiber";
import React, { useMemo } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const Nature = () => {
  const [
    birch3,
    birch4,
    berry1,
    ctree3,
    ctree5,
    grass2,
    grass,
    rock1,
    rock5,
    willow2,
    willow5,
    log,
  ] = useLoader(FBXLoader, [
    "./textures/nature/BirchTree_3.fbx",
    "./textures/nature/BirchTree_4.fbx",
    "./textures/nature/BushBerries_1.fbx",
    "./textures/nature/CommonTree_3.fbx",
    "./textures/nature/CommonTree_5.fbx",
    "./textures/nature/Grass_2.fbx",
    "./textures/nature/Grass.fbx",
    "./textures/nature/Rock_1.fbx",
    "./textures/nature/Rock_5.fbx",
    "./textures/nature/Willow_2.fbx",
    "./textures/nature/Willow_5.fbx",
    "./textures/nature/WoodLog_Moss.fbx",
  ]);

  const initializeModel = (model, scale) => {
    model.scale.setScalar(scale);
    model.traverse((o) => {
      o.castShadow = true;
      o.receiveShadow = true;
    });
    return model;
  };

  const models = {
    birch3: initializeModel(birch3, 0.4),
    birch4: initializeModel(birch4, 0.3),
    berry1: initializeModel(berry1, 0.08),
    grass2: initializeModel(grass2, 0.05),
    grass: initializeModel(grass, 0.05),
    rock1: initializeModel(rock1, 0.2),
    rock5: initializeModel(rock5, 0.2),
    willow2: initializeModel(willow2, 0.4),
    willow5: initializeModel(willow5, 0.5),
    log: initializeModel(log, 0.1),
    ctree3: initializeModel(ctree3, 0.4),
    ctree5: initializeModel(ctree5, 0.4),
  };

  const createTrees = useMemo(() => {
    const objects = [];
    for (let i = 0; i < 100; i++) {
      const idx = Math.floor(Math.random() * 12);
      const pos = new THREE.Vector3(
        Math.ceil(Math.random() * 450) * (Math.round(Math.random()) ? 1 : -1),
        0,
        Math.ceil(Math.random() * 450) * (Math.round(Math.random()) ? 1 : -1)
      );

      const modelKeys = Object.keys(models);
      const model = models[modelKeys[idx]];

      objects.push(
        <primitive key={i} position={pos} object={model.clone()} />
      );
    }
    return objects;
  }, []);

  return (
    <group>
      {createTrees.map((obj) => {
        return obj;
      })}
    </group>
  );
};

export default Nature;
