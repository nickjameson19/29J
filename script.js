import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useFBX, PerspectiveCamera } from '@react-three/drei';

// 3D მოდელის კომპონენტი
function ZebraModel() {
  // დარწმუნდი, რომ ფაილის სახელი ზუსტად ემთხვევა: d25.FBX
  const fbx = useFBX('/d25.FBX'); 
  return <primitive object={fbx} scale={0.005} />;
}

export default function MyPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#ffffff', overflow: 'hidden' }}>
      
      {/* --- 3D სექცია (ჟალუზი) --- */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas shadows>
          <Suspense fallback={null}>
            <Stage environment="apartment" intensity={0.7} contactShadow={true}>
              <ZebraModel />
            </Stage>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          </Suspense>
          {/* მაუსით ტრიალის კონტროლი */}
          <OrbitControls enableZoom={true} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
        </Canvas>
      </div>

      {/* --- ინტერფეისის შრე (ჩატი, მენიუ, ტექსტი) --- */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none', height: '100%' }}>
        
        {/* მენიუ */}
        <nav style={{ pointerEvents: 'auto', padding: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>DIO.GE</div>
          <div>მენიუ</div>
        </nav>

        {/* მთავარი სათაური */}
        <div style={{ padding: '50px', maxWidth: '500px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>ზებრა ჟალუზები</h1>
          <p>მართე სინათლე შენს ოთახში თანამედროვე 3D ტექნოლოგიით.</p>
        </div>

        {/* ჩატი - აქ ჩაჯდება შენი არსებული ჩატი */}
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', pointerEvents: 'auto' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: '#007AFF', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            💬
          </div>
        </div>

      </div>
    </div>
  );
}
