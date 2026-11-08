"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type MoveDirection = "forward" | "back" | "left" | "right";
export type TourSceneHandle = {
  move: (direction: MoveDirection) => void;
  reset: () => void;
};

type TourSceneProps = {
  alternatePalette: boolean;
};

function box(
  parent: THREE.Group,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
  castShadow = true,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(
  parent: THREE.Group,
  radiusTop: number,
  radiusBottom: number,
  height: number,
  position: [number, number, number],
  material: THREE.Material,
  segments = 18,
) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function sphere(
  parent: THREE.Group,
  radius: number,
  position: [number, number, number],
  material: THREE.Material,
  scale: [number, number, number] = [1, 1, 1],
) {
  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 1), material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

const TourScene = forwardRef<TourSceneHandle, TourSceneProps>(function TourScene({ alternatePalette }, ref) {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<TourSceneHandle>({ move: () => undefined, reset: () => undefined });
  const paletteObjectsRef = useRef<{
    scene: THREE.Scene | null;
    renderer: THREE.WebGLRenderer | null;
    walls: THREE.MeshStandardMaterial[];
    fabrics: THREE.MeshStandardMaterial[];
  }>({ scene: null, renderer: null, walls: [], fabrics: [] });
  const [fallback, setFallback] = useState(false);

  useImperativeHandle(ref, () => ({
    move: (direction) => apiRef.current.move(direction),
    reset: () => apiRef.current.reset(),
  }), []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
    } catch {
      setFallback(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = "tour-canvas";
    renderer.domElement.setAttribute("aria-label", "Interactive 3D interior of Morrow House");
    renderer.domElement.setAttribute("role", "img");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const initialTone = new THREE.Color("#d8cbbb");
    scene.background = initialTone;
    scene.fog = new THREE.Fog(initialTone, 12, 31);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 90);
    const startPosition = new THREE.Vector3(0, 1.7, 5.65);
    const startTarget = new THREE.Vector3(0, 1.45, -0.28);
    camera.position.copy(startPosition);

    scene.add(new THREE.HemisphereLight("#fff8ed", "#756b5e", 2.25));
    const sunlight = new THREE.DirectionalLight("#ffe6c4", 2.3);
    sunlight.position.set(-4, 8, 5);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(1024, 1024);
    scene.add(sunlight);
    const warmPool = new THREE.PointLight("#f5c995", 19, 13, 2);
    warmPool.position.set(-2, 3.2, -1.8);
    scene.add(warmPool);

    const room = new THREE.Group();
    scene.add(room);

    const wall = new THREE.MeshStandardMaterial({ color: "#e5d9c7", roughness: 0.98 });
    const accentWall = new THREE.MeshStandardMaterial({ color: "#bd8a70", roughness: 0.96 });
    const floor = new THREE.MeshStandardMaterial({ color: "#ad9270", roughness: 0.92 });
    const oak = new THREE.MeshStandardMaterial({ color: "#745c43", roughness: 0.72 });
    const oakLight = new THREE.MeshStandardMaterial({ color: "#b89971", roughness: 0.78 });
    const linen = new THREE.MeshStandardMaterial({ color: "#ddd1bc", roughness: 1 });
    const linenDark = new THREE.MeshStandardMaterial({ color: "#a57962", roughness: 1 });
    const metal = new THREE.MeshStandardMaterial({ color: "#4d4b42", roughness: 0.46, metalness: 0.28 });
    const glass = new THREE.MeshPhysicalMaterial({ color: "#8c9a8e", roughness: 0.14, metalness: 0.08, transparent: true, opacity: 0.62 });
    const leaves = new THREE.MeshStandardMaterial({ color: "#68765d", roughness: 1 });
    const ceramic = new THREE.MeshStandardMaterial({ color: "#c2a78a", roughness: 0.38 });

    paletteObjectsRef.current = { scene, renderer, walls: [wall, accentWall, floor], fabrics: [linen, linenDark] };

    // Room shell: an open side keeps the interior visible as the visitor turns.
    box(room, [9.2, 0.28, 9], [0, -0.12, 0], floor);
    box(room, [9.2, 4.35, 0.2], [0, 2.08, -4.45], wall);
    box(room, [0.2, 4.35, 8.8], [-4.5, 2.08, -0.05], wall);
    box(room, [0.2, 4.35, 8.8], [4.5, 2.08, -0.05], wall);
    box(room, [9.2, 0.18, 2.2], [0, 4.2, -3.4], oakLight);
    box(room, [2.6, 0.15, 0.08], [-2.8, 3.12, -4.31], accentWall);

    // A large garden window, with slender bronze mullions and a low sill.
    box(room, [3.05, 1.72, 0.045], [0.7, 2.25, -4.31], glass, false);
    box(room, [3.3, 0.12, 0.22], [0.7, 1.32, -4.23], oakLight);
    [-0.82, 0.18, 1.18, 2.18].forEach((x) => box(room, [0.035, 1.76, 0.09], [x, 2.25, -4.24], metal, false));
    box(room, [3.12, 0.035, 0.09], [0.7, 2.25, -4.24], metal, false);
    box(room, [1.7, 2.65, 0.035], [-4.37, 2.22, -0.2], glass, false);
    box(room, [0.05, 2.7, 0.09], [-4.31, 2.22, -0.2], metal, false);

    // The large, quiet sofa and a low table sit just off the courtyard axis.
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.0), new THREE.MeshStandardMaterial({ color: "#c9b69a", roughness: 1 }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0.2, 0.035, 0.1);
    rug.receiveShadow = true;
    room.add(rug);
    box(room, [3.3, 0.5, 1.05], [-0.65, 0.46, -1.2], oak);
    box(room, [3.0, 0.58, 0.92], [-0.65, 0.93, -1.3], linen);
    box(room, [3.05, 1.12, 0.34], [-0.65, 1.48, -1.73], linen);
    box(room, [0.34, 0.92, 1.0], [-2.18, 1.12, -1.34], linen);
    box(room, [0.34, 0.92, 1.0], [0.88, 1.12, -1.34], linen);
    box(room, [0.7, 0.54, 0.32], [-1.33, 1.31, -1.18], linenDark);
    box(room, [0.68, 0.52, 0.32], [0.04, 1.31, -1.2], linen);

    // Coffee table, a small book, and a stoneware vessel.
    box(room, [1.65, 0.12, 0.88], [0.58, 0.56, 0.52], oakLight);
    [[-0.12, 0.29, 0.15], [1.28, 0.29, 0.15], [-0.12, 0.29, 0.89], [1.28, 0.29, 0.89]].forEach((point) =>
      box(room, [0.075, 0.5, 0.075], point as [number, number, number], oak),
    );
    box(room, [0.37, 0.035, 0.26], [0.55, 0.645, 0.47], linenDark);
    cylinder(room, 0.18, 0.23, 0.28, [1.05, 0.76, 0.58], ceramic, 14);

    // A built-in ledge on the left wall and a few restrained objects.
    box(room, [0.52, 1.56, 2.8], [-3.98, 1.18, -1.25], oak);
    [0.66, 1.2, 1.75].forEach((y) => box(room, [0.68, 0.06, 2.62], [-3.7, y, -1.25], oakLight));
    box(room, [0.25, 0.48, 0.3], [-3.45, 1.49, -1.72], ceramic);
    box(room, [0.19, 0.28, 0.22], [-3.42, 1.37, -0.67], linenDark);

    // A floor lamp, with a softly shaded pendant above the table.
    cylinder(room, 0.045, 0.045, 2.18, [2.54, 1.11, -1.5], metal, 12);
    cylinder(room, 0.42, 0.15, 0.44, [2.54, 2.25, -1.5], ceramic, 18);
    cylinder(room, 0.035, 0.035, 1.08, [0.95, 3.53, -0.14], metal, 12);
    const pendant = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 12), new THREE.MeshStandardMaterial({ color: "#f2d7a8", emissive: "#bb8651", emissiveIntensity: 0.6 }));
    pendant.position.set(0.95, 2.95, -0.14);
    room.add(pendant);

    // A potted neem-like plant softens the open corner.
    cylinder(room, 0.34, 0.27, 0.55, [3.15, 0.28, -3.15], ceramic, 16);
    cylinder(room, 0.055, 0.075, 1.65, [3.15, 1.25, -3.15], oak, 9);
    [
      [2.76, 2.05, -3.15], [3.55, 2.1, -3.25], [3.05, 2.42, -3.4],
      [3.45, 2.6, -3.0], [2.9, 2.76, -3.15], [3.28, 2.98, -3.28],
    ].forEach((point, index) => sphere(room, 0.5, point as [number, number, number], leaves, [0.7, 1.05 + index * 0.02, 0.64]));

    // A hand-made print, a ledge, and a small light detail on the terracotta wall.
    box(room, [1.05, 1.15, 0.045], [2.3, 2.35, -4.31], oakLight, false);
    box(room, [0.75, 0.82, 0.035], [2.3, 2.35, -4.27], linenDark, false);
    box(room, [1.75, 0.07, 0.28], [2.2, 1.58, -4.16], oak);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(startTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 1.04;
    controls.maxPolarAngle = 2.02;
    controls.minAzimuthAngle = -1.5;
    controls.maxAzimuthAngle = 1.5;
    controls.update();

    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    apiRef.current = {
      move: (direction) => {
        const amount = 0.36;
        let dx = 0;
        let dz = 0;
        if (direction === "forward") dz = -amount;
        if (direction === "back") dz = amount;
        if (direction === "left") dx = -amount;
        if (direction === "right") dx = amount;
        camera.position.x = clamp(camera.position.x + dx, -2.5, 2.5);
        camera.position.z = clamp(camera.position.z + dz, 1.25, 6.2);
        controls.target.x = clamp(controls.target.x + dx, -2.5, 2.5);
        controls.target.z = clamp(controls.target.z + dz, -2.6, 1.2);
        controls.update();
      },
      reset: () => {
        camera.position.copy(startPosition);
        controls.target.copy(startTarget);
        controls.update();
      },
    };

    let frame = 0;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
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
      paletteObjectsRef.current = { scene: null, renderer: null, walls: [], fabrics: [] };
      apiRef.current = { move: () => undefined, reset: () => undefined };
    };
  }, []);

  useEffect(() => {
    const objects = paletteObjectsRef.current;
    if (!objects.scene || !objects.renderer) return;
    const background = alternatePalette ? "#d4d9d1" : "#d8cbbb";
    objects.scene.background = new THREE.Color(background);
    if (objects.scene.fog instanceof THREE.Fog) objects.scene.fog.color.set(background);
    objects.walls[0]?.color.set(alternatePalette ? "#d5ddd2" : "#e5d9c7");
    objects.walls[1]?.color.set(alternatePalette ? "#9da996" : "#bd8a70");
    objects.walls[2]?.color.set(alternatePalette ? "#918c78" : "#ad9270");
    objects.fabrics[0]?.color.set(alternatePalette ? "#c5cec2" : "#ddd1bc");
    objects.fabrics[1]?.color.set(alternatePalette ? "#7c897b" : "#a57962");
    objects.renderer.setClearColor(background, 1);
  }, [alternatePalette]);

  return (
    <div className={`tour-canvas-host ${fallback ? "has-fallback" : ""}`} ref={hostRef} data-cursor="Drag to look around">
      {fallback && <div className="tour-fallback" aria-label="A photographic view of the living room" role="img" />}
    </div>
  );
});

export default function TourExperience() {
  const sceneRef = useRef<TourSceneHandle>(null);
  const [alternatePalette, setAlternatePalette] = useState(false);
  const [showRoomNote, setShowRoomNote] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHasStarted(true), 620);
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select")) return;
      const key = event.key.toLowerCase();
      const movement: Record<string, MoveDirection> = {
        w: "forward", arrowup: "forward",
        s: "back", arrowdown: "back",
        a: "left", arrowleft: "left",
        d: "right", arrowright: "right",
      };
      if (movement[key]) {
        event.preventDefault();
        sceneRef.current?.move(movement[key]);
        setHasStarted(true);
      } else if (key === "e") {
        setShowRoomNote((value) => !value);
        setHasStarted(true);
      } else if (key === "q") {
        setAlternatePalette((value) => !value);
        setHasStarted(true);
      } else if (key === "r") {
        sceneRef.current?.reset();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen can be restricted in embedded previews; the room remains usable.
    }
  };

  return (
    <main id="main-content" className={`tour-page ${alternatePalette ? "palette-cool" : "palette-warm"}`}>
      <div className="tour-stage">
        <TourScene ref={sceneRef} alternatePalette={alternatePalette} />
        <div className="tour-vignette" aria-hidden="true" />
        <div className={`tour-entering ${hasStarted ? "is-gone" : ""}`} aria-hidden="true">
          <span className="tour-entering-mark">M / H</span>
          <span className="tour-entering-line" />
          <span>Entering the residence</span>
        </div>

        <div className="tour-topline">
          <div className="tour-place">
            <span className="eyebrow">Morrow House / Lahore</span>
            <span>Architecture · Interiors · Details</span>
          </div>
          <div className="tour-top-actions">
            <span className="tour-room-number"><i /> Living room&nbsp; 01 / 03</span>
            <button type="button" className="tour-icon-button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"} data-cursor="Full screen">
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4v4H4M16 4v4h4M8 20v-4H4m12 4v-4h4" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5m11-5v5h-5" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="tour-center-hint" aria-hidden="true">
          <span className="tour-hint-dot" />
          <span>Drag to look around</span>
        </div>

        <div className="tour-bottom-left">
          <Link href="/" className="tour-back-link" data-cursor="Back to the site">
            <span aria-hidden="true">←</span> Back to the house
          </Link>
          <span className="tour-bottom-caption">A considered residence · 2026</span>
        </div>

        <aside className="tour-instructions" aria-label="Walkthrough controls">
          <div className="tour-instructions-heading">
            <span className="eyebrow">Explore the room</span>
            <button type="button" className="tour-reset" onClick={() => sceneRef.current?.reset()} data-cursor="Reset view" aria-label="Reset the camera view">Reset view <span>↺</span></button>
          </div>
          <div className="tour-instruction-row">
            <div className="key-cluster" aria-label="W A S D or arrow keys to move">
              <kbd>W</kbd><div><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div>
            </div>
            <span>Move</span>
          </div>
          <button type="button" className={`tour-action-row ${showRoomNote ? "is-active" : ""}`} onClick={() => setShowRoomNote((value) => !value)} aria-pressed={showRoomNote} data-cursor="Room details">
            <kbd>E</kbd><span>Room details</span><i>{showRoomNote ? "−" : "+"}</i>
          </button>
          <button type="button" className={`tour-action-row ${alternatePalette ? "is-active" : ""}`} onClick={() => setAlternatePalette((value) => !value)} aria-pressed={alternatePalette} data-cursor="Change the light">
            <kbd>Q</kbd><span>Change the light</span><i>{alternatePalette ? "On" : "Off"}</i>
          </button>
          <div className="tour-touch-pad" aria-label="Touch controls for moving around the room">
            <button type="button" aria-label="Move forward" onClick={() => sceneRef.current?.move("forward")}>↑</button>
            <div>
              <button type="button" aria-label="Move left" onClick={() => sceneRef.current?.move("left")}>←</button>
              <button type="button" aria-label="Move backward" onClick={() => sceneRef.current?.move("back")}>↓</button>
              <button type="button" aria-label="Move right" onClick={() => sceneRef.current?.move("right")}>→</button>
            </div>
          </div>
        </aside>

        {showRoomNote && (
          <aside className="tour-room-note" aria-labelledby="tour-note-title">
            <button type="button" className="tour-note-close" onClick={() => setShowRoomNote(false)} aria-label="Close room details">×</button>
            <span className="eyebrow">Room 01 / The long room</span>
            <h2 id="tour-note-title">A little space<br /><em>to settle.</em></h2>
            <p>Low seating, filtered garden light, and a natural path from indoors to the courtyard. The room is made for everyday rituals, not display.</p>
            <span className="tour-note-materials">Oak · Linen · Lime plaster</span>
          </aside>
        )}

        <div className="tour-orientation-note">
          <span className="eyebrow">Landscape mode</span>
          <h2>Turn your device,<br /><em>sideways.</em></h2>
          <p>This interior is made to be explored in a wider frame. Rotate your phone for the full view.</p>
          <span className="orientation-rotate" aria-hidden="true">↻</span>
        </div>
      </div>
      <div className="tour-footerline">
        <span>© 2026 Morrow House</span>
        <span>Drag · Move · Look closer</span>
        <span><button type="button" onClick={toggleFullscreen}>{isFullscreen ? "Exit full screen" : "View full screen"}</button></span>
      </div>
    </main>
  );
}
