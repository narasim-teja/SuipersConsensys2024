import { useFrame, useLoader } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef, forwardRef } from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";

const Character = forwardRef(({ camera }, ref) => {
  const character = ref;

  const activeAnimation = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    dance: false,
  };

  const animations = {};

  const currentPosition = new THREE.Vector3();
  const currentLookAt = new THREE.Vector3();
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
  const acceleration = new THREE.Vector3(1, 0.125, 100.0);
  const velocity = new THREE.Vector3(0, 0, 0);

  const c = useLoader(FBXLoader, "./character/character.fbx");

  c.scale.setScalar(0.1);
  c.traverse((f) => {
    f.castShadow = true;
    f.receiveShadow = true;
  });

  const mixer = new THREE.AnimationMixer(c);

  const idle = useFBX("./character/idle.fbx");

  animations["idle"] = {
    clip: mixer.clipAction(idle.animations[0]),
  };

  const walk = useFBX("./character/walking.fbx");

  animations["walk"] = {
    clip: mixer.clipAction(walk.animations[0]),
  };

  const run = useFBX("./character/running.fbx");

  animations["run"] = {
    clip: mixer.clipAction(run.animations[0]),
  };

  const dance = useFBX("./character/dance.fbx");

  animations["dance"] = {
    clip: mixer.clipAction(dance.animations[0]),
  };

  let currAction = animations["idle"].clip;

  let prevAction;

  const handleKeyPress = useCallback((event) => {
    switch (event.keyCode) {
      case 87: // w
        activeAnimation.forward = true;
        break;
      case 65: // a
        activeAnimation.left = true;
        break;
      case 83: // s
        activeAnimation.backward = true;
        break;
      case 68: // d
        activeAnimation.right = true;
        break;
      case 69: // e
        activeAnimation.dance = true;
        break;
      case 16: // shift
        activeAnimation.run = true;
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    switch (event.keyCode) {
      case 87: // w
        activeAnimation.forward = false;
        break;
      case 65: // a
        activeAnimation.left = false;
        break;
      case 83: // s
        activeAnimation.backward = false;
        break;
      case 68: // d
        activeAnimation.right = false;
        break;
      case 69: // e
        activeAnimation.dance = false;
        break;
      case 16: // shift
        activeAnimation.run = false;
        break;
    }
  }, []);

  const calculateIdealOffset = () => {
    const idealOffset = new THREE.Vector3(0, 20, -30);
    idealOffset.applyQuaternion(character.current.quaternion);
    idealOffset.add(character.current.position);
    return idealOffset;
  };

  const calculateIdealLookat = () => {
    const idealLookat = new THREE.Vector3(0, 10, 50);
    idealLookat.applyQuaternion(character.current.quaternion);
    idealLookat.add(character.current.position);
    return idealLookat;
  };

  function updateCameraTarget(delta) {
    const idealOffset = calculateIdealOffset();
    const idealLookat = calculateIdealLookat();

    const t = 1.0 - Math.pow(0.001, delta);

    currentPosition.lerp(idealOffset, t);
    currentLookAt.lerp(idealLookat, t);

    camera.position.copy(currentPosition);
  }

  const characterState = (delta) => {
    const newVelocity = velocity;
    const frameDecceleration = new THREE.Vector3(
      newVelocity.x * decceleration.x,
      newVelocity.y * decceleration.y,
      newVelocity.z * decceleration.z
    );
    frameDecceleration.multiplyScalar(delta);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(newVelocity.z));

    newVelocity.add(frameDecceleration);

    const controlObject = character.current;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = acceleration.clone();
    if (activeAnimation.run) {
      acc.multiplyScalar(2.0);
    }

    if (currAction === animations["dance"].clip) {
      acc.multiplyScalar(0.0);
    }

    if (activeAnimation.forward) {
      newVelocity.z += acc.z * delta;
    }
    if (activeAnimation.backward) {
      newVelocity.z -= acc.z * delta;
    }
    if (activeAnimation.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }
    if (activeAnimation.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(newVelocity.x * delta);
    forward.multiplyScalar(newVelocity.z * delta);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    character.current.position.copy(controlObject.position);
    updateCameraTarget(delta);
  };

  useFrame((state, delta) => {
    prevAction = currAction;

    if (activeAnimation.forward) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.left) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.right) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.backward) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.dance) {
      currAction = animations["dance"].clip;
    } else {
      currAction = animations["idle"].clip;
    }

    if (prevAction !== currAction) {
      prevAction.fadeOut(0.2);

      if (prevAction === animations["walk"].clip) {
        const ratio =
          currAction.getClip().duration / prevAction.getClip().duration;
        currAction.time = prevAction.time * ratio;
      }

      currAction.reset().play();
    } else {
      currAction.play();
    }

    characterState(delta);
    const idealLookat = calculateIdealLookat();

    state.camera.lookAt(idealLookat);
    state.camera.updateProjectionMatrix();
    mixer?.update(delta);
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handleKeyUp);

    currAction.play();
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyPress, handleKeyUp]);

  return <primitive object={c} ref={character} />;
});

export default Character;




// import { useFrame, useLoader } from "@react-three/fiber";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { useFBX } from "@react-three/drei";
// import * as THREE from "three";

// const Character = ({ camera }) => {
//   const character = useRef(null);
//   const [movements, setMovements] = useState([]);

//   const activeAnimation = useRef({
//     forward: false,
//     backward: false,
//     left: false,
//     right: false,
//     run: false,
//     dance: false,
//   });

//   const animations = useRef({});
//   const currentPosition = useRef(new THREE.Vector3());
//   const currentLookAt = useRef(new THREE.Vector3());
//   const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
//   const acceleration = new THREE.Vector3(1, 0.125, 100.0);
//   const velocity = new THREE.Vector3(0, 0, 0);

//   const c = useLoader(FBXLoader, "./character/character.fbx");

//   c.scale.setScalar(0.1);
//   c.traverse((f) => {
//     f.castShadow = true;
//     f.receiveShadow = true;
//   });

//   const mixer = new THREE.AnimationMixer(c);

//   const idle = useFBX("./character/idle.fbx");
//   animations.current["idle"] = mixer.clipAction(idle.animations[0]);

//   const walk = useFBX("./character/walking.fbx");
//   animations.current["walk"] = mixer.clipAction(walk.animations[0]);

//   const run = useFBX("./character/running.fbx");
//   animations.current["run"] = mixer.clipAction(run.animations[0]);

//   const dance = useFBX("./character/dance.fbx");
//   animations.current["dance"] = mixer.clipAction(dance.animations[0]);

//   let currAction = animations.current["idle"];
//   let prevAction = null;

//   const handleKeyPress = useCallback((event) => {
//     switch (event.keyCode) {
//       case 87: // w
//         activeAnimation.current.forward = true;
//         setMovements((prev) => [...prev, { key: "w", action: "press" }]);
//         break;
//       case 65: // a
//         activeAnimation.current.left = true;
//         setMovements((prev) => [...prev, { key: "a", action: "press" }]);
//         break;
//       case 83: // s
//         activeAnimation.current.backward = true;
//         setMovements((prev) => [...prev, { key: "s", action: "press" }]);
//         break;
//       case 68: // d
//         activeAnimation.current.right = true;
//         setMovements((prev) => [...prev, { key: "d", action: "press" }]);
//         break;
//       case 69: // e
//         activeAnimation.current.dance = true;
//         setMovements((prev) => [...prev, { key: "e", action: "press" }]);
//         break;
//       case 16: // shift
//         activeAnimation.current.run = true;
//         setMovements((prev) => [...prev, { key: "shift", action: "press" }]);
//         break;
//     }
//   }, []);

//   const handleKeyUp = useCallback((event) => {
//     switch (event.keyCode) {
//       case 87: // w
//         activeAnimation.current.forward = false;
//         setMovements((prev) => [...prev, { key: "w", action: "release" }]);
//         break;
//       case 65: // a
//         activeAnimation.current.left = false;
//         setMovements((prev) => [...prev, { key: "a", action: "release" }]);
//         break;
//       case 83: // s
//         activeAnimation.current.backward = false;
//         setMovements((prev) => [...prev, { key: "s", action: "release" }]);
//         break;
//       case 68: // d
//         activeAnimation.current.right = false;
//         setMovements((prev) => [...prev, { key: "d", action: "release" }]);
//         break;
//       case 69: // e
//         activeAnimation.current.dance = false;
//         setMovements((prev) => [...prev, { key: "e", action: "release" }]);
//         break;
//       case 16: // shift
//         activeAnimation.current.run = false;
//         setMovements((prev) => [...prev, { key: "shift", action: "release" }]);
//         break;
//     }
//   }, []);

//   const calculateIdealOffset = () => {
//     const idealOffset = new THREE.Vector3(0, 20, -30);
//     idealOffset.applyQuaternion(character.current.quaternion);
//     idealOffset.add(character.current.position);
//     return idealOffset;
//   };

//   const calculateIdealLookat = () => {
//     const idealLookat = new THREE.Vector3(0, 10, 50);
//     idealLookat.applyQuaternion(character.current.quaternion);
//     idealLookat.add(character.current.position);
//     return idealLookat;
//   };

//   function updateCameraTarget(delta) {
//     const idealOffset = calculateIdealOffset();
//     const idealLookat = calculateIdealLookat();

//     const t = 1.0 - Math.pow(0.001, delta);

//     currentPosition.current.lerp(idealOffset, t);
//     currentLookAt.current.lerp(idealLookat, t);

//     camera.position.copy(currentPosition.current);
//     camera.lookAt(currentLookAt.current);
//   }

//   const characterState = (delta) => {
//     const newVelocity = velocity;
//     const frameDecceleration = new THREE.Vector3(
//       newVelocity.x * decceleration.x,
//       newVelocity.y * decceleration.y,
//       newVelocity.z * decceleration.z
//     );
//     frameDecceleration.multiplyScalar(delta);
//     frameDecceleration.z =
//       Math.sign(frameDecceleration.z) *
//       Math.min(Math.abs(frameDecceleration.z), Math.abs(newVelocity.z));

//     newVelocity.add(frameDecceleration);

//     const controlObject = character.current;
//     const _Q = new THREE.Quaternion();
//     const _A = new THREE.Vector3();
//     const _R = controlObject.quaternion.clone();

//     const acc = acceleration.clone();
//     if (activeAnimation.current.run) {
//       acc.multiplyScalar(2.0);
//     }

//     if (currAction === animations.current["dance"]) {
//       acc.multiplyScalar(0.0);
//     }

//     if (activeAnimation.current.forward) {
//       newVelocity.z += acc.z * delta;
//     }
//     if (activeAnimation.current.backward) {
//       newVelocity.z -= acc.z * delta;
//     }
//     if (activeAnimation.current.left) {
//       _A.set(0, 1, 0);
//       _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y);
//       _R.multiply(_Q);
//     }
//     if (activeAnimation.current.right) {
//       _A.set(0, 1, 0);
//       _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y);
//       _R.multiply(_Q);
//     }

//     controlObject.quaternion.copy(_R);

//     const forward = new THREE.Vector3(0, 0, 1);
//     forward.applyQuaternion(controlObject.quaternion);
//     forward.normalize();

//     const sideways = new THREE.Vector3(1, 0, 0);
//     sideways.applyQuaternion(controlObject.quaternion);
//     sideways.normalize();

//     sideways.multiplyScalar(newVelocity.x * delta);
//     forward.multiplyScalar(newVelocity.z * delta);

//     controlObject.position.add(forward);
//     controlObject.position.add(sideways);

//     character.current.position.copy(controlObject.position);
//     updateCameraTarget(delta);
//   };

//   useFrame((state, delta) => {
//     prevAction = currAction;

//     if (activeAnimation.current.forward) {
//       if (activeAnimation.current.run) {
//         currAction = animations.current["run"];
//       } else {
//         currAction = animations.current["walk"];
//       }
//     } else if (activeAnimation.current.left) {
//       if (activeAnimation.current.run) {
//         currAction = animations.current["run"];
//       } else {
//         currAction = animations.current["walk"];
//       }
//     } else if (activeAnimation.current.right) {
//       if (activeAnimation.current.run) {
//         currAction = animations.current["run"];
//       } else {
//         currAction = animations.current["walk"];
//       }
//     } else if (activeAnimation.current.backward) {
//       if (activeAnimation.current.run) {
//         currAction = animations.current["run"];
//       } else {
//         currAction = animations.current["walk"];
//       }
//     } else if (activeAnimation.current.dance) {
//       currAction = animations.current["dance"];
//     } else {
//       currAction = animations.current["idle"];
//     }

//     if (prevAction !== currAction) {
//       prevAction.fadeOut(0.2);

//       if (prevAction === animations.current["walk"]) {
//         const ratio =
//           currAction.getClip().duration / prevAction.getClip().duration;
//         currAction.time = prevAction.time * ratio;
//       }

//       currAction.reset().play();
//     } else {
//       currAction.play();
//     }

//     characterState(delta);
//     const idealLookat = calculateIdealLookat();

//     state.camera.lookAt(idealLookat);
//     state.camera.updateProjectionMatrix();
//     mixer.update(delta);
//   });

//   useEffect(() => {
//     document.addEventListener("keydown", handleKeyPress);
//     document.addEventListener("keyup", handleKeyUp);

//     currAction.play();
//     return () => {
//       document.removeEventListener("keydown", handleKeyPress);
//       document.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [handleKeyPress, handleKeyUp]);

//   useEffect(() => {
//     if (movements.length > 0) {
//       console.log("Recorded movements:", movements);
//     }
//   }, [movements]);

//   return <primitive object={c} ref={character} />;
// };

// export default Character;
