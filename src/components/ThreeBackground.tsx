import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function Particles() {
  const count = 18;
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
      <sphereGeometry args={[0.03, 5, 5]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
    </instancedMesh>
  );
}

function MainShape({ reduced }: { reduced: boolean }) {
    const solidRef = useRef<THREE.Mesh>(null);
    const shardsRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const solidDetail: [number, number] = [96, 24];
    const shardSampleStep = 10;
    
    // Generate fragments based on TorusKnot geometry
    const fragments = useMemo(() => {
        const geom = new THREE.TorusKnotGeometry(1.5, 0.4, solidDetail[0], solidDetail[1]);
        const pos = geom.getAttribute('position');
        const norm = geom.getAttribute('normal');
        const frags = [];
        for(let i=0; i<pos.count; i += shardSampleStep) {
            frags.push({
                x: pos.getX(i), y: pos.getY(i), z: pos.getZ(i),
                nx: norm.getX(i), ny: norm.getY(i), nz: norm.getZ(i),
                random: Math.random(),
                rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: Math.random() * Math.PI
            });
        }
        geom.dispose();
        return frags;
    }, []);

    useFrame((state) => {
        const scrollY = window.scrollY || 0;
        const scrollPct = reduced ? 0 : Math.min(Math.max(scrollY / 1500, 0), 1);
        const contactTop = document.getElementById('contact')?.getBoundingClientRect().top ?? window.innerHeight;
        const contactVisibility = (window.innerHeight - contactTop) / (window.innerHeight * 0.65);
        // As the contact section enters, the shards form a moving frame around it.
        const orbitProgress = reduced ? 0 : THREE.MathUtils.smoothstep(contactVisibility, 0.02, 0.7);
        const baseRotX = reduced ? 0.1 : Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
        const baseRotY = reduced ? 0.4 : state.clock.elapsedTime * 0.2;

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
                    
                    // Settle into a readable field that remains fixed behind the page.
                    const explodeDist = explodeEase * 7 * (frag.random + 0.2);
                    const lift = explodeEase * 3.5;

                    dummy.position.set(
                        frag.x + frag.nx * explodeDist,
                        frag.y + frag.ny * explodeDist + lift,
                        frag.z + frag.nz * explodeDist
                    );

                    if (orbitProgress > 0) {
                        const orbitAngle = frag.random * Math.PI * 2 + state.clock.elapsedTime * (0.28 + frag.random * 0.2);
                        const orbitRadiusX = 3.9 + frag.random * 2.2;
                        const orbitRadiusY = 2.3 + frag.random * 1.4;
                        const orbitX = Math.cos(orbitAngle) * orbitRadiusX;
                        const orbitY = Math.sin(orbitAngle) * orbitRadiusY;
                        const orbitZ = Math.sin(orbitAngle * 2 + frag.random * 8) * 1.6;
                        dummy.position.x += (orbitX - dummy.position.x) * orbitProgress;
                        dummy.position.y += (orbitY - dummy.position.y) * orbitProgress;
                        dummy.position.z += (orbitZ - dummy.position.z) * orbitProgress;
                    }
                    
                    const rotSpeed = explodeEase * frag.random * 6;
                    dummy.rotation.set(
                        frag.rx + rotSpeed,
                        frag.ry + rotSpeed,
                        frag.rz + rotSpeed
                    );
                    
                    let scale = 0;
                    if (scrollPct < 0.4) {
                        scale = (scrollPct / 0.4); 
                    } else {
                        scale = 1;
                    }
                    
                    scale *= 1 - orbitProgress * 0.12;
                    dummy.scale.set(scale, scale, scale);
                    dummy.updateMatrix();
                    shardsRef.current!.setMatrixAt(i, dummy.matrix);
                });
                shardsRef.current.instanceMatrix.needsUpdate = true;
            }
        }
    });

    return (
        <Float speed={reduced ? 0 : 2} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={solidRef} scale={1.2}>
            <torusKnotGeometry args={[1.5, 0.4, solidDetail[0], solidDetail[1]]} />
            <MeshTransmissionMaterial 
                    backside samples={1} thickness={0.5} chromaticAberration={0.03}
                    anisotropy={0.1} distortion={0.3} distortionScale={0.5}
                    temporalDistortion={0.1} color="#ffffff" resolution={192}
                />
            </mesh>
            <instancedMesh ref={shardsRef} args={[undefined, undefined, fragments.length]} visible={false} scale={1.2}>
                <tetrahedronGeometry args={[0.08, 0]} />
                <MeshTransmissionMaterial 
                    backside samples={1} thickness={0.5} chromaticAberration={0.05}
                    anisotropy={0.1} distortion={0.5} distortionScale={0.5}
                    temporalDistortion={0.1} color="#ffffff" resolution={128}
                />
            </instancedMesh>
        </Float>
    )
}

// Render immediately under studio lighting while the same-origin original HDR loads.
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const previous = scene.environment;
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = generator.fromScene(room, 0.04);
    scene.environment = target.texture;
    room.dispose(); generator.dispose();
    return () => { if (scene.environment === target.texture) scene.environment = previous; target.dispose(); };
  }, [gl, scene]);
  return null;
}

export default function ThreeBackground() {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      // The orbit remains visible through the contact section rather than fading away.
      if (container.current) container.current.style.opacity = '0.5';
      setActive(!document.hidden);
      setReduced(media.matches);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    media.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('visibilitychange', schedule);
      media.removeEventListener('change', schedule);
    };
  }, []);
  return (
    <div ref={container} className="fixed inset-0 z-[1] pointer-events-none" style={{ opacity: 0.5 }} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        dpr={[1, 1.25]}
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#050505', 8, 25]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} intensity={3} angle={0.15} penumbra={1} color="#ffffff" />
        <spotLight position={[-10, -10, -10]} intensity={5} angle={0.15} penumbra={1} color="#555555" />
        <MainShape reduced={reduced} />
        {!reduced && <Particles />}
        <Suspense fallback={<StudioEnvironment />}>
          <Environment files={`${import.meta.env.BASE_URL}environment/city.hdr`} />
        </Suspense>
      </Canvas>
    </div>
  );
}
