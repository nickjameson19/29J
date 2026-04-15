import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useFBX, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function ZebraModel() {
  // 1. მოდელის ჩატვირთვა
  const fbx = useFBX('/d25.FBX');

  // 2. ტექსტურების ჩატვირთვა (ზუსტი სახელები შენი ფაილებიდან)
  const textures = useTexture({
    main: '/textures/b4.jpg',           // ძირითადი ქსოვილი
    mask: '/textures/mask75.jpg',       // გამჭვირვალობის ფენა
    cord: '/textures/shnur kapron.jpg', // თოკი/შნური
  });

  // ტექსტურების ოპტიმიზაცია რეალისტურობისთვის
  textures.main.encoding = THREE.sRGBEncoding;
  textures.main.wrapS = textures.main.wrapT = THREE.RepeatWrapping;

  // 3. ტექსტურების მორგება მოდელის დეტალებზე
  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        // ვამოწმებთ, არის თუ არა ეს დეტალი თოკი (სახელის მიხედვით)
        const isCord = child.name.toLowerCase().includes('shnur') || child.name.toLowerCase().includes('line');

        child.material = new THREE.MeshStandardMaterial({
          map: isCord ? textures.cord : textures.main,
          alphaMap: textures.mask,
          transparent: true, // აუცილებელია mask75-ის მუშაობისთვის
          alphaTest: 0.5,    // უკეთესი გამჭვირვალობისთვის
          roughness: 0.8,
          metalness: 0.1,
          side: THREE.DoubleSide // რომ ჟალუზი ორივე მხრიდან ჩანდეს
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
        <Suspense fallback={<div style={{ padding: '20px' }}>იტვირთება 3D მოდელი...</div>}>
          {/* Stage ქმნის ავტომატურ განათებას და ჩრდილებს */}
          <Stage environment="apartment" intensity={0.8} contactShadow={true}>
            <ZebraModel />
          </Stage>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        </Suspense>

        {/* მაუსით კონტროლი */}
        <OrbitControls 
          makeDefault 
          enableZoom={true} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.5} 
        />
      </Canvas>

      {/* ინტერფეისი (მენიუ, ჩატი) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', zIndex: 10 }}>
        <div style={{ padding: '30px', pointerEvents: 'auto' }}>
          <h2 style={{ color: '#333', margin: 0 }}>DIO - Zebra Clis Duo</h2>
        </div>
        
        {/* შენი ჩატბოტის ადგილი */}
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', pointerEvents: 'auto' }}>
           {/* აქ ჩასვი შენი ჩატის კომპონენტი */}
        </div>
      </div>

    </div>
  );
}
