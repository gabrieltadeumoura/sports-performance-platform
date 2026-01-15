import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function SpineModel() {
  const { scene } = useGLTF('/models/spine.glb')
  return <primitive object={scene} />
}

export function SpineViewer() {
  return (
    <Canvas
      camera={{ position: [0, 0, 0.8], fov: 50 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#09090b']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} />
      <Suspense fallback={null}>
        <SpineModel />
      </Suspense>
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={0.05}
        maxDistance={10}
        target={[0, 0, 0]}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
      />
    </Canvas>
  )
}
