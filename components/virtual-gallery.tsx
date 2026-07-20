"use client";

/* Three.js objects are intentionally mutated inside the render loop. */
/* eslint-disable react-hooks/immutability */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, RoundedBox, useGLTF, useProgress, useTexture } from "@react-three/drei";
import { Info, Keyboard, MapPin, MousePointer2, X } from "lucide-react";
import * as THREE from "three";
import { artifacts, type Artifact } from "@/data/exhibit";

const positions: [number, number, number][] = [
  [-2.75, 0, 8], [2.75, 0, 2], [-2.75, 0, -4], [2.75, 0, -10],
];

const movementKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const MIN_ARTIFACT_DISTANCE = 1.65;

const modelConfig: Partial<Record<Artifact["shape"], { path: string; height: number; rotation?: [number, number, number] }>> = {
  vase: { path: "/models/amphora.glb", height: 1.75, rotation: [0, 0, Math.PI / 2] },
  coin: { path: "/models/roman-coin.glb", height: 0.035, rotation: [0, 0, Math.PI / 2] },
  tablet: { path: "/models/roman-stele.glb", height: 1.55 },
  sculpture: { path: "/models/terpsichore.glb", height: 2.15, rotation: [0, 0, 0] },
};

function createMarbleTexture() {
  const size = 512;
  const pixels = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      const cloud =
        Math.sin((u * 2.1 + v * 0.8) * Math.PI * 2) * 0.5 +
        Math.sin((u * 5.7 - v * 3.2) * Math.PI * 2) * 0.22 +
        Math.sin((u * 11.3 + v * 7.1) * Math.PI * 2) * 0.1;
      const warp =
        Math.sin((v * 1.8 + u * 0.25) * Math.PI * 2) * 0.18 +
        Math.sin((u * 2.6 - v * 1.1) * Math.PI * 2) * 0.07 +
        cloud * 0.055;
      const mainVein = Math.exp(-Math.abs(Math.sin((u * 1.25 + v * 0.48 + warp) * Math.PI * 4.2)) * 20);
      const fineVein = Math.exp(-Math.abs(Math.sin((u * 2.8 - v * 0.82 + warp * 0.62) * Math.PI * 3.4)) * 34);
      const grainSeed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const grain = (grainSeed - Math.floor(grainSeed) - 0.5) * 3.2;
      const baseVariation = cloud * 4.5 + grain;
      const veinDepth = mainVein * 49 + fineVein * 19;
      const index = (y * size + x) * 4;

      pixels[index] = THREE.MathUtils.clamp(222 + baseVariation - veinDepth * 0.91, 0, 255);
      pixels[index + 1] = THREE.MathUtils.clamp(219 + baseVariation - veinDepth * 0.86, 0, 255);
      pixels[index + 2] = THREE.MathUtils.clamp(211 + baseVariation - veinDepth * 0.75, 0, 255);
      pixels[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function FirstPersonControls() {
  const { camera, gl } = useThree();
  const pressed = useRef(new Set<string>());
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const yaw = useRef(0);
  const pitch = useRef(0);
  const move = useRef(new THREE.Vector3());

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (movementKeys.includes(event.code)) {
        event.preventDefault();
        pressed.current.add(event.code);
      }
    };
    const up = (event: KeyboardEvent) => pressed.current.delete(event.code);
    const canvas = gl.domElement;
    const pointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add("is-looking");
    };
    const pointerMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      const deltaX = event.clientX - lastPointer.current.x;
      const deltaY = event.clientY - lastPointer.current.y;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      yaw.current += deltaX * 0.0032;
      pitch.current = THREE.MathUtils.clamp(pitch.current + deltaY * 0.0027, -0.72, 0.72);
    };
    const pointerUp = (event: PointerEvent) => {
      dragging.current = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      canvas.classList.remove("is-looking");
    };
    const preventMenu = (event: Event) => event.preventDefault();

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointercancel", pointerUp);
    canvas.addEventListener("contextmenu", preventMenu);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      canvas.removeEventListener("contextmenu", preventMenu);
      canvas.classList.remove("is-looking");
    };
  }, [gl]);

  useFrame((_, delta) => {
    camera.rotation.order = "YXZ";
    camera.rotation.set(pitch.current, yaw.current, 0);

    const keys = pressed.current;
    if (!keys.size) return;
    const speed = delta * 3.15;
    const forward = (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0);
    const strafe = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
    move.current.set(
      (-Math.sin(yaw.current) * forward + Math.cos(yaw.current) * strafe) * speed,
      0,
      (-Math.cos(yaw.current) * forward - Math.sin(yaw.current) * strafe) * speed,
    );
    if (move.current.lengthSq() > speed * speed) move.current.setLength(speed);

    const canStand = (x: number, z: number) =>
      x >= -3.2 && x <= 3.2 && z >= -15.7 && z <= 13.7 &&
      positions.every(([itemX, , itemZ]) => Math.hypot(x - itemX, z - itemZ) >= MIN_ARTIFACT_DISTANCE);

    const nextX = camera.position.x + move.current.x;
    const nextZ = camera.position.z + move.current.z;
    if (canStand(nextX, camera.position.z)) camera.position.x = nextX;
    if (canStand(camera.position.x, nextZ)) camera.position.z = nextZ;
    camera.position.y = 1.72;
  });

  return null;
}

function WallArtwork({
  position,
  rotation = [0, 0, 0],
  imagePath,
  size,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  imagePath: string;
  size: [number, number];
}) {
  const texture = useTexture(imagePath);
  const [width, height] = size;

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.12]} />
        <meshStandardMaterial color="#27231d" roughness={0.62} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0, 0.066]}>
        <planeGeometry args={[width + 0.07, height + 0.07]} />
        <meshStandardMaterial color="#d8cdb8" roughness={0.84} />
      </mesh>
      <mesh position={[0, 0, 0.071]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={0.82} />
      </mesh>
    </group>
  );
}

function GalleryArtworks() {
  return (
    <group>
      <WallArtwork position={[-3.86, 3.72, 8.4]} rotation={[0, Math.PI / 2, 0]} imagePath="/artworks/roman-seated-couple.webp" size={[1.86, 1.73]} />
      <WallArtwork position={[-3.86, 3.72, 0]} rotation={[0, Math.PI / 2, 0]} imagePath="/artworks/roman-kithara-player.webp" size={[1.72, 1.73]} />
      <WallArtwork position={[-3.86, 3.72, -8.6]} rotation={[0, Math.PI / 2, 0]} imagePath="/artworks/roman-perseus-andromeda.webp" size={[1.29, 1.97]} />
      <WallArtwork position={[3.86, 3.72, 8.4]} rotation={[0, -Math.PI / 2, 0]} imagePath="/artworks/roman-dionysiac-garland.webp" size={[2.16, 1.6]} />
      <WallArtwork position={[3.86, 3.72, 0]} rotation={[0, -Math.PI / 2, 0]} imagePath="/artworks/roman-red-candelabrum.webp" size={[1.38, 1.97]} />
      <WallArtwork position={[3.86, 3.72, -8.6]} rotation={[0, -Math.PI / 2, 0]} imagePath="/artworks/roman-polyphemus-galatea.webp" size={[1.32, 1.97]} />
    </group>
  );
}

function GalleryRoom() {
  const marbleTextures = useMemo(() => {
    const endWall = createMarbleTexture();
    endWall.repeat.set(2.4, 2);
    const sideWall = endWall.clone();
    sideWall.repeat.set(9.5, 2);
    sideWall.needsUpdate = true;
    return { endWall, sideWall };
  }, []);

  useEffect(() => () => {
    marbleTextures.endWall.dispose();
    marbleTextures.sideWall.dispose();
  }, [marbleTextures]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 34]} /><meshStandardMaterial color="#35322c" roughness={0.94} />
      </mesh>
      <mesh position={[0, 3.5, -17]} receiveShadow>
        <boxGeometry args={[8, 7, 0.18]} /><meshStandardMaterial map={marbleTextures.endWall} color="#f0ede6" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.5, 17]} receiveShadow>
        <boxGeometry args={[8, 7, 0.18]} /><meshStandardMaterial map={marbleTextures.endWall} color="#f0ede6" roughness={0.7} />
      </mesh>
      <mesh position={[-4, 3.5, 0]} receiveShadow>
        <boxGeometry args={[0.18, 7, 34]} /><meshStandardMaterial map={marbleTextures.sideWall} color="#f0ede6" roughness={0.7} />
      </mesh>
      <mesh position={[4, 3.5, 0]} receiveShadow>
        <boxGeometry args={[0.18, 7, 34]} /><meshStandardMaterial map={marbleTextures.sideWall} color="#f0ede6" roughness={0.7} />
      </mesh>
      {[-11, -3, 5, 13].map((z) => (
        <group key={z} position={[0, 6.25, z]}>
          <mesh><boxGeometry args={[7.8, 0.08, 0.08]} /><meshStandardMaterial color="#5b554b" /></mesh>
          <pointLight position={[0, -0.35, 0]} intensity={8} distance={7} color="#ffe4b0" />
        </group>
      ))}
    </group>
  );
}

function CarpetRunner() {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    "/textures/carpet-red-color.jpg",
    "/textures/carpet-red-normal.jpg",
    "/textures/carpet-red-roughness.jpg",
  ]);

  useEffect(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    [colorMap, normalMap, roughnessMap].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1.15, 10.5);
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    });
  }, [colorMap, normalMap, roughnessMap]);

  return (
    <group>
      <RoundedBox args={[3.05, 0.045, 28]} radius={0.025} smoothness={3} position={[0, 0.025, -1]} receiveShadow>
        <meshStandardMaterial color="#49131a" roughness={0.96} />
      </RoundedBox>
      <mesh position={[0, 0.049, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.94, 27.9]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={[0.42, 0.42]}
          roughnessMap={roughnessMap}
          roughness={0.94}
        />
      </mesh>
    </group>
  );
}

function MuseumModel({ path, height, rotation = [0, 0, 0] }: { path: string; height: number; rotation?: [number, number, number] }) {
  const { scene } = useGLTF(path);
  const [rotationX, rotationY, rotationZ] = rotation;
  const prepared = useMemo(() => {
    const cloned = scene.clone(true);
    const oriented = new THREE.Group();
    const container = new THREE.Group();

    oriented.rotation.set(rotationX, rotationY, rotationZ);
    oriented.add(cloned);
    oriented.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(oriented);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = size.y > 0 ? height / size.y : 1;

    oriented.position.set(-center.x, -bounds.min.y, -center.z);
    container.scale.setScalar(scale);
    container.add(oriented);
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return container;
  }, [height, rotationX, rotationY, rotationZ, scene]);

  return <primitive object={prepared} />;
}

function ModelLoadingStatus() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className="model-loading"><span>Učitavanje izložbenog postava</span><strong>{Math.round(progress)}%</strong></div>;
}

function ArtifactObject({ artifact, position, onSelect }: { artifact: Artifact; position: [number, number, number]; onSelect: (item: Artifact) => void }) {
  const [hovered, setHovered] = useState(false);
  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta > 4) return;
    onSelect(artifact);
  };

  useEffect(() => {
    if (hovered) document.body.style.cursor = "pointer";
    return () => { document.body.style.cursor = ""; };
  }, [hovered]);

  const importedModel = modelConfig[artifact.shape];
  const material = <meshStandardMaterial color={artifact.accent} roughness={0.48} metalness={artifact.shape === "coin" ? 0.68 : 0.1} emissive={artifact.accent} emissiveIntensity={hovered ? 0.13 : 0} />;

  return (
    <group position={position} onClick={select} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[1.35, 2.45, 1.35]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <RoundedBox args={[1.35, 0.72, 1.35]} radius={0.06} position={[0, 0.36, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#676157" roughness={0.78} />
      </RoundedBox>
      <group position={[0, importedModel ? 0.76 : 1.25, 0]} scale={hovered ? 1.05 : 1}>
        {importedModel && <MuseumModel {...importedModel} />}
        {!importedModel && artifact.shape === "vase" && <>
          <mesh castShadow scale={[0.72, 1, 0.72]}>{material}<sphereGeometry args={[0.58, 28, 24]} /></mesh>
          <mesh position={[0, 0.63, 0]} castShadow>{material}<cylinderGeometry args={[0.25, 0.34, 0.62, 28]} /></mesh>
          <mesh position={[0, 0.98, 0]} castShadow>{material}<torusGeometry args={[0.28, 0.07, 12, 28]} /></mesh>
          <mesh position={[0.58, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>{material}<torusGeometry args={[0.42, 0.07, 12, 28, Math.PI * 1.5]} /></mesh>
        </>}
        {!importedModel && artifact.shape === "coin" && <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>{material}<cylinderGeometry args={[0.68, 0.68, 0.13, 48]} /></mesh>}
        {!importedModel && artifact.shape === "tablet" && <RoundedBox args={[1.05, 1.35, 0.24]} radius={0.04} castShadow>{material}</RoundedBox>}
        {!importedModel && artifact.shape === "sculpture" && <>
          <mesh position={[0, 0.65, 0]} castShadow>{material}<sphereGeometry args={[0.29, 28, 24]} /></mesh>
          <mesh position={[0, -0.1, 0]} castShadow>{material}<cylinderGeometry args={[0.25, 0.47, 1.25, 24]} /></mesh>
        </>}
      </group>
      {hovered && <Html position={[0, 2.65, 0]} center distanceFactor={9}><span className="scene-tooltip">{artifact.name}</span></Html>}
    </group>
  );
}

export function VirtualGallery() {
  const [selected, setSelected] = useState<Artifact | null>(null);

  return (
    <div className="gallery-shell">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.72, 13], fov: 62 }} gl={{ antialias: true }}>
        <color attach="background" args={["#171a18"]} />
        <fog attach="fog" args={["#171a18", 18, 39]} />
        <ambientLight intensity={0.62} />
        <directionalLight castShadow position={[1, 7, 10]} intensity={1.7} color="#fff4d9" shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-2.4, 4.2, 7]} intensity={11} distance={8} color="#dcb46e" />
        <pointLight position={[2.4, 4.2, -5]} intensity={10} distance={8} color="#9fb7ad" />
        <GalleryRoom />
        <Suspense fallback={null}>
          <GalleryArtworks />
          <CarpetRunner />
          {artifacts.map((artifact, index) => <ArtifactObject key={artifact.id} artifact={artifact} position={positions[index]} onSelect={setSelected} />)}
          <ContactShadows position={[0, 0.02, -1]} scale={32} opacity={0.32} blur={2.3} far={7} />
          <Environment preset="warehouse" environmentIntensity={0.25} />
        </Suspense>
        <FirstPersonControls />
      </Canvas>

      <ModelLoadingStatus />
      <span className="gallery-crosshair" aria-hidden="true" />
      <div className="gallery-status"><span className="live-dot" /> HODNIK 01 <i /> 4 PREDMETA <span className="distance-status"><i /> SIGURNA UDALJENOST</span></div>
      <div className="gallery-help">
        <span><MousePointer2 size={16} /> Drži i povuci za pogled</span>
        <span><Keyboard size={18} /> Strelice za kretanje</span>
      </div>

      {selected ? (
        <aside className="gallery-panel">
          <button onClick={() => setSelected(null)} aria-label="Zatvori panel"><X /></button>
          <p className="kicker">PREDMET U PROSTORU</p>
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>
          <dl>
            <div><dt>Razdoblje</dt><dd>{selected.period}</dd></div>
            <div><dt>Lokacija</dt><dd><MapPin size={15} /> {selected.location}</dd></div>
          </dl>
          <div className="gallery-fact"><Info size={18} /><span><strong>Zanimljivost</strong>{selected.fact}</span></div>
        </aside>
      ) : (
        <div className="gallery-prompt"><MousePointer2 size={17} /><span>Povucite za pogled · kliknite predmet za njegovu priču.</span></div>
      )}
    </div>
  );
}
