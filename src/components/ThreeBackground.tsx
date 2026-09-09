import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// A single, locally lit scene. No models, HDR downloads, refraction passes or render framework.
export default function ThreeBackground() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { return; }
    const container = host.current;
    container.appendChild(renderer.domElement);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.z = 12;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xbceaff, 0x18102f, 1.4));
    const light = new THREE.PointLight(0x48cfff, 25); light.position.set(3, 4, 5); scene.add(light);
    const root = new THREE.Group(); scene.add(root);
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x8dd7ff, metalness: 0.8, roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0.6 });
    const metal = new THREE.MeshStandardMaterial({ color: 0x8ca5bd, metalness: 1, roughness: 0.25 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x142331, metalness: 0.85, roughness: 0.3 });
    const glow = new THREE.MeshStandardMaterial({ color: 0x83eeff, emissive: 0x1eaaff, emissiveIntensity: 0.7, roughness: 0.22, metalness: 0.5 });
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.65, 0.32, 100, 12), glass); root.add(knot);
    const shardGeometry = new THREE.TetrahedronGeometry(0.1);
    const shards = new THREE.InstancedMesh(shardGeometry, glass, 120); root.add(shards);
    const dummy = new THREE.Object3D();
    const vertices = knot.geometry.getAttribute('position');
    const fragmentPositions = Array.from({ length: 120 }, (_, i) => new THREE.Vector3().fromBufferAttribute(vertices, Math.floor(i * vertices.count / 120)));
    const assembly = new THREE.Group(); root.add(assembly);
    const parts: { mesh: THREE.Mesh; y: number; spread: number }[] = [];
    const add = (geometry: THREE.BufferGeometry, material: THREE.Material, y: number, spread: number) => {
      const mesh = new THREE.Mesh(geometry, material); assembly.add(mesh); parts.push({ mesh, y, spread }); return mesh;
    };
    add(new THREE.IcosahedronGeometry(0.72, 1), glow, 0, 0);
    for (let i = 0; i < 6; i++) {
      const y = (i - 2.5) * 0.27;
      const ring = add(new THREE.TorusGeometry(i === 0 || i === 5 ? 1.04 : 1.35, 0.09, 8, 64), i % 2 ? metal : glass, y, (i - 2.5) * 0.65);
      ring.rotation.x = Math.PI / 2;
    }
    for (const side of [-1, 1]) {
      add(new THREE.CylinderGeometry(0.95, 0.95, 0.18, 48), dark, side * 0.94, side * 2.1);
      const rim = add(new THREE.TorusGeometry(0.8, 0.025, 6, 48), glow, side * 1.04, side * 2.1); rim.rotation.x = Math.PI / 2;
      for (let i = 0; i < 8; i++) {
        const fin = add(new THREE.BoxGeometry(0.14, 0.65, 0.26), metal, side * 0.5, side * 1.2);
        const a = i / 8 * Math.PI * 2; fin.position.x = Math.cos(a) * 1.13; fin.position.z = Math.sin(a) * 1.13; fin.rotation.y = -a;
      }
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, previous = 0, disposed = false;
    const pointer = { x: 0, y: 0 };
    const move = (event: PointerEvent) => { pointer.x = event.clientX / innerWidth - 0.5; pointer.y = event.clientY / innerHeight - 0.5; };
    const resize = () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); };
    resize();
    const render = (time: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(render);
      if (time - previous < (reduced.matches ? 100 : 33)) return;
      previous = time;
      const section = document.getElementById('inside-the-form');
      const rect = section?.getBoundingClientRect();
      const inLab = !!rect && rect.top < innerHeight * 0.65 && rect.bottom > 0;
      const inHero = window.scrollY < innerHeight * 1.2;
      if (!inLab && !inHero) { container.style.opacity = '0'; return; }
      container.style.opacity = inLab ? String(THREE.MathUtils.clamp((rect!.bottom - innerHeight * 0.4) / (innerHeight * 0.6), 0, 1)) : '0.23';
      const progress = rect ? THREE.MathUtils.clamp(-rect.top / Math.max(1, rect.height - innerHeight), 0, 1) : 0;
      const explode = reduced.matches ? 0.5 : THREE.MathUtils.smoothstep(progress, 0.12, 0.85);
      const shatter = reduced.matches ? 0 : THREE.MathUtils.clamp(window.scrollY / innerHeight, 0, 1);
      knot.visible = !inLab && shatter < 0.65; assembly.visible = inLab;
      knot.scale.setScalar(Math.max(0.01, 1 - shatter));
      shards.visible = !inLab && shatter > 0.01;
      if (shards.visible) {
        fragmentPositions.forEach((position, i) => {
          dummy.position.copy(position).multiplyScalar(1 + shatter * 2.5);
          dummy.rotation.set(i + shatter * 3, i * 0.4 + shatter, i * 0.8);
          dummy.scale.setScalar(Math.sin(shatter * Math.PI) * 1.5);
          dummy.updateMatrix(); shards.setMatrixAt(i, dummy.matrix);
        });
        shards.instanceMatrix.needsUpdate = true;
      }
      const mobile = innerWidth < 768;
      root.position.set(inLab ? (mobile ? 0 : 1.8) : 0, inLab && mobile ? -0.75 : 0, 0);
      root.scale.setScalar(inLab ? (mobile ? 0.48 : 0.9) : (mobile ? 0.8 : 1.4));
      root.rotation.set(inLab ? 0.18 : 0.3, reduced.matches ? 0.4 : (inLab ? progress * 1.3 + pointer.x * 0.25 : time * 0.00008), inLab ? -0.22 : 0.1);
      if (!reduced.matches) root.rotation.x += pointer.y * 0.12;
      parts.forEach(({ mesh, y, spread }) => { mesh.position.y = y + spread * explode; });
      renderer.render(scene, camera);
    };
    const visibility = () => { cancelAnimationFrame(frame); if (!document.hidden) frame = requestAnimationFrame(render); };
    window.addEventListener('resize', resize); window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('visibilitychange', visibility);
    frame = requestAnimationFrame(render);
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', visibility);
      scene.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
      [glass, metal, dark, glow].forEach(material => material.dispose()); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="sculpture-canvas" aria-hidden="true" />;
}
