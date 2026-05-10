import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';

function Particles() {
  const count = 200;
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const time = Math.random() * 100;
        const factor = Math.random() * 2 + 1.5;
        const speed = Math.random() * 0.01 + 0.005;
        const x = Math.random() * 30 - 15;
        const y = Math.random() * 30 - 15;
        const z = Math.random() * 20 - 10;
        temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { factor, speed, x, y, z } = particle;
      const t = (particle.time += speed / 2);
      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.updateMatrix();
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
    </instancedMesh>
  );
}

function MainShape() {
    const solidRef = useRef<THREE.Mesh>(null);
    const shardsRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    
    // Generate fragments based on TorusKnot geometry
    const fragments = useMemo(() => {
        const geom = new THREE.TorusKnotGeometry(1.5, 0.4, 64, 16);
        const pos = geom.getAttribute('position');
        const norm = geom.getAttribute('normal');
        const frags = [];
        for(let i=0; i<pos.count; i++) {
            frags.push({
                x: pos.getX(i), y: pos.getY(i), z: pos.getZ(i),
                nx: norm.getX(i), ny: norm.getY(i), nz: norm.getZ(i),
                random: Math.random(),
                rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: Math.random() * Math.PI
            });
        }
        return frags;
    }, []);

    useFrame((state) => {
        const scrollY = window.scrollY || 0;
        const scrollPct = Math.min(Math.max(scrollY / 1500, 0), 1);
        const baseRotX = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
        const baseRotY = state.clock.elapsedTime * 0.2;

        if (solidRef.current) {
            solidRef.current.rotation.x = baseRotX;
            solidRef.current.rotation.y = baseRotY;
            const mat = solidRef.current.material as THREE.MeshPhysicalMaterial;
            mat.transparent = true;
            mat.opacity = Math.max(0, 1 - scrollPct * 2.5); // Fade out over first 40%
            solidRef.current.visible = scrollPct < 0.4;
        }

        if (shardsRef.current) {
            shardsRef.current.rotation.x = baseRotX;
            shardsRef.current.rotation.y = baseRotY;
            shardsRef.current.visible = scrollPct > 0;

            if (scrollPct > 0) {
                fragments.forEach((frag, i) => {
                    // Gradual shatter movement
                    const explosionProgress = Math.max(0, scrollPct - 0.1); 
                    const explodeEase = Math.pow(explosionProgress, 1.5);
                    
                    const explodeDist = explodeEase * 30 * (frag.random + 0.2);
                    const lift = explodeEase * 15;

                    dummy.position.set(
                        frag.x + frag.nx * explodeDist,
                        frag.y + frag.ny * explodeDist + lift,
                        frag.z + frag.nz * explodeDist
                    );
                    
                    const rotSpeed = explodeEase * state.clock.elapsedTime * frag.random * 3;
                    dummy.rotation.set(
                        frag.rx + rotSpeed,
                        frag.ry + rotSpeed,
                        frag.rz + rotSpeed
                    );
                    
                    let scale = 0;
                    if (scrollPct < 0.4) {
                        scale = (scrollPct / 0.4); 
                    } else {
                        // Slowly scale down between 0.4 and 1.0 (length 0.6)
                        const fadePct = (scrollPct - 0.4) / 0.6;
                        scale = Math.max(0, 1 - Math.pow(fadePct, 2));
                    }
                    
                    dummy.scale.set(scale, scale, scale);
                    dummy.updateMatrix();
                    shardsRef.current!.setMatrixAt(i, dummy.matrix);
                });
                shardsRef.current.instanceMatrix.needsUpdate = true;
            }
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={solidRef} scale={1.2}>
                <torusKnotGeometry args={[1.5, 0.4, 128, 64]} />
                <MeshTransmissionMaterial 
                    backside samples={4} thickness={0.5} chromaticAberration={0.03}
                    anisotropy={0.1} distortion={0.3} distortionScale={0.5}
                    temporalDistortion={0.1} color="#ffffff" resolution={1024}
                />
            </mesh>
            <instancedMesh ref={shardsRef} args={[undefined, undefined, fragments.length]} visible={false} scale={1.2}>
                <tetrahedronGeometry args={[0.08, 0]} />
                <MeshTransmissionMaterial 
                    backside samples={4} thickness={0.5} chromaticAberration={0.05}
                    anisotropy={0.1} distortion={0.5} distortionScale={0.5}
                    temporalDistortion={0.1} color="#ffffff" resolution={512}
                />
            </instancedMesh>
        </Float>
    )
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 opacity-50">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 40 }} 
        dpr={[1, 2]}
        eventSource={typeof window !== 'undefined' ? document.body : undefined}
      >
        <fog attach="fog" args={['#050505', 8, 25]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} intensity={3} angle={0.15} penumbra={1} color="#ffffff" />
        <spotLight position={[-10, -10, -10]} intensity={5} angle={0.15} penumbra={1} color="#555555" />
        
        <MainShape />
        <Particles />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
