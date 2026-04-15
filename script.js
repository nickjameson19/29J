import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useFBX, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// 3D მოდელის კომპონენტი ტექსტურებით
function ZebraModel() {
  // 1. ტვირთავთ FBX მოდელს
  const fbx = useFBX('/d25.FBX');

  // 2. ტვირთავთ ტექსტურას (შეცვალე 'texture_name.jpg' შენი ფაილის ზუსტი სახელით)
  // თუ რამდენიმეა, შეგიძლია მასივი გამოიყენო
  const texture = useTexture('/textures/your_fabric_texture.jpg'); 

  // 3. ტექსტურის მორგება (Mapping)
  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        // ვანიჭებთ ტექსტურას მოდელის ნაწილებს
        child.material.map = texture;
        child.material.needsUpdate = true;
        
        // თუ მოდელი ძალიან მუქია, დავამატოთ მეტალის ეფექტის შემცირება
        if (child.material) {
          child.material.roughness = 0.5;
          child.material.metalness = 0.2;
        }
      }
    });
  }, [fbx, texture]);

  return <primitive object={fbx} scale={0.005} position={[0, -1, 0]} />;
}

export default function ZebraApp() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f0f0f0', position: 'relative' }}>
      
      {/* 3D სცენა - Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          {/* Stage ქმნის პროფესიონალურ განათებას */}
          <Stage environment="apartment" intensity={0.8} contactShadow={true} shadowBias={-0.001}>
            <ZebraModel />
          </Stage>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        </Suspense>

        {/* კონტროლი: ტრიალი და ზუმი */}
        <OrbitControls 
          makeDefault 
          enableZoom={true} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.5} 
        />
      </Canvas>

      {/* ინტერფეისი ზემოდან (ჩატი და ა.შ.) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', zIndex: 10 }}>
        <header style={{ padding: '20px', pointerEvents: 'auto' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>DIO - Zebra Blinds</h1>
        </header>
        
        {/* შენი ჩატბოტი და სხვა ელემენტები ჩაჯდება აქ */}
      </div>

    </div>
  );
}
