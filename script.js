import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useFBX, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function ZebraModel() {
  // 1. მოდელის ჩატვირთვა
  const fbx = useFBX('/d25.FBX');

  // 2. შენი კონკრეტული ტექსტურების ჩატვირთვა
  const textures = useTexture({
    main: '/textures/b4.jpg',           // მთავარი ფერი/ფაქტურა
    mask: '/textures/mask75.jpg',       // მასკა (თუ საჭიროა გამჭვირვალობისთვის)
    cord: '/textures/shnur kapron.jpg', // თოკის ტექსტურა
  });

  // 3. ტექსტურების მორგება მოდელზე
  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        // ვამოწმებთ მოდელის ნაწილის სახელს, რომ სწორი ტექსტურა დავადოთ
        // თუ სახელი შეიცავს "shnur"-ს, ვადებთ თოკის ტექსტურას, დანარჩენზე - მთავარს
        const isCord = child.name.toLowerCase().includes('shnur') || child.name.toLowerCase().includes('cord');
        
        child.material = new THREE.MeshStandardMaterial({
          map: isCord ? textures.cord : textures.main,
          alphaMap: textures.mask, // იყენებს mask75.jpg-ს გამჭვირვალობისთვის
          transparent: true,
          roughness: 0.7,
          metalness: 0.1,
        });
        
        child.material.needsUpdate = true;
      }
    });
  }, [fbx, textures]);

  return <primitive object={fbx} scale={0.005} position={[0, -1, 0]} />;
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#ffffff', position: 'relative' }}>
      
      {/* 3D სცენა */}
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={<div>იტვირთება ჟალუზი...</div>}>
          <Stage environment="apartment" intensity={0.8} contactShadow={true}>
            <ZebraModel />
          </Stage>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        </Suspense>

        <OrbitControls 
          makeDefault 
          enableZoom={true} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.5} 
        />
      </Canvas>

      {/* ინტერფეისი (ჩატი და მენიუ) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', zIndex: 10 }}>
        <div style={{ padding: '30px', pointerEvents: 'auto' }}>
          <h2 style={{ color: '#333', margin: 0 }}>DIO - Zebra Blinds</h2>
        </div>
        
        {/* შენი ჩატბოტის ღილაკი */}
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', pointerEvents: 'auto' }}>
           {/* აქ ჩასვი შენი ჩატის კოდი */}
        </div>
      </div>

    </div>
  );
}
