
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Button3D from "../3D Objects/Button";
import {
  OrbitControls,
  Stage,
  useGLTF,
  Preload,
  Stars,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Root } from "@react-three/uikit/dist/root";
import { Text } from "@react-three/uikit/dist/Text";
import { Content } from "@react-three/uikit/dist/content";
import { Container } from "@react-three/uikit/dist/container";

type CyberpunkStoreFrontProps = { url?: string };
function Model({ url = "/3dModels/neonBG.glb" }: CyberpunkStoreFrontProps) {
  const { scene } = useGLTF(url);
  scene.rotation.y = Math.PI; 
  scene.position.x = -0.5; 
  scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2); 

  return <primitive object={scene} scale={[10, 10, 10]} />;
}

export default function CyberpunkStoreFront({ url }: CyberpunkStoreFrontProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };
  const isDesktop = window.innerWidth > 768; 
  const zoom = isDesktop ? 7 : 12; 
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{
          fov: 100,
          position: [101.98700844028129, 8.824833678051316, 124.91157525205487], 
          zoom: zoom,
          near: 0.1,
          far: 1000,
          rotation: [
            -0.07053267623317762, 0.683492537059501, 0.04458617161965562,
          ], 
        }}
        gl={{ antialias: true }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          camera.lookAt(0, 0, 0);
        }}
      >
        <Suspense fallback={null}>
          <Stage
            preset="soft"
            intensity={1}
            environment="night"
            shadows={false}
          >
            <Model url={url} />
          </Stage>
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Suspense>

        

        <OrbitControls
          enablePan={false}
          enableZoom={false} 
          autoRotate={true}
          target={[0, 0, 0]} 
          autoRotateSpeed={0.1} 
          enableDamping={true} 
          rotateSpeed={0.5} 
          minAzimuthAngle={-Math.PI / 18} 
          maxAzimuthAngle={Math.PI / 18 + 1}
          minPolarAngle={Math.PI / 2 - Math.PI / 18} 
          maxPolarAngle={Math.PI / 2 + Math.PI / 200}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0}
            intensity={1}
            mipmapBlur
          />
        </EffectComposer>

        <Preload all />
      </Canvas>
    </div>
  );
}
