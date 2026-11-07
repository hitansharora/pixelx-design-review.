/**
 * LUMINA / PixelX - 3D Interactive Room Visualizer
 * Multi-Room Architectural Engine (Living Room, Master Bedroom, Modular Kitchen, Office)
 * Built with Three.js & Procedural Parametric Modeling
 */

class InteriorRoomViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = null;
    this.mouse = null;
    this.hoveredMesh = null;
    this.interactiveObjects = [];

    // Room type state: 'living' | 'bedroom' | 'kitchen' | 'office'
    this.currentRoomType = "living";

    // Furniture group reference for fast modular swapping
    this.furnitureGroup = null;

    // Lighting fixtures references
    this.sunLight = null;
    this.ambientLight = null;
    this.pendantLight = null;
    this.lampLight = null;
    this.sconceLights = [];

    // Mesh references for real-time styling
    this.meshes = {
      floor: null,
      backWall: null,
      leftWall: null,
      accentWallSlats: [],
      upholstery: [],     // Sofas, bed duvet, chair cushions, barstools
      cabinetry: [],      // Wood millwork, credenzas, kitchen cabinets, nightstands
      accentSurfaces: [], // Marble tops, island quartz slabs, metal hardware
      rug: null,
      lampShade: null
    };

    // Procedural texture caches
    this.textureCache = {};

    this.currentSelections = {
      wallColor: "#EAE6DF",
      wallMaterialId: "mat-wall-limewash",
      floorColor: "#C9A780",
      floorMaterialId: "mat-floor-oak-herringbone",
      sofaColor: "#F4F0EB",
      accentWoodColor: "#8E5A3C",
      accentColor: "#D4AF37",
      lightingMode: "golden"
    };

    this.isInitialized = false;
    this.init();
  }

  init() {
    if (typeof THREE === "undefined") {
      console.warn("Three.js not loaded. Activating 2D Architectural Canvas view.");
      this.init2DFallback();
      return;
    }

    try {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      const width = this.container.clientWidth || 800;
      const height = this.container.clientHeight || 480;

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("#13161c");
      this.scene.fog = new THREE.FogExp2("#13161c", 0.022);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      this.camera.position.set(7.5, 5.5, 8.5);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.05;

      // Clear existing children
      this.container.innerHTML = "";
      this.container.appendChild(this.renderer.domElement);
    } catch (e) {
      console.warn("WebGL initialization failed, falling back to 2D view", e);
      this.init2DFallback();
      return;
    }

    // 4. Controls
    if (typeof THREE.OrbitControls !== "undefined") {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
      this.controls.minDistance = 3;
      this.controls.maxDistance = 18;
      this.controls.target.set(0, 1.2, 0);
    }

    // 5. Environment & Architecture
    this.setupLighting();
    this.generateProceduralTextures();
    this.buildRoomArchitecture();

    // 6. Furniture Root Group
    this.furnitureGroup = new THREE.Group();
    this.scene.add(this.furnitureGroup);

    // Initial furniture build based on room type
    this.rebuildFurnitureForRoomType(this.currentRoomType);

    // 7. Interaction listeners
    this.bindEvents();

    // 8. Render Loop
    this.isInitialized = true;
    this.animate();

    // Apply initial state
    this.applyMaterials(this.currentSelections);
  }

  // --- PROCEDURAL TEXTURE GENERATION (0 KB external image assets) ---
  generateProceduralTextures() {
    // 1. Wood Herringbone Canvas
    this.textureCache["wood-herringbone"] = this.createCanvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = "#d5b48b";
      ctx.fillRect(0, 0, w, h);
      const rows = 16, cols = 8;
      const rw = w / cols, rh = h / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const shift = (r % 2) * (rw / 2);
          const x = c * rw + shift;
          const y = r * rh;
          const shade = ((r * 13 + c * 29) % 25) - 12;
          ctx.fillStyle = `rgba(${shade > 0 ? 255 : 0}, ${shade > 0 ? 255 : 0}, ${shade > 0 ? 255 : 0}, ${Math.abs(shade) / 180})`;
          ctx.fillRect(x, y, rw, rh);
          ctx.strokeStyle = "rgba(60, 40, 25, 0.45)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, rw, rh);
        }
      }
    });

    // 2. Wood Chevron Walnut Canvas
    this.textureCache["wood-chevron"] = this.createCanvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = "#634731";
      ctx.fillRect(0, 0, w, h);
      const stripes = 24;
      const sw = h / stripes;
      for (let i = 0; i < stripes; i++) {
        const tone = (i % 2 === 0) ? "rgba(40,25,15,0.25)" : "rgba(255,230,200,0.08)";
        ctx.fillStyle = tone;
        ctx.fillRect(0, i * sw, w, sw);
        ctx.strokeStyle = "rgba(25,15,8,0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(0, i * sw, w, sw);
      }
    });

    // 3. Polished Micro-cement Canvas
    this.textureCache["concrete"] = this.createCanvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = "#c5c0b8";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const rad = Math.random() * 2 + 1;
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 4. Honed Calacatta Marble Canvas
    this.textureCache["marble"] = this.createCanvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = "#faf7f2";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(160, 145, 130, 0.35)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      let cx = 40, cy = 0;
      ctx.moveTo(cx, cy);
      while (cy < h) {
        cx += (Math.random() - 0.45) * 45;
        cy += Math.random() * 35;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(195, 145, 75, 0.28)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      cx = 250; cy = 0;
      ctx.moveTo(cx, cy);
      while (cy < h) {
        cx += (Math.random() - 0.5) * 40;
        cy += Math.random() * 40;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    });

    // 5. Plaster Wall Canvas
    this.textureCache["plaster"] = this.createCanvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 2500; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(230,225,220,0.4)" : "rgba(0,0,0,0.04)";
        ctx.fillRect(x, y, Math.random() * 4, Math.random() * 4);
      }
    });

    // 6. Fabric Canvas
    this.textureCache["fabric"] = this.createCanvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = "#fcfaf7";
      ctx.fillRect(0, 0, w, h);
      const step = 8;
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          if ((x + y) % (step * 2) === 0) {
            ctx.fillRect(x, y, step / 2, step / 2);
          }
        }
      }
    });
  }

  createCanvasTexture(width, height, drawFn) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    drawFn(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // --- LIGHTING SETUP ---
  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xfff7ea, 0.7);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfff2db, 1.8);
    this.sunLight.position.set(10, 12, 6);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    this.pendantLight = new THREE.PointLight(0xffd89e, 1.5, 12);
    this.pendantLight.position.set(0, 3.2, 0);
    this.pendantLight.castShadow = true;
    this.scene.add(this.pendantLight);

    this.lampLight = new THREE.PointLight(0xffbe6b, 1.2, 8);
    this.lampLight.position.set(-2.8, 2.1, -1.8);
    this.scene.add(this.lampLight);

    const fillLight = new THREE.DirectionalLight(0xd9e5ff, 0.4);
    fillLight.position.set(-6, 8, -6);
    this.scene.add(fillLight);
  }

  // --- ROOM SHELL ARCHITECTURE ---
  buildRoomArchitecture() {
    // 1. Floor
    const floorGeo = new THREE.PlaneGeometry(9, 9, 32, 32);
    const floorTex = this.textureCache["wood-herringbone"].clone();
    floorTex.repeat.set(4, 4);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.35,
      metalness: 0.05,
      color: new THREE.Color(this.currentSelections.floorColor)
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData = { id: "floor", name: "Flooring Finish", type: "flooring" };
    this.scene.add(floor);
    this.meshes.floor = floor;

    // 2. Baseboards
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.5 });
    const bbBack = new THREE.Mesh(new THREE.BoxGeometry(9.05, 0.15, 0.05), baseboardMat);
    bbBack.position.set(0, 0.075, -4.48);
    this.scene.add(bbBack);

    const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 9.05), baseboardMat);
    bbLeft.position.set(-4.48, 0.075, 0);
    this.scene.add(bbLeft);

    // 3. Back Wall
    const wallGeo = new THREE.PlaneGeometry(9, 4.6);
    const plasterTex = this.textureCache["plaster"].clone();
    plasterTex.repeat.set(3, 2);

    const wallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSelections.wallColor),
      map: plasterTex,
      roughness: 0.85,
      metalness: 0.02
    });

    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 2.3, -4.5);
    backWall.receiveShadow = true;
    backWall.userData = { id: "back-wall", name: "Back Wall Finish", type: "walls" };
    this.scene.add(backWall);
    this.meshes.backWall = backWall;

    // 4. Left Wall
    const leftWallMat = wallMat.clone();
    const leftWall = new THREE.Mesh(wallGeo, leftWallMat);
    leftWall.position.set(-4.5, 2.3, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    leftWall.userData = { id: "left-wall", name: "Side Wall Finish", type: "walls" };
    this.scene.add(leftWall);
    this.meshes.leftWall = leftWall;

    // 5. Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(9, 9);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xfaf8f5, roughness: 0.9 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.set(0, 4.6, 0);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.receiveShadow = true;
    this.scene.add(ceiling);

    // 6. Floor-to-Ceiling Luxury Window Frame on the Right Wall side
    this.buildArchitecturalWindow();
  }

  buildArchitecturalWindow() {
    const windowGroup = new THREE.Group();

    // Exterior Backdrop Plane
    const backdropGeo = new THREE.PlaneGeometry(16, 10);
    const skyTex = this.createCanvasTexture(512, 256, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#8cb4d8");
      grad.addColorStop(0.6, "#dce7f0");
      grad.addColorStop(1, "#f7ebe1");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(100, 115, 130, 0.35)";
      for (let i = 0; i < 25; i++) {
        const bw = Math.random() * 25 + 15;
        const bh = Math.random() * 60 + 20;
        ctx.fillRect(i * 22, h - bh, bw, bh);
      }
    });

    const backdropMat = new THREE.MeshBasicMaterial({ map: skyTex });
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.position.set(6.8, 3.2, 0);
    backdrop.rotation.y = -Math.PI / 2;
    windowGroup.add(backdrop);

    // Glass Panes
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5
    });

    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(0.04, 4.2, 7.8), glassMat);
    glassPane.position.set(4.46, 2.2, 0);
    windowGroup.add(glassPane);

    // Window Mullions (Matte Black Aluminum)
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f2428, roughness: 0.35 });
    for (let i = -1; i <= 1; i++) {
      const verticalMullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.4, 0.06), frameMat);
      verticalMullion.position.set(4.45, 2.2, i * 2.5);
      verticalMullion.castShadow = true;
      windowGroup.add(verticalMullion);
    }

    const horizMullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 7.8), frameMat);
    horizMullion.position.set(4.45, 2.8, 0);
    windowGroup.add(horizMullion);

    this.scene.add(windowGroup);
  }

  // =========================================================================
  // MODULAR MULTI-ROOM FURNITURE ENGINE
  // (Changes 3D scene dynamically: Living Room -> Bed -> Kitchen -> Office)
  // =========================================================================
  setRoomType(roomType, selections = {}) {
    this.currentRoomType = roomType;

    if (this.fallbackCanvas) {
      this.draw2DFallback();
      return;
    }

    this.rebuildFurnitureForRoomType(roomType);
    this.applyMaterials(selections);
  }

  rebuildFurnitureForRoomType(roomType) {
    if (!this.furnitureGroup) return;

    // 1. Clear previous furniture
    while (this.furnitureGroup.children.length > 0) {
      const obj = this.furnitureGroup.children[0];
      this.furnitureGroup.remove(obj);
    }

    // 2. Reset mesh arrays
    this.meshes.upholstery = [];
    this.meshes.cabinetry = [];
    this.meshes.accentSurfaces = [];
    this.meshes.accentWallSlats = [];
    this.interactiveObjects = [this.meshes.floor, this.meshes.backWall, this.meshes.leftWall].filter(Boolean);

    // 3. Build specific room configuration
    if (roomType === "bedroom") {
      this.buildBedroomFurniture(this.furnitureGroup);
      this.animateCameraTo({ x: 6.8, y: 5.0, z: 7.8 }, { x: 0, y: 1.0, z: 0 });
    } else if (roomType === "kitchen") {
      this.buildKitchenFurniture(this.furnitureGroup);
      this.animateCameraTo({ x: 7.2, y: 5.2, z: 7.5 }, { x: 0, y: 1.1, z: 0 });
    } else if (roomType === "office") {
      this.buildOfficeFurniture(this.furnitureGroup);
      this.animateCameraTo({ x: 6.8, y: 4.8, z: 7.2 }, { x: 0, y: 1.0, z: 0 });
    } else {
      // Default: Living Room
      this.buildLivingRoomFurniture(this.furnitureGroup);
      this.animateCameraTo({ x: 7.5, y: 5.5, z: 8.5 }, { x: 0, y: 1.2, z: 0 });
    }
  }

  // --- 1. LIVING ROOM FURNITURE BUILDER ---
  buildLivingRoomFurniture(group) {
    const sofaMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSelections.sofaColor),
      roughness: 0.75
    });

    const woodPlinthMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSelections.accentWoodColor),
      roughness: 0.45
    });

    // Luxury Area Rug
    const rugGeo = new THREE.BoxGeometry(5.2, 0.03, 4.2);
    const rugTex = this.textureCache["fabric"].clone();
    rugTex.repeat.set(8, 8);
    const rugMat = new THREE.MeshStandardMaterial({ color: 0xded8cc, map: rugTex, roughness: 0.95 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(-0.2, 0.015, 0.1);
    rug.receiveShadow = true;
    rug.userData = { id: "rug", name: "Hand-Knotted Luxury Rug", type: "rug" };
    group.add(rug);
    this.interactiveObjects.push(rug);

    // Sectional Sofa Base
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 1.3), woodPlinthMat);
    plinth.position.set(-0.3, 0.06, -1.2);
    plinth.castShadow = true;
    group.add(plinth);
    this.meshes.cabinetry.push(plinth);

    // Seat Cushions
    const seatW = 1.15;
    for (let i = 0; i < 3; i++) {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(seatW - 0.04, 0.32, 1.15), sofaMat);
      seat.position.set(-1.4 + i * seatW, 0.28, -1.2);
      seat.castShadow = true;
      group.add(seat);
      this.meshes.upholstery.push(seat);
    }

    // Backrest
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.48, 0.26), sofaMat);
    backrest.position.set(-0.3, 0.62, -1.72);
    backrest.castShadow = true;
    backrest.userData = { id: "sofa", name: "Custom Sectional Sofa", type: "fabrics" };
    group.add(backrest);
    this.meshes.upholstery.push(backrest);
    this.interactiveObjects.push(backrest);

    // Armrests
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 1.25), sofaMat);
    armL.position.set(-2.0, 0.52, -1.2);
    group.add(armL);
    this.meshes.upholstery.push(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 1.25), sofaMat);
    armR.position.set(1.4, 0.52, -1.2);
    group.add(armR);
    this.meshes.upholstery.push(armR);

    // Sculptural Coffee Table (Marble Top & Fluted Base)
    const marbleTex = this.textureCache["marble"].clone();
    const tableTopMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ee, map: marbleTex, roughness: 0.22, metalness: 0.08 });
    const topGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 48);
    const tableTop = new THREE.Mesh(topGeo, tableTopMat);
    tableTop.position.set(-0.2, 0.42, 0.1);
    tableTop.castShadow = true;
    tableTop.userData = { id: "coffee-table", name: "Sculptural Marble Coffee Table", type: "accents" };
    group.add(tableTop);
    this.meshes.accentSurfaces.push(tableTop);
    this.interactiveObjects.push(tableTop);

    const baseMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(this.currentSelections.accentColor), roughness: 0.35, metalness: 0.65 });
    const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 0.38, 36), baseMat);
    baseMesh.position.set(-0.2, 0.19, 0.1);
    baseMesh.castShadow = true;
    group.add(baseMesh);
    this.meshes.accentSurfaces.push(baseMesh);

    // Accent Lounge Chair
    const chairGroup = new THREE.Group();
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x9b5a2b, roughness: 0.6 });
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 0.82), chairMat);
    chairSeat.position.set(1.9, 0.38, 0.4);
    chairSeat.rotation.y = -0.45;
    chairSeat.castShadow = true;
    chairGroup.add(chairSeat);
    this.meshes.upholstery.push(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.12), chairMat);
    chairBack.position.set(2.2, 0.72, 0.2);
    chairBack.rotation.y = -0.45;
    chairBack.castShadow = true;
    chairGroup.add(chairBack);
    this.meshes.upholstery.push(chairBack);

    chairGroup.userData = { id: "lounge-chair", name: "Designer Accent Lounge Chair", type: "fabrics" };
    group.add(chairGroup);
    this.interactiveObjects.push(chairSeat);

    // Media Credenza on Wall
    const credenza = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.55, 0.45), woodPlinthMat);
    credenza.position.set(-2.8, 0.6, -4.2);
    credenza.castShadow = true;
    credenza.userData = { id: "credenza", name: "Floating Oak Credenza", type: "wood" };
    group.add(credenza);
    this.meshes.cabinetry.push(credenza);
    this.interactiveObjects.push(credenza);

    // Acoustic Slat Wall on Back
    this.buildAcousticSlats(group);

    // Floor Lamp
    this.buildFloorLamp(group);
  }

  // --- 2. MASTER BEDROOM FURNITURE BUILDER ---
  buildBedroomFurniture(group) {
    const beddingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSelections.sofaColor),
      roughness: 0.85
    });

    const woodBedMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSelections.accentWoodColor),
      roughness: 0.45
    });

    // 1. Bedroom Area Rug
    const rugGeo = new THREE.BoxGeometry(5.8, 0.03, 5.0);
    const rugTex = this.textureCache["fabric"].clone();
    rugTex.repeat.set(10, 10);
    const rugMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d8, map: rugTex, roughness: 0.95 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(-0.2, 0.015, -0.6);
    rug.receiveShadow = true;
    group.add(rug);

    // 2. King Platform Bed Frame
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.32, 3.4), woodBedMat);
    bedFrame.position.set(-0.2, 0.16, -1.0);
    bedFrame.castShadow = true;
    group.add(bedFrame);
    this.meshes.cabinetry.push(bedFrame);

    // 3. Mattress
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xfaf8f5, roughness: 0.9 });
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.38, 3.1), mattressMat);
    mattress.position.set(-0.2, 0.48, -1.0);
    mattress.castShadow = true;
    group.add(mattress);

    // 4. Duvet / Bedspread (Takes Upholstery / Bedding Color!)
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(3.04, 0.22, 2.3), beddingMat);
    duvet.position.set(-0.2, 0.62, -0.55);
    duvet.castShadow = true;
    duvet.userData = { id: "bed", name: "King Bed Luxury Duvet", type: "fabrics" };
    group.add(duvet);
    this.meshes.upholstery.push(duvet);
    this.interactiveObjects.push(duvet);

    // Folded Bed Throw Blanket at foot
    const throwMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(this.currentSelections.accentWoodColor), roughness: 0.8 });
    const throwBlanket = new THREE.Mesh(new THREE.BoxGeometry(3.06, 0.08, 0.65), throwMat);
    throwBlanket.position.set(-0.2, 0.74, 0.4);
    group.add(throwBlanket);
    this.meshes.cabinetry.push(throwBlanket);

    // 5. Four Pillows propped up
    for (let i = 0; i < 2; i++) {
      const pillowBack = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.28, 0.45), mattressMat);
      pillowBack.position.set(-0.8 + i * 1.2, 0.78, -2.15);
      pillowBack.rotation.x = 0.35;
      pillowBack.castShadow = true;
      group.add(pillowBack);

      const pillowFront = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.22, 0.35), beddingMat);
      pillowFront.position.set(-0.8 + i * 1.2, 0.72, -1.85);
      pillowFront.rotation.x = 0.35;
      pillowFront.castShadow = true;
      group.add(pillowFront);
      this.meshes.upholstery.push(pillowFront);
    }

    // 6. Large Fluted Acoustic Headboard Wall
    const headboardBack = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 2.8, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x1f2125, roughness: 0.85 })
    );
    headboardBack.position.set(-0.2, 1.8, -4.44);
    group.add(headboardBack);

    // Headboard Slats
    const slatMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(this.currentSelections.accentWoodColor), roughness: 0.45 });
    for (let s = -22; s <= 22; s++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.7, 0.04), slatMat);
      slat.position.set(-0.2 + s * 0.11, 1.8, -4.4);
      slat.castShadow = true;
      group.add(slat);
      this.meshes.accentWallSlats.push(slat);
    }

    // 7. Floating Nightstands (Left & Right)
    const nightstandGeo = new THREE.BoxGeometry(0.75, 0.4, 0.5);
    const nsLeft = new THREE.Mesh(nightstandGeo, woodBedMat);
    nsLeft.position.set(-2.4, 0.45, -2.1);
    nsLeft.castShadow = true;
    nsLeft.userData = { id: "nightstand", name: "Floating Nightstand", type: "wood" };
    group.add(nsLeft);
    this.meshes.cabinetry.push(nsLeft);
    this.interactiveObjects.push(nsLeft);

    const nsRight = new THREE.Mesh(nightstandGeo, woodBedMat);
    nsRight.position.set(2.0, 0.45, -2.1);
    nsRight.castShadow = true;
    group.add(nsRight);
    this.meshes.cabinetry.push(nsRight);

    // Bedside glowing pendant lamps
    const orbMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffddaa, emissiveIntensity: 0.9 });
    const orbL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), orbMat);
    orbL.position.set(-2.4, 1.6, -2.1);
    group.add(orbL);

    const orbR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), orbMat);
    orbR.position.set(2.0, 1.6, -2.1);
    group.add(orbR);

    // 8. End-of-Bed Bench
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.38, 0.55), beddingMat);
    bench.position.set(-0.2, 0.28, 1.15);
    bench.castShadow = true;
    bench.userData = { id: "bench", name: "Upholstered Bed Bench", type: "fabrics" };
    group.add(bench);
    this.meshes.upholstery.push(bench);
    this.interactiveObjects.push(bench);
  }

  // --- 3. MODULAR KITCHEN FURNITURE BUILDER ---
  buildKitchenFurniture(group) {
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSelections.accentWoodColor),
      roughness: 0.4
    });

    const quartzTex = this.textureCache["marble"].clone();
    const quartzMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbfa,
      map: quartzTex,
      roughness: 0.18,
      metalness: 0.05
    });

    const stoolMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSelections.sofaColor),
      roughness: 0.7
    });

    // 1. Central Waterfall Kitchen Island
    const islandBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.05, 1.8), cabinetMat);
    islandBase.position.set(-0.2, 0.53, 0.0);
    islandBase.castShadow = true;
    islandBase.receiveShadow = true;
    islandBase.userData = { id: "island-cabinets", name: "Kitchen Island Cabinetry", type: "cabinetry" };
    group.add(islandBase);
    this.meshes.cabinetry.push(islandBase);
    this.interactiveObjects.push(islandBase);

    // Quartz Waterfall Countertop (Top slab + Left waterfall end + Right waterfall end)
    const topSlab = new THREE.Mesh(new THREE.BoxGeometry(4.35, 0.1, 1.95), quartzMat);
    topSlab.position.set(-0.2, 1.1, 0.0);
    topSlab.castShadow = true;
    topSlab.userData = { id: "countertop", name: "Waterfall Quartz Countertop", type: "countertop" };
    group.add(topSlab);
    this.meshes.accentSurfaces.push(topSlab);
    this.interactiveObjects.push(topSlab);

    const leftWaterfall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.15, 1.95), quartzMat);
    leftWaterfall.position.set(-2.35, 0.58, 0.0);
    leftWaterfall.castShadow = true;
    group.add(leftWaterfall);
    this.meshes.accentSurfaces.push(leftWaterfall);

    const rightWaterfall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.15, 1.95), quartzMat);
    rightWaterfall.position.set(1.95, 0.58, 0.0);
    rightWaterfall.castShadow = true;
    group.add(rightWaterfall);
    this.meshes.accentSurfaces.push(rightWaterfall);

    // Undermount Sink & Architectural Faucet
    const sink = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.05, 0.48),
      new THREE.MeshStandardMaterial({ color: 0x1f2124, roughness: 0.2, metalness: 0.8 })
    );
    sink.position.set(-0.8, 1.15, -0.15);
    group.add(sink);

    const faucetMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.85 });
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 16), faucetMat);
    faucet.position.set(-0.8, 1.4, -0.42);
    group.add(faucet);

    // 2. Trio of Modern Bar Stools
    for (let i = -1; i <= 1; i++) {
      const stool = new THREE.Group();

      // Seat pad (takes upholstery/leather color!)
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 24), stoolMat);
      pad.position.set(-0.2 + i * 1.1, 0.78, 1.35);
      pad.castShadow = true;
      stool.add(pad);
      this.meshes.upholstery.push(pad);

      // Low backrest
      const stoolBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.06), stoolMat);
      stoolBack.position.set(-0.2 + i * 1.1, 0.9, 1.48);
      stool.add(stoolBack);
      this.meshes.upholstery.push(stoolBack);

      // Metal legs
      const stoolLegMat = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.4, metalness: 0.7 });
      const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.015, 0.76, 12), stoolLegMat);
      legs.position.set(-0.2 + i * 1.1, 0.38, 1.35);
      legs.castShadow = true;
      stool.add(legs);

      stool.userData = { id: "barstool", name: "Modern Counter Barstool", type: "fabrics" };
      group.add(stool);
      this.interactiveObjects.push(pad);
    }

    // 3. Rear Wall Full-Height Millwork Cabinetry
    const backCabinets = new THREE.Mesh(new THREE.BoxGeometry(6.6, 4.4, 0.65), cabinetMat);
    backCabinets.position.set(0.0, 2.2, -4.18);
    backCabinets.castShadow = true;
    backCabinets.receiveShadow = true;
    backCabinets.userData = { id: "wall-cabinetry", name: "Full-Height Kitchen Millwork", type: "cabinetry" };
    group.add(backCabinets);
    this.meshes.cabinetry.push(backCabinets);
    this.interactiveObjects.push(backCabinets);

    // Recessed Backsplash Niche
    const nicheBack = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.3, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xf5f3ee, map: quartzTex, roughness: 0.2 })
    );
    nicheBack.position.set(0.0, 2.0, -3.95);
    group.add(nicheBack);

    // Integrated Black Glass Double Ovens
    const ovenMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.1, metalness: 0.85 });
    const ovenTop = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 0.05), ovenMat);
    ovenTop.position.set(2.4, 2.2, -3.82);
    group.add(ovenTop);

    const ovenBottom = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 0.05), ovenMat);
    ovenBottom.position.set(2.4, 1.35, -3.82);
    group.add(ovenBottom);

    // 4. Linear Island Suspension Chandelier
    const lightBarMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.85 });
    const lightBar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.05, 0.05), lightBarMat);
    lightBar.position.set(-0.2, 3.2, 0.0);
    group.add(lightBar);

    // Glowing LED strip under linear bar
    const glowStrip = new THREE.Mesh(
      new THREE.BoxGeometry(3.1, 0.02, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe2b8, emissiveIntensity: 1.2 })
    );
    glowStrip.position.set(-0.2, 3.17, 0.0);
    group.add(glowStrip);
  }

  // --- 4. OFFICE / STUDY FURNITURE BUILDER ---
  buildOfficeFurniture(group) {
    const woodMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(this.currentSelections.accentWoodColor), roughness: 0.45 });
    const leatherMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(this.currentSelections.sofaColor), roughness: 0.65 });

    // Executive Desk
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 1.4), woodMat);
    deskTop.position.set(0, 0.8, -0.6);
    deskTop.castShadow = true;
    group.add(deskTop);
    this.meshes.cabinetry.push(deskTop);

    // Desk Pedestals
    for (let x of [-1.2, 1.2]) {
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.76, 1.3), woodMat);
      ped.position.set(x, 0.38, -0.6);
      ped.castShadow = true;
      group.add(ped);
    }

    // Executive Chair
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.8), leatherMat);
    chair.position.set(0, 0.85, -1.8);
    chair.castShadow = true;
    group.add(chair);
    this.meshes.upholstery.push(chair);
  }

  // --- DECORATIVE ACCENTS ---
  buildAcousticSlats(group) {
    const slatCount = 18;
    const slatW = 0.05, slatD = 0.035, slatH = 4.4, slatSpacing = 0.11;
    const startX = 1.0;
    const slatMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(this.currentSelections.accentWoodColor), roughness: 0.45 });

    const feltBacking = new THREE.Mesh(
      new THREE.BoxGeometry(slatCount * slatSpacing + 0.1, 4.4, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x18181c, roughness: 0.95 })
    );
    feltBacking.position.set(startX + (slatCount * slatSpacing) / 2, 2.2, -4.47);
    group.add(feltBacking);

    for (let i = 0; i < slatCount; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(slatW, slatH, slatD), slatMat);
      slat.position.set(startX + i * slatSpacing, 2.2, -4.45);
      slat.castShadow = true;
      group.add(slat);
      this.meshes.accentWallSlats.push(slat);
    }
  }

  buildFloorLamp(group) {
    const lampGroup = new THREE.Group();
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.75 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 24), brassMat);
    base.position.set(-2.8, 0.02, -1.8);
    lampGroup.add(base);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.1, 16), brassMat);
    stem.position.set(-2.8, 1.05, -1.8);
    lampGroup.add(stem);

    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xfff0d6,
      emissive: 0xffbe6b,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.32, 24, 1, true), shadeMat);
    shade.position.set(-2.8, 2.15, -1.8);
    shade.rotation.x = Math.PI;
    lampGroup.add(shade);
    this.meshes.lampShade = shade;

    lampGroup.userData = { id: "floor-lamp", name: "Architectural Floor Lamp", type: "lighting" };
    group.add(lampGroup);
    this.interactiveObjects.push(shade);
  }

  // --- MATERIAL UPDATES (Colors, Textures & Finishes) ---
  applyMaterials(options = {}) {
    this.currentSelections = { ...this.currentSelections, ...options };

    if (this.fallbackCanvas) {
      this.draw2DFallback();
      return;
    }

    // 1. Flooring
    if (this.meshes.floor && options.floorColor) {
      this.meshes.floor.material.color.set(options.floorColor);

      let texStyle = "wood-herringbone";
      if (options.floorMaterialId) {
        if (options.floorMaterialId.includes("walnut") || options.floorMaterialId.includes("chevron")) {
          texStyle = "wood-chevron";
        } else if (options.floorMaterialId.includes("microcement") || options.floorMaterialId.includes("cement")) {
          texStyle = "concrete";
        } else if (options.floorMaterialId.includes("marble") || options.floorMaterialId.includes("calacatta")) {
          texStyle = "marble";
        }
      }

      if (this.textureCache[texStyle]) {
        const tex = this.textureCache[texStyle].clone();
        tex.repeat.set(texStyle === "marble" ? 2 : 4, texStyle === "marble" ? 2 : 4);
        this.meshes.floor.material.map = tex;
        this.meshes.floor.material.roughness = texStyle === "marble" ? 0.15 : (texStyle === "concrete" ? 0.6 : 0.35);
        this.meshes.floor.material.needsUpdate = true;
      }
    }

    // 2. Wall Colors
    if (this.meshes.backWall && options.wallColor) {
      this.meshes.backWall.material.color.set(options.wallColor);
      this.meshes.leftWall.material.color.set(options.wallColor);
    }

    // 3. Upholstery / Fabrics (Sofa, Bed Duvet, Stool Cushions)
    if (options.sofaColor && this.meshes.upholstery.length > 0) {
      const col = new THREE.Color(options.sofaColor);
      this.meshes.upholstery.forEach(mesh => {
        if (mesh && mesh.material) {
          mesh.material.color.copy(col);
          mesh.material.needsUpdate = true;
        }
      });
    }

    // 4. Accent Wood / Cabinetry (Fluted Slats, Kitchen Cabinets, Nightstands)
    if (options.accentWoodColor) {
      const woodCol = new THREE.Color(options.accentWoodColor);
      this.meshes.cabinetry.forEach(mesh => {
        if (mesh && mesh.material) mesh.material.color.copy(woodCol);
      });
      this.meshes.accentWallSlats.forEach(slat => {
        if (slat && slat.material) slat.material.color.copy(woodCol);
      });
    }

    // 5. Accent Metals / Countertops
    if (options.accentColor) {
      const accCol = new THREE.Color(options.accentColor);
      this.meshes.accentSurfaces.forEach(mesh => {
        if (mesh && mesh.material && !mesh.material.map) {
          mesh.material.color.copy(accCol);
        }
      });
    }

    // 6. Lighting Ambience
    if (options.lightingMode) {
      this.setLightingMode(options.lightingMode);
    }
  }

  setLightingMode(mode) {
    this.currentSelections.lightingMode = mode;

    if (this.fallbackCanvas) {
      this.draw2DFallback();
      return;
    }

    if (mode === "day") {
      this.scene.background.set("#1a222d");
      this.ambientLight.color.set(0xf5f8ff);
      this.ambientLight.intensity = 0.95;
      this.sunLight.color.set(0xfff8ee);
      this.sunLight.intensity = 2.2;
      this.sunLight.position.set(10, 12, 6);
      this.pendantLight.intensity = 0.4;
      this.lampLight.intensity = 0.3;
      if (this.meshes.lampShade) this.meshes.lampShade.material.emissiveIntensity = 0.15;
    } else if (mode === "golden") {
      this.scene.background.set("#1e1a18");
      this.ambientLight.color.set(0xffeed6);
      this.ambientLight.intensity = 0.8;
      this.sunLight.color.set(0xffa852);
      this.sunLight.intensity = 2.6;
      this.sunLight.position.set(12, 6, 8);
      this.pendantLight.intensity = 1.2;
      this.lampLight.intensity = 1.0;
      if (this.meshes.lampShade) this.meshes.lampShade.material.emissiveIntensity = 0.6;
    } else if (mode === "night") {
      this.scene.background.set("#0d1117");
      this.ambientLight.color.set(0x242d3d);
      this.ambientLight.intensity = 0.35;
      this.sunLight.color.set(0x405575);
      this.sunLight.intensity = 0.25;
      this.pendantLight.color.set(0xffc570);
      this.pendantLight.intensity = 2.4;
      this.lampLight.color.set(0xff9f43);
      this.lampLight.intensity = 1.8;
      if (this.meshes.lampShade) this.meshes.lampShade.material.emissiveIntensity = 1.2;
    }
  }

  // --- CAMERA PRESET VIEWS ---
  setCameraView(viewName) {
    if (!this.controls) return;

    if (viewName === "perspective") {
      this.animateCameraTo({ x: 6.8, y: 4.8, z: 7.8 }, { x: 0, y: 1.2, z: 0 });
    } else if (viewName === "isometric") {
      this.animateCameraTo({ x: 9.5, y: 8.5, z: 9.5 }, { x: 0, y: 0.8, z: 0 });
    } else if (viewName === "topdown") {
      this.animateCameraTo({ x: 0.1, y: 12.0, z: 0.1 }, { x: 0, y: 0, z: 0 });
    }
  }

  animateCameraTo(targetPos, targetLookAt) {
    const startPos = { ...this.camera.position };
    const startTarget = { ...this.controls.target };
    const duration = 750;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      this.camera.position.x = startPos.x + (targetPos.x - startPos.x) * ease;
      this.camera.position.y = startPos.y + (targetPos.y - startPos.y) * ease;
      this.camera.position.z = startPos.z + (targetPos.z - startPos.z) * ease;

      this.controls.target.x = startTarget.x + (targetLookAt.x - startTarget.x) * ease;
      this.controls.target.y = startTarget.y + (targetLookAt.y - startTarget.y) * ease;
      this.controls.target.z = startTarget.z + (targetLookAt.z - startTarget.z) * ease;

      this.controls.update();
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  // --- EVENTS & RESIZE ---
  bindEvents() {
    window.addEventListener("resize", () => this.onResize());

    const dom = this.renderer.domElement;
    dom.addEventListener("mousemove", (e) => this.onMouseMove(e));
    dom.addEventListener("click", (e) => this.onClick(e));
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 480;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getPointerPosition(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1
    };
  }

  onMouseMove(event) {
    if (!this.raycaster) return;
    const pos = this.getPointerPosition(event);
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      this.container.style.cursor = "pointer";
      this.hoveredMesh = intersects[0].object;
    } else {
      this.container.style.cursor = "default";
      this.hoveredMesh = null;
    }
  }

  onClick(event) {
    if (!this.raycaster) return;
    const pos = this.getPointerPosition(event);
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const targetData = hit.userData || (hit.parent && hit.parent.userData);
      if (targetData && targetData.name) {
        window.dispatchEvent(new CustomEvent("room-3d-clicked", {
          detail: { id: targetData.id, name: targetData.name, type: targetData.type }
        }));
      }
    }
  }

  // --- ANIMATION LOOP ---
  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // =========================================================================
  // 2D ARCHITECTURAL CUSTOMIZER CANVAS
  // (Changes room layout AND colors live for Living Room, Bed, Kitchen)
  // =========================================================================
  init2DFallback() {
    this.container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = this.container.clientWidth || 800;
    canvas.height = this.container.clientHeight || 480;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    this.container.appendChild(canvas);
    this.fallbackCanvas = canvas;
    this.draw2DFallback();

    window.addEventListener("resize", () => {
      if (this.fallbackCanvas) {
        this.fallbackCanvas.width = this.container.clientWidth || 800;
        this.fallbackCanvas.height = this.container.clientHeight || 480;
        this.draw2DFallback();
      }
    });
  }

  draw2DFallback() {
    if (!this.fallbackCanvas) return;
    const ctx = this.fallbackCanvas.getContext("2d");
    const w = this.fallbackCanvas.width;
    const h = this.fallbackCanvas.height;

    // Dark Studio Background
    ctx.fillStyle = "#121620";
    ctx.fillRect(0, 0, w, h);

    // Architectural Boundary
    const rx = w * 0.12, ry = h * 0.1;
    const rw = w * 0.76, rh = h * 0.8;

    // 1. Flooring (reflects selected floor color)
    ctx.fillStyle = this.currentSelections.floorColor || "#CBB69D";
    ctx.fillRect(rx, ry, rw, rh);

    // Wood Plank lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
    ctx.lineWidth = 1;
    for (let x = rx; x < rx + rw; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, ry);
      ctx.lineTo(x, ry + rh);
      ctx.stroke();
    }

    // 2. Walls (reflects selected wall paint color!)
    ctx.strokeStyle = this.currentSelections.wallColor || "#F0ECE1";
    ctx.lineWidth = 16;
    ctx.strokeRect(rx, ry, rw, rh);

    // Window on right wall
    ctx.strokeStyle = "#4da3ff";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(rx + rw, ry + rh * 0.2);
    ctx.lineTo(rx + rw, ry + rh * 0.8);
    ctx.stroke();

    // 3. Room-Specific Furniture & Layout
    if (this.currentRoomType === "bedroom") {
      this.draw2DBedroom(ctx, rx, ry, rw, rh);
    } else if (this.currentRoomType === "kitchen") {
      this.draw2DKitchen(ctx, rx, ry, rw, rh);
    } else {
      this.draw2DLivingRoom(ctx, rx, ry, rw, rh);
    }

    // 4. Lighting tint overlay
    if (this.currentSelections.lightingMode === "golden") {
      ctx.fillStyle = "rgba(255, 170, 70, 0.12)";
      ctx.fillRect(0, 0, w, h);
    } else if (this.currentSelections.lightingMode === "night") {
      ctx.fillStyle = "rgba(10, 18, 40, 0.35)";
      ctx.fillRect(0, 0, w, h);
    }

    // Room Label Pill
    ctx.fillStyle = "rgba(18, 24, 38, 0.9)";
    ctx.fillRect(rx + 20, ry + 20, 260, 52);
    ctx.strokeStyle = "#C29D59";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rx + 20, ry + 20, 260, 52);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    const typeTitle = this.currentRoomType === "bedroom" ? "Master Bedroom Layout" : this.currentRoomType === "kitchen" ? "Modular Kitchen Layout" : "Living Room Layout";
    ctx.fillText(typeTitle, rx + 32, ry + 42);

    ctx.fillStyle = "#C29D59";
    ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Interactive 2D Color Customizer Active", rx + 32, ry + 58);
  }

  draw2DLivingRoom(ctx, rx, ry, rw, rh) {
    // Area Rug
    ctx.fillStyle = "rgba(235, 230, 222, 0.7)";
    const rugX = rx + rw * 0.2, rugY = ry + rh * 0.2, rugW = rw * 0.6, rugH = rh * 0.6;
    ctx.fillRect(rugX, rugY, rugW, rugH);

    // Sectional Sofa (Takes selected upholstery color!)
    ctx.fillStyle = this.currentSelections.sofaColor || "#D7CFC7";
    const sofaX = rugX + rugW * 0.1, sofaY = rugY + rugH * 0.12, sofaW = rugW * 0.75, sofaH = rugH * 0.38;
    ctx.fillRect(sofaX, sofaY, sofaW, sofaH);
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 2;
    ctx.strokeRect(sofaX, sofaY, sofaW, sofaH);

    // Cushions
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    const cW = sofaW / 3;
    for (let i = 0; i < 3; i++) {
      ctx.strokeRect(sofaX + i * cW, sofaY, cW, sofaH);
    }

    // Coffee Table (Takes accent color!)
    ctx.fillStyle = "#faf6f0";
    ctx.beginPath();
    ctx.arc(rugX + rugW * 0.5, rugY + rugH * 0.7, Math.min(rw, rh) * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.currentSelections.accentColor || "#CBB17C";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  draw2DBedroom(ctx, rx, ry, rw, rh) {
    // Bedroom Rug
    ctx.fillStyle = "rgba(232, 226, 216, 0.75)";
    const rugX = rx + rw * 0.18, rugY = ry + rh * 0.15, rugW = rw * 0.64, rugH = rh * 0.7;
    ctx.fillRect(rugX, rugY, rugW, rugH);

    // Fluted Headboard Wall
    ctx.fillStyle = this.currentSelections.accentWoodColor || "#8E5A3C";
    ctx.fillRect(rx + rw * 0.2, ry + 10, rw * 0.6, 26);

    // Bed Frame
    ctx.fillStyle = this.currentSelections.accentWoodColor || "#8E5A3C";
    const bedX = rx + rw * 0.28, bedY = ry + rh * 0.18, bedW = rw * 0.44, bedH = rh * 0.55;
    ctx.fillRect(bedX, bedY, bedW, bedH);

    // Duvet / Mattress (Takes selected bed fabric color!)
    ctx.fillStyle = this.currentSelections.sofaColor || "#D7CFC7";
    ctx.fillRect(bedX + 8, bedY + 35, bedW - 16, bedH - 45);
    ctx.strokeStyle = "#2b2b2b";
    ctx.lineWidth = 2;
    ctx.strokeRect(bedX + 8, bedY + 35, bedW - 16, bedH - 45);

    // Pillows
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bedX + 16, bedY + 8, (bedW - 48) / 2, 24);
    ctx.fillRect(bedX + 16 + (bedW - 48) / 2 + 16, bedY + 8, (bedW - 48) / 2, 24);

    // Nightstands
    ctx.fillStyle = this.currentSelections.accentWoodColor || "#8E5A3C";
    ctx.fillRect(bedX - 45, bedY + 10, 36, 40);
    ctx.fillRect(bedX + bedW + 9, bedY + 10, 36, 40);
  }

  draw2DKitchen(ctx, rx, ry, rw, rh) {
    // Rear Cabinetry Wall along the top
    ctx.fillStyle = this.currentSelections.accentWoodColor || "#22252A";
    ctx.fillRect(rx + 10, ry + 10, rw - 20, 55);
    ctx.strokeStyle = "#444444";
    ctx.strokeRect(rx + 10, ry + 10, rw - 20, 55);

    // Waterfall Island (Takes Quartz countertop / accent color!)
    const islX = rx + rw * 0.22, islY = ry + rh * 0.42, islW = rw * 0.56, islH = rh * 0.32;
    ctx.fillStyle = "#f8f6f2";
    ctx.fillRect(islX, islY, islW, islH);
    ctx.strokeStyle = this.currentSelections.accentColor || "#CBB17C";
    ctx.lineWidth = 4;
    ctx.strokeRect(islX, islY, islW, islH);

    // Island Undermount Sink
    ctx.fillStyle = "#22252A";
    ctx.fillRect(islX + islW * 0.2, islY + 14, islW * 0.22, islH * 0.4);

    // 3 Barstools (Take upholstery color!)
    ctx.fillStyle = this.currentSelections.sofaColor || "#D7CFC7";
    const stoolR = Math.min(rw, rh) * 0.05;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(islX + (i + 1) * (islW / 4), islY + islH + 28, stoolR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

// Export to window
window.InteriorRoomViewer = InteriorRoomViewer;
