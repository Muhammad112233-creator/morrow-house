"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type PartKey = "walls" | "floor" | "roof" | "pillars" | "stairs" | "openings";
type Visibility = Record<PartKey, boolean>;

const partLabels: { key: PartKey; label: string }[] = [
  { key: "walls", label: "Walls" },
  { key: "floor", label: "Floor" },
  { key: "roof", label: "Roof" },
  { key: "pillars", label: "Columns" },
  { key: "stairs", label: "Steps" },
  { key: "openings", label: "Openings" },
];

function addBox(
  parent: THREE.Group,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addColumn(
  parent: THREE.Group,
  position: [number, number, number],
  material: THREE.Material,
  radius = 0.095,
  height = 3.35,
) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.08, height, 12), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function buildHouse(scene: THREE.Scene) {
  const root = new THREE.Group();
  root.position.y = -0.15;
  scene.add(root);

  const groups: Record<PartKey, THREE.Group> = {
    walls: new THREE.Group(),
    floor: new THREE.Group(),
    roof: new THREE.Group(),
    pillars: new THREE.Group(),
    stairs: new THREE.Group(),
    openings: new THREE.Group(),
  };
  Object.values(groups).forEach((group) => root.add(group));

  const limestone = new THREE.MeshStandardMaterial({ color: "#d5c9b7", roughness: 0.96 });
  const paleStone = new THREE.MeshStandardMaterial({ color: "#e5dccd", roughness: 0.9 });
  const clay = new THREE.MeshStandardMaterial({ color: "#a96f58", roughness: 0.94 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: "#4d5149", roughness: 0.48, metalness: 0.32 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#a6b5ab",
    roughness: 0.19,
    metalness: 0.08,
    transparent: true,
    opacity: 0.54,
    side: THREE.DoubleSide,
  });
  const garden = new THREE.MeshStandardMaterial({ color: "#90957a", roughness: 1 });
  const base = new THREE.MeshStandardMaterial({ color: "#b6a991", roughness: 1 });

  // Ground plane and an inset garden court.
  addBox(groups.floor, [11.4, 0.38, 8.8], [0, 0, 0], base);
  addBox(groups.floor, [3.15, 0.075, 2.7], [0, 0.225, -0.15], garden);
  addBox(groups.floor, [1.05, 0.08, 0.55], [0, 0.27, 1.56], paleStone);
  addBox(groups.floor, [1.05, 0.08, 0.55], [0, 0.27, 2.25], paleStone);

  // A calm, inward-facing plan: long rear wall, two returns and a broken entry edge.
  addBox(groups.walls, [10.2, 3.35, 0.3], [0, 1.86, -4.08], limestone);
  addBox(groups.walls, [0.3, 3.35, 8.15], [-4.95, 1.86, 0], limestone);
  addBox(groups.walls, [0.3, 3.35, 8.15], [4.95, 1.86, 0], limestone);
  addBox(groups.walls, [3.25, 3.35, 0.3], [-3.36, 1.86, 4.08], limestone);
  addBox(groups.walls, [2.5, 3.35, 0.3], [3.85, 1.86, 4.08], limestone);
  addBox(groups.walls, [0.22, 2.95, 4.6], [1.25, 1.66, -1.38], paleStone);
  addBox(groups.walls, [2.3, 0.12, 0.28], [-0.08, 3.37, -4.08], clay);

  // Deep, partial roof planes leave the courtyard and the rooms readable from above.
  addBox(groups.roof, [10.45, 0.32, 1.05], [0, 3.69, -3.48], paleStone);
  addBox(groups.roof, [1.2, 0.32, 6.95], [-4.34, 3.69, 0], paleStone);
  addBox(groups.roof, [1.2, 0.32, 6.95], [4.34, 3.69, 0], paleStone);
  addBox(groups.roof, [10.45, 0.32, 0.82], [0, 3.69, 3.55], paleStone);
  addBox(groups.roof, [0.18, 0.16, 9.05], [0, 3.48, 0], clay);

  // Slim brick columns hold the shaded walk around the courtyard.
  [
    [-4.35, 1.83, -3.15], [-2.2, 1.83, -3.15], [0, 1.83, -3.15],
    [2.2, 1.83, -3.15], [4.35, 1.83, -3.15],
    [-4.35, 1.83, 2.9], [-2.2, 1.83, 2.9], [0, 1.83, 2.9],
    [2.2, 1.83, 2.9], [4.35, 1.83, 2.9],
  ].forEach((point) => addColumn(groups.pillars, point as [number, number, number], clay));

  // A short run of stone steps arrives at the open front threshold.
  addBox(groups.stairs, [3.1, 0.2, 0.42], [0, 0.16, 4.7], paleStone);
  addBox(groups.stairs, [3.55, 0.2, 0.42], [0, -0.02, 5.08], paleStone);
  addBox(groups.stairs, [4.0, 0.2, 0.42], [0, -0.2, 5.46], paleStone);

  // Glazed openings, shown as a separate layer so the structure can be explored.
  addBox(groups.openings, [2.65, 2.3, 0.055], [-1.15, 1.6, -3.87], glass);
  addBox(groups.openings, [2.15, 2.3, 0.055], [2.2, 1.6, -3.87], glass);
  addBox(groups.openings, [1.08, 2.72, 0.055], [0.25, 1.78, 3.84], glass);
  addBox(groups.openings, [0.055, 2.38, 1.2], [-4.78, 1.65, -0.55], glass);
  // Quiet bronze frame lines.
  [-2.45, -1.15, 0.18, 1.31, 2.2, 3.27].forEach((x) =>
    addBox(groups.openings, [0.038, 2.4, 0.07], [x, 1.6, -3.82], darkMetal),
  );
  addBox(groups.openings, [5.15, 0.04, 0.07], [0.5, 2.78, -3.82], darkMetal);
  addBox(groups.openings, [0.04, 2.65, 0.07], [0.25, 1.78, 3.78], darkMetal);
  addBox(groups.openings, [1.15, 0.04, 0.07], [0.25, 2.87, 3.78], darkMetal);

  // A small planted canopy gives the model a human scale without hiding the plan.
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.12, 2.2, 9), clay);
  trunk.position.set(-1.05, 1.35, -0.05);
  trunk.castShadow = true;
  root.add(trunk);
  const canopyMaterial = new THREE.MeshStandardMaterial({ color: "#7e8970", roughness: 1 });
  const canopy = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1), canopyMaterial);
  canopy.position.set(-1.05, 2.75, -0.05);
  canopy.scale.set(1, 0.78, 0.95);
  canopy.castShadow = true;
  root.add(canopy);

  return { root, groups };
}

export default function HouseModel() {
  const hostRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef<Partial<Record<PartKey, THREE.Group>>>({});
  const [fallback, setFallback] = useState(false);
  const [visible, setVisible] = useState<Visibility>({
    walls: true,
    floor: true,
    roof: true,
    pillars: true,
    stairs: true,
    openings: true,
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      setFallback(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor("#ede6d6", 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-label", "Interactive 3D study model of the courtyard house");
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.className = "house-canvas";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#ede6d6", 24, 43);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(13, 10.5, 15.5);
    scene.add(new THREE.HemisphereLight("#fff7e9", "#8c887d", 2.05));

    const sunlight = new THREE.DirectionalLight("#fff0d9", 3.1);
    sunlight.position.set(-8, 14, 10);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(1024, 1024);
    sunlight.shadow.camera.left = -14;
    sunlight.shadow.camera.right = 14;
    sunlight.shadow.camera.top = 14;
    sunlight.shadow.camera.bottom = -14;
    scene.add(sunlight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.ShadowMaterial({ color: "#8e8170", opacity: 0.16 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.43;
    ground.receiveShadow = true;
    scene.add(ground);

    const { groups } = buildHouse(scene);
    groupsRef.current = groups;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.2, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.minDistance = 10;
    controls.maxDistance = 26;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.43;
    controls.autoRotate = false;
    controls.update();

    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let frame = 0;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      groupsRef.current = {};
    };
  }, []);

  useEffect(() => {
    Object.entries(visible).forEach(([key, isVisible]) => {
      const group = groupsRef.current[key as PartKey];
      if (group) group.visible = isVisible;
    });
  }, [visible]);

  const showFullView = () => {
    setVisible({ walls: true, floor: true, roof: true, pillars: true, stairs: true, openings: true });
  };

  return (
    <div className="model-viewer">
      <div className="model-viewer-top">
        <div>
          <span className="eyebrow">Interactive study</span>
          <p>Drag to turn · Scroll to come closer</p>
        </div>
        <span className="model-status"><i /> Live model</span>
      </div>

      <div className="model-canvas-wrap" ref={hostRef} data-cursor="Drag to rotate">
        {fallback && (
          <div className="model-fallback" role="img" aria-label="Illustrated axonometric view of a courtyard house">
            <svg viewBox="0 0 900 540" aria-hidden="true">
              <path d="m153 286 297-158 302 158-298 163z" fill="#b6a991" />
              <path d="m193 274 257-136 260 136-259 140z" fill="#e5dccd" />
              <path d="m193 274 257 140v-145L193 131z" fill="#c7b9a5" />
              <path d="m450 414 260-140V131L450 269z" fill="#d8cbb9" />
              <path d="m214 181 236 125v-34L214 149zM450 306l239-125v-34L450 272z" fill="#a96f58" />
              <path d="m273 230 45 24v85l-45-24zM351 271l44 24v85l-44-24zM491 296l45-24v85l-45 24zM570 254l44-24v85l-44 24z" fill="#829087" />
              <path d="m450 307 76-41v89l-76 42z" fill="#ede6d6" />
              <path d="m450 307 76-41" stroke="#4d5149" strokeWidth="6" />
              <path d="m211 145 239-126 245 126-245 128z" fill="none" stroke="#807667" strokeWidth="4" />
            </svg>
            <span>WebGL is unavailable here, so a static model view is shown.</span>
          </div>
        )}
      </div>

      <div className="model-viewer-bottom">
        <div className="model-view-title">
          <span className="model-index">01</span>
          <div><strong>Full view</strong><small>Courtyard house · Lahore</small></div>
        </div>
        <div className="model-controls" aria-label="Show or hide parts of the model">
          <button type="button" onClick={showFullView} className="model-control full-view" data-cursor="Reset view">
            Full view <span aria-hidden="true">↗</span>
          </button>
          {partLabels.map((part) => (
            <button
              key={part.key}
              type="button"
              className={`model-control ${visible[part.key] ? "is-selected" : ""}`}
              aria-pressed={visible[part.key]}
              onClick={() => setVisible((current) => ({ ...current, [part.key]: !current[part.key] }))}
              data-cursor={visible[part.key] ? "Hide" : "Show"}
            >
              <i aria-hidden="true" /> {part.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
