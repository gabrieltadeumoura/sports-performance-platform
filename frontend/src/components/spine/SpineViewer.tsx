import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  useGLTF,
  Environment,
} from '@react-three/drei'
import { Box3, Vector3, Group, Object3D } from 'three'
import { Loading } from '../ui/loading'

function SpineModel({ onLoaded }: { onLoaded?: () => void }) {
  const { scene } = useGLTF('/models/spine.glb')
  const modelRef = useRef<Group>(null)
  const { camera } = useThree()

  useEffect(() => {
    if (!modelRef.current || !scene) return

    const fixInvertedTexts = (object: Object3D) => {
      object.traverse((child) => {
        if (child.scale.x < 0) {
          child.scale.x *= -1
        }
        if (child.name && (child.name.toLowerCase().includes('text') || child.name.toLowerCase().includes('label'))) {
          if (child.scale.x < 0) {
            child.scale.x *= -1
          }
          if (Math.abs(child.rotation.y) > Math.PI / 2) {
            child.rotation.y += Math.PI
          }
        }
      })
    }

    fixInvertedTexts(scene)

    const box = new Box3().setFromObject(scene)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 1.5 / maxDim

    scene.scale.multiplyScalar(scale)
    scene.position.sub(center.multiplyScalar(scale))

    const newBox = new Box3().setFromObject(scene)
    const newSize = newBox.getSize(new Vector3())
    const distance = Math.max(newSize.x, newSize.y, newSize.z) * 1.2

    camera.position.set(-distance, 0, 0)
    camera.lookAt(0, 0, 0)

    if (onLoaded) {
      onLoaded()
    }
  }, [scene, camera, onLoaded])

  return <primitive ref={modelRef} object={scene} />
}

function SceneContent({ onModelLoaded }: { onModelLoaded: () => void }) {
  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} />
      <pointLight position={[0, 5, 0]} intensity={0.4} />
      <Suspense fallback={null}>
        <SpineModel onLoaded={onModelLoaded} />
      </Suspense>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={0.5}
        maxDistance={15}
        target={[0, 0, 0]}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        panSpeed={0.8}
      />
    </>
  )
}

export function SpineViewer() {
  const [isLoading, setIsLoading] = useState(true)

  const handleModelLoaded = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #ccfbf1 0%, #14b8a6 50%, #0d9488 100%)',
        }}
      >
        <Canvas
          camera={{ position: [-5, 0, 0], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          className="bg-transparent"
        >
          <SceneContent onModelLoaded={handleModelLoaded} />
        </Canvas>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
          <Loading size="lg" text="Carregando modelo 3D..." />
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-secondary-200">
        <p className="text-xs text-secondary-600">
          <span className="font-medium">Controles:</span> Arraste para rotacionar • Scroll para zoom • Clique e arraste para mover
        </p>
      </div>
    </div>
  )
}
