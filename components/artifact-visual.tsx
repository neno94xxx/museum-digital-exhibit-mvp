"use client";

import { Suspense, useMemo } from "react";
import type { CSSProperties } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { MousePointer2 } from "lucide-react";
import * as THREE from "three";
import type { Artifact } from "@/data/exhibit";

type ModelConfig = {
  path: string;
  rotation: [number, number, number];
  initialYaw: number;
};

const modelConfig: Record<Artifact["shape"], ModelConfig> = {
  vase: {
    path: "/models/amphora.glb",
    rotation: [0, 0, Math.PI / 2],
    initialYaw: -0.35,
  },
  coin: {
    path: "/models/roman-coin.glb",
    rotation: [Math.PI / 2, 0, 0],
    initialYaw: 0,
  },
  tablet: {
    path: "/models/roman-stele.glb",
    rotation: [0, 0, 0],
    initialYaw: -0.18,
  },
  sculpture: {
    path: "/models/terpsichore.glb",
    rotation: [0, 0, 0],
    initialYaw: -0.25,
  },
};

function ArtifactModel({ artifact }: { artifact: Artifact }) {
  const config = modelConfig[artifact.shape];
  const { scene } = useGLTF(config.path);

  const normalizedModel = useMemo(() => {
    const clonedScene = scene.clone(true);
    const orientedModel = new THREE.Group();

    orientedModel.rotation.set(...config.rotation);
    orientedModel.add(clonedScene);
    orientedModel.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(orientedModel);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const largestSide = Math.max(size.x, size.y, size.z);
    const container = new THREE.Group();

    orientedModel.position.set(-center.x, -center.y, -center.z);
    container.rotation.y = config.initialYaw;
    container.scale.setScalar(largestSide > 0 ? 2.05 / largestSide : 1);
    container.add(orientedModel);

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return container;
  }, [config.initialYaw, config.rotation, scene]);

  return <primitive object={normalizedModel} />;
}

function ModelLoadingIndicator() {
  const { active, progress } = useProgress();

  if (!active) return null;

  return (
    <span className="artifact-model-loading" aria-live="polite">
      Učitavanje 3D modela {Math.round(progress)}%
    </span>
  );
}

export function ArtifactVisual({
  artifact,
  compact = false,
  interactive = false,
}: {
  artifact: Artifact;
  compact?: boolean;
  interactive?: boolean;
}) {
  return (
    <div
      className={`artifact-visual artifact-model-visual ${compact ? "compact" : ""} ${interactive ? "interactive" : ""}`}
      style={{ "--artifact-accent": artifact.accent } as CSSProperties}
      aria-label={interactive ? `Interaktivni 3D model: ${artifact.name}` : `3D prikaz: ${artifact.name}`}
      role="img"
    >
      <span className="visual-halo" aria-hidden="true" />
      <Canvas
        className="artifact-model-canvas"
        dpr={compact ? [1, 1.25] : [1, 1.6]}
        frameloop={interactive ? "always" : "demand"}
        camera={{ position: [0, 0, 4.1], fov: 34, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows={!compact}
      >
        <ambientLight intensity={1.55} />
        <directionalLight position={[3.5, 4.5, 5]} intensity={3.2} castShadow={interactive} />
        <directionalLight position={[-4, 1, 2]} intensity={1.35} color="#d9b978" />
        <Suspense fallback={null}>
          <ArtifactModel artifact={artifact} />
          {!compact && (
            <ContactShadows
              position={[0, -1.17, 0]}
              opacity={0.55}
              scale={3.7}
              blur={2.5}
              far={2.7}
              frames={1}
            />
          )}
        </Suspense>
        {interactive && (
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI * 0.12}
            maxPolarAngle={Math.PI * 0.88}
            rotateSpeed={0.75}
          />
        )}
      </Canvas>
      <ModelLoadingIndicator />
      {interactive && (
        <span className="artifact-model-hint">
          <MousePointer2 size={15} /> Povuci za rotaciju
        </span>
      )}
    </div>
  );
}
