import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useFBX, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// 3D მოდელის კომპონენტი
function ZebraModel() {
    // 1. მოდელის ჩატვირთვა
    const fbx = useFBX('/d25.FBX') as THREE.Group;

    // 2. ტექსტურების ჩატვირთვა (გამოვიყენოთ შენი ფაილების სახელები)
    const textures = useTexture({
        main: '/textures/b4.jpg',
        mask: '/textures/mask75.jpg',
        cord: '/textures/shnur kapron.jpg',
    });

    // 3. ტექსტურების მორგება
    useMemo(() => {
        fbx.traverse((child) => {
            // TypeScript-ის შემოწმება: არის თუ არა ობიექტი Mesh
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                
                // ვამოწმებთ, არის თუ არა ეს ნაწილი თოკი
                const isCord = mesh.name.toLowerCase().includes('shnur') || 
                               mesh.name.toLowerCase().includes('cord');

                mesh.material = new THREE.MeshStandardMaterial({
                    map: isCord ? textures.cord : textures.main,
                    alphaMap: textures.mask,
                    transparent: true,
                    alphaTest: 0.5,
                    roughness: 0.8,
                    metalness: 0.1,
                    side: THREE.DoubleSide
                });
                mesh.material.needsUpdate = true;
            }
        });
    }, [fbx, textures]);

    return <primitive object={fbx} scale={0.005} position={[0, -1, 0]} />;
}

export default function ZebraPage() {
    return (
        <div style={{ width: '100vw', height: '100vh', background: '#ffffff', position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]}>
                <Suspense fallback={null}>
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

            {/* ინტერფეისის შრე */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', zIndex: 10 }}>
                <div style={{ padding: '30px', pointerEvents: 'auto' }}>
                    <h2 style={{ color: '#333', margin: 0 }}>DIO - Zebra Clis Duo</h2>
                </div>
            </div>
        </div>
    );
}
