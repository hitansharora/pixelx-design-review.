/**
 * LUMINA Atelier - 3D Interactive Room Visualizer
 * Built with Three.js
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
      sofaCushions: [],
      sofaBase: null,
      coffeeTableTop: null,
      coffeeTableBase: null,
      chairCushion: null,
      rug: null,
      lampShade: null,
      artCanvas: null
    };

    // Procedural texture caches
    this.textureCache = {};

    this.currentSelections = {
      wallColor: "#EAE6DF",
      wallMaterialId: "mat-wall-limewash",
      floorColor: "#C9A780",
      floorMaterialId: "mat-floor-oak-herringbone",
      sofaColor: "#F4F0EB",
      sofaFabricId: "mat-fab-boucle-ivory",
      accentColor: "#D4AF37",
      lightingMode: "golden"
    };

    this.isInitialized = false;
    this.init();
  }

  init() {
    if (typeof THREE === "undefined") {
      console.warn("Three.js not loaded yet or offline. Activating 2D Architectural Canvas view.");
      this.init2DFallback();
      return;
    }

    try {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      const width = this.container.clientWidth || 800;
      const height = this.container.clientHeight || 550;

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("#13161c");
      this.scene.fog = new THREE.FogExp2("#13161c", 0.025);

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
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below floor
      this.controls.minDistance = 3;
      this.controls.maxDistance = 18;
      this.controls.target.set(0, 1.2, 0);
    }

    // 5. Build Environment & Room
    this.setupLighting();
    this.generateProceduralTextures();
    this.buildRoomArchitecture();
    this.buildFurniture();
    this.buildDecor();

    // 6. Interaction listeners
    this.bindEvents();

    // 7. Render Loop
    this.isInitialized = true;
    this.animate();

    // Apply initial state
    this.applyMaterials(this.currentSelections);
  }

  // --- PROCEDURAL TEXTURE GENERATION ---
  generateProceduralTextures() {
    // 1. Wood Herringbone Canvas
    this.textureCache["wood-herringbone"] = this.createCanvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = "#d5b48b";
      ctx.fillRect(0, 0, w, h);
      const rows = 16;
      const cols = 8;
      const rw = w / cols;
      const rh = h / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const shift = (r % 2) * (rw / 2);
          const x = c * rw + shift;
          const y = r * rh;
          // Plank variation
          const shade = ((r * 13 + c * 29) % 25) - 12;
          ctx.fillStyle = `rgba(${shade > 0 ? 255 : 0}, ${shade > 0 ? 255 : 0}, ${shade > 0 ? 255 : 0}, ${Math.abs(shade) / 180})`;
          ctx.fillRect(x, y, rw, rh);
          // Joint line
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
      // Soft marble veins
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

      // Golden vein accent
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

    // 5. Plaster / Limewash subtle texture
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

    // 6. Bouclé / Fabric Weave texture
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
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xfff7ea, 0.7);
    this.scene.add(this.ambientLight);

    // Directional Sun light coming from window
    this.sunLight = new THREE.DirectionalLight(0xfff2db, 1.8);
    this.sunLight.position.set(10, 12, 6);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 30;
    this.sunLight.shadow.camera.left = -6;
    this.sunLight.shadow.camera.right = 6;
    this.sunLight.shadow.camera.top = 6;
    this.sunLight.shadow.camera.bottom = -6;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    // Chandelier / Ceiling Pendant Warm Point Light
    this.pendantLight = new THREE.PointLight(0xffd89e, 1.5, 12);
    this.pendantLight.position.set(0, 3.2, 0);
    this.pendantLight.castShadow = true;
    this.pendantLight.shadow.bias = -0.001;
    this.scene.add(this.pendantLight);

    // Floor Lamp Point Light
    this.lampLight = new THREE.PointLight(0xffbe6b, 1.2, 8);
    this.lampLight.position.set(-2.8, 2.1, -1.8);
    this.scene.add(this.lampLight);

    // Soft architectural fill light
    const fillLight = new THREE.DirectionalLight(0xd9e5ff, 0.4);
    fillLight.position.set(-6, 8, -6);
    this.scene.add(fillLight);
  }

  // --- ROOM ARCHITECTURE ---
  buildRoomArchitecture() {
    // Floor
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
    this.interactiveObjects.push(floor);

    // Baseboards
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.5 });
    const bbBack = new THREE.Mesh(new THREE.BoxGeometry(9.05, 0.15, 0.05), baseboardMat);
    bbBack.position.set(0, 0.075, -4.48);
    this.scene.add(bbBack);

    const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 9.05), baseboardMat);
    bbLeft.position.set(-4.48, 0.075, 0);
    this.scene.add(bbLeft);

    // Back Wall
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
    this.interactiveObjects.push(backWall);

    // Left Wall with large architectural glass opening / window
    const leftWallMat = wallMat.clone();
    const leftWall = new THREE.Mesh(wallGeo, leftWallMat);
    leftWall.position.set(-4.5, 2.3, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    leftWall.userData = { id: "left-wall", name: "Side Wall Finish", type: "walls" };
    this.scene.add(leftWall);
    this.meshes.leftWall = leftWall;
    this.interactiveObjects.push(leftWall);

    // Acoustic Wood Slat Feature Accent Wall Section on Back Wall (Right Portion)
    const slatGroup = new THREE.Group();
    const slatCount = 18;
    const slatW = 0.05;
    const slatD = 0.035;
    const slatH = 4.4;
    const slatSpacing = 0.11;
    const startX = 1.0;

    const slatMat = new THREE.MeshStandardMaterial({
      color: 0xb58c63,
      roughness: 0.45,
      metalness: 0.05
    });

    // Dark felt background backing
    const feltBacking = new THREE.Mesh(
      new THREE.BoxGeometry(slatCount * slatSpacing + 0.1, 4.4, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x18181c, roughness: 0.95 })
    );
    feltBacking.position.set(startX + (slatCount * slatSpacing) / 2, 2.2, -4.47);
    feltBacking.receiveShadow = true;
    slatGroup.add(feltBacking);

    for (let i = 0; i < slatCount; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(slatW, slatH, slatD), slatMat);
      slat.position.set(startX + i * slatSpacing, 2.2, -4.45);
      slat.castShadow = true;
      slat.receiveShadow = true;
      slatGroup.add(slat);
      this.meshes.accentWallSlats.push(slat);
    }
    slatGroup.userData = { id: "slat-wall", name: "Acoustic Fluted Slat Feature Wall", type: "walls" };
    this.scene.add(slatGroup);
    this.interactiveObjects.push(feltBacking);

    // Floor-to-Ceiling Luxury Window Frame on the Right Wall side
    this.buildArchitecturalWindow();

    // Ceiling with subtle recessed cove
    const ceilingGeo = new THREE.PlaneGeometry(9, 9);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xfaf8f5, roughness: 0.9 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.set(0, 4.6, 0);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.receiveShadow = true;
    this.scene.add(ceiling);
  }

  buildArchitecturalWindow() {
    const windowGroup = new THREE.Group();

    // Exterior Scenic Sky / Horizon Backdrop Plane
    const backdropGeo = new THREE.PlaneGeometry(16, 10);
    const skyTex = this.createCanvasTexture(512, 256, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#8cb4d8");
      grad.addColorStop(0.6, "#dce7f0");
      grad.addColorStop(1, "#f7ebe1");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Subtle cityscape silhouette at bottom
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

    // Window Mullions (Matte Black Modern Aluminum)
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f2428, roughness: 0.35 });
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.4, 0.08), frameMat);
    frameLeft.position.set(4.45, 2.2, -3.9);
    windowGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.4, 0.08), frameMat);
    frameRight.position.set(4.45, 2.2, 3.9);
    windowGroup.add(frameRight);

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

  // --- FURNITURE GEOMETRY ---
  buildFurniture() {
    // 1. High-End Luxury Area Rug
    const rugGeo = new THREE.BoxGeometry(5.2, 0.03, 4.2);
    const rugTex = this.textureCache["fabric"].clone();
    rugTex.repeat.set(8, 8);
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0xded8cc,
      map: rugTex,
      roughness: 0.95
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(-0.2, 0.015, 0.1);
    rug.receiveShadow = true;
    rug.userData = { id: "rug", name: "Hand-Knotted Luxury Rug", type: "rug" };
    this.scene.add(rug);
    this.meshes.rug = rug;
    this.interactiveObjects.push(rug);

    // 2. Modern Low-Slung Curved Sectional / Sofa
    this.buildSofa();

    // 3. Sculptural Coffee Table (Honed Stone / Calacatta Top)
    this.buildCoffeeTable();

    // 4. Accent Lounge Chair
    this.buildLoungeChair();

    // 5. Media Credenza / Floating Sideboard
    this.buildCredenza();
  }

  buildSofa() {
    const sofaGroup = new THREE.Group();

    const sofaMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSelections.sofaColor),
      roughness: 0.75,
      metalness: 0.02
    });

    const woodPlinthMat = new THREE.MeshStandardMaterial({
      color: 0x5a4330,
      roughness: 0.4
    });

    // Sofa Base Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 1.3), woodPlinthMat);
    plinth.position.set(-0.3, 0.06, -1.2);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    sofaGroup.add(plinth);
    this.meshes.sofaBase = plinth;

    // Main Seat Cushions (3 sections)
    const seatW = 1.15;
    for (let i = 0; i < 3; i++) {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(seatW - 0.04, 0.32, 1.15), sofaMat);
      seat.position.set(-1.4 + i * (seatW), 0.28, -1.2);
      seat.castShadow = true;
      seat.receiveShadow = true;
      sofaGroup.add(seat);
      this.meshes.sofaCushions.push(seat);
    }

    // Backrest
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.48, 0.26), sofaMat);
    backrest.position.set(-0.3, 0.62, -1.72);
    backrest.castShadow = true;
    backrest.receiveShadow = true;
    sofaGroup.add(backrest);
    this.meshes.sofaCushions.push(backrest);

    // Left Armrest
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 1.25), sofaMat);
    armL.position.set(-2.0, 0.52, -1.2);
    armL.castShadow = true;
    sofaGroup.add(armL);
    this.meshes.sofaCushions.push(armL);

    // Right Chaise Extension / Low Arm
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 1.25), sofaMat);
    armR.position.set(1.4, 0.52, -1.2);
    armR.castShadow = true;
    sofaGroup.add(armR);
    this.meshes.sofaCushions.push(armR);

    // Accent Throw Pillows
    const pillowMatA = new THREE.MeshStandardMaterial({ color: 0x3d4f48, roughness: 0.8 });
    const pillowA = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.16), pillowMatA);
    pillowA.position.set(-1.6, 0.58, -1.52);
    pillowA.rotation.y = 0.25;
    pillowA.rotation.z = -0.15;
    pillowA.castShadow = true;
    sofaGroup.add(pillowA);

    const pillowMatB = new THREE.MeshStandardMaterial({ color: 0xc89d66, roughness: 0.7 });
    const pillowB = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.35, 0.14), pillowMatB);
    pillowB.position.set(1.1, 0.58, -1.52);
    pillowB.rotation.y = -0.2;
    pillowB.castShadow = true;
    sofaGroup.add(pillowB);

    sofaGroup.userData = { id: "sofa", name: "Custom Sectional Sofa", type: "fabrics" };
    this.scene.add(sofaGroup);
    this.interactiveObjects.push(plinth, backrest);
  }

  buildCoffeeTable() {
    const tableGroup = new THREE.Group();

    // Sculptural Marble Top (Rounded slab)
    const marbleTex = this.textureCache["marble"].clone();
    marbleTex.repeat.set(1, 1);
    const tableTopMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      map: marbleTex,
      roughness: 0.22,
      metalness: 0.08
    });

    const topGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 48);
    const tableTop = new THREE.Mesh(topGeo, tableTopMat);
    tableTop.position.set(-0.2, 0.42, 0.1);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);
    this.meshes.coffeeTableTop = tableTop;

    // Sculptural Solid Fluted Base
    const baseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSelections.accentColor),
      roughness: 0.35,
      metalness: 0.65
    });

    const baseGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.38, 36);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(-0.2, 0.19, 0.1);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    tableGroup.add(baseMesh);
    this.meshes.coffeeTableBase = baseMesh;

    // Decor on coffee table: Ceramic bowl & art book
    const bowlGeo = new THREE.CylinderGeometry(0.18, 0.09, 0.08, 24);
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0x222224, roughness: 0.3 });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.set(-0.35, 0.5, 0.15);
    bowl.castShadow = true;
    tableGroup.add(bowl);

    const bookGeo = new THREE.BoxGeometry(0.24, 0.04, 0.32);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0x9c8266, roughness: 0.6 });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(0.1, 0.48, -0.05);
    book.rotation.y = 0.4;
    book.castShadow = true;
    tableGroup.add(book);

    tableGroup.userData = { id: "coffee-table", name: "Sculptural Coffee Table", type: "accents" };
    this.scene.add(tableGroup);
    this.interactiveObjects.push(tableTop);
  }

  buildLoungeChair() {
    const chairGroup = new THREE.Group();
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x9b5a2b, // Cognac leather
      roughness: 0.6,
      metalness: 0.05
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f22,
      roughness: 0.4,
      metalness: 0.8
    });

    // Seat cushion
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 0.82), leatherMat);
    seat.position.set(1.9, 0.38, 0.4);
    seat.rotation.y = -0.45;
    seat.rotation.x = -0.08;
    seat.castShadow = true;
    chairGroup.add(seat);
    this.meshes.chairCushion = seat;

    // Backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.12), leatherMat);
    back.position.set(2.2, 0.72, 0.2);
    back.rotation.y = -0.45;
    back.rotation.x = -0.22;
    back.castShadow = true;
    chairGroup.add(back);

    // Slim metal legs
    const legGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.45, 12);
    const leg1 = new THREE.Mesh(legGeo, frameMat);
    leg1.position.set(1.6, 0.22, 0.1);
    chairGroup.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, frameMat);
    leg2.position.set(2.3, 0.22, 0.6);
    chairGroup.add(leg2);

    chairGroup.userData = { id: "lounge-chair", name: "Designer Accent Lounge Chair", type: "fabrics" };
    this.scene.add(chairGroup);
    this.interactiveObjects.push(seat);
  }

  buildCredenza() {
    const credenzaGroup = new THREE.Group();
    const oakMat = new THREE.MeshStandardMaterial({
      color: 0x5a4432,
      roughness: 0.45,
      metalness: 0.05
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.55, 0.45), oakMat);
    body.position.set(-2.8, 0.6, -4.2);
    body.castShadow = true;
    body.receiveShadow = true;
    credenzaGroup.add(body);

    // Brass metal legs
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.8
    });
    for (let x of [-3.8, -1.8]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.32, 16), brassMat);
      leg.position.set(x + 1.0, 0.16, -4.2);
      leg.castShadow = true;
      credenzaGroup.add(leg);
    }

    // Ceramic vase on credenza
    const vaseGeo = new THREE.CylinderGeometry(0.09, 0.14, 0.38, 20);
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0xded9d0, roughness: 0.35 });
    const vase = new THREE.Mesh(vaseGeo, vaseMat);
    vase.position.set(-2.2, 1.05, -4.2);
    vase.castShadow = true;
    credenzaGroup.add(vase);

    this.scene.add(credenzaGroup);
  }

  // --- DECORATIVE ELEMENTS ---
  buildDecor() {
    // 1. Large Contemporary Canvas Wall Art (Above Sofa on Left/Center)
    const artGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.4 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.8, 0.06), frameMat);
    frame.position.set(-1.0, 2.7, -4.44);
    artGroup.add(frame);

    const artTex = this.createCanvasTexture(512, 360, (ctx, w, h) => {
      // Minimalist organic abstract artwork
      ctx.fillStyle = "#f5f2eb";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#2c3e50";
      ctx.beginPath();
      ctx.arc(w * 0.4, h * 0.55, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#c59b6d";
      ctx.beginPath();
      ctx.arc(w * 0.65, h * 0.42, 85, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.7);
      ctx.bezierCurveTo(w * 0.4, h * 0.2, w * 0.7, h * 0.9, w * 0.85, h * 0.3);
      ctx.stroke();
    });

    const artCanvasMat = new THREE.MeshBasicMaterial({ map: artTex });
    const artCanvas = new THREE.Mesh(new THREE.PlaneGeometry(2.45, 1.65), artCanvasMat);
    artCanvas.position.set(-1.0, 2.7, -4.4);
    artGroup.add(artCanvas);
    this.scene.add(artGroup);

    // 2. Minimalist Architectural Floor Lamp
    this.buildFloorLamp();

    // 3. Contemporary Pendant Chandelier
    this.buildChandelier();

    // 4. Large Ceramic Planter with Fiddle Leaf Fig
    this.buildPlanter();
  }

  buildFloorLamp() {
    const lampGroup = new THREE.Group();
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.75 });

    // Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 24), brassMat);
    base.position.set(-2.8, 0.02, -1.8);
    lampGroup.add(base);

    // Stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.1, 16), brassMat);
    stem.position.set(-2.8, 1.05, -1.8);
    lampGroup.add(stem);

    // Glowing Arch Shade
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
    this.scene.add(lampGroup);
    this.interactiveObjects.push(shade);
  }

  buildChandelier() {
    const chGroup = new THREE.Group();
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.85 });

    // Hanging wire
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.2, 8), brassMat);
    wire.position.set(0, 4.0, 0);
    chGroup.add(wire);

    // Horizontal ring structure
    const ringGeo = new THREE.TorusGeometry(0.75, 0.025, 16, 48);
    const ring = new THREE.Mesh(ringGeo, brassMat);
    ring.position.set(0, 3.4, 0);
    ring.rotation.x = Math.PI / 2;
    chGroup.add(ring);

    // Frosted glowing glass globes
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffddaa,
      emissiveIntensity: 0.8,
      roughness: 0.1
    });

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const gx = Math.cos(angle) * 0.75;
      const gz = Math.sin(angle) * 0.75;
      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), globeMat);
      globe.position.set(gx, 3.4, gz);
      chGroup.add(globe);
    }

    this.scene.add(chGroup);
  }

  buildPlanter() {
    const plantGroup = new THREE.Group();

    // Ceramic pot
    const potMat = new THREE.MeshStandardMaterial({ color: 0xefede8, roughness: 0.6 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.24, 0.65, 24), potMat);
    pot.position.set(3.6, 0.32, -3.6);
    pot.castShadow = true;
    pot.receiveShadow = true;
    plantGroup.add(pot);

    // Soil
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x2b1e17, roughness: 0.9 });
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 24), soilMat);
    soil.position.set(3.6, 0.62, -3.6);
    plantGroup.add(soil);

    // Trunk & Leaves
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3c31, roughness: 0.7 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.4, 12), trunkMat);
    trunk.position.set(3.6, 1.25, -3.6);
    trunk.castShadow = true;
    plantGroup.add(trunk);

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d4f3b, roughness: 0.45, side: THREE.DoubleSide });
    for (let i = 0; i < 8; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), leafMat);
      leaf.scale.set(1.4, 0.1, 0.7);
      const angle = i * 0.8;
      leaf.position.set(3.6 + Math.cos(angle) * 0.35, 1.2 + i * 0.12, -3.6 + Math.sin(angle) * 0.35);
      leaf.rotation.y = angle;
      leaf.rotation.z = (Math.random() - 0.5) * 0.4;
      leaf.castShadow = true;
      plantGroup.add(leaf);
    }

    this.scene.add(plantGroup);
  }

  // --- INTERACTION & EVENTS ---
  bindEvents() {
    window.addEventListener("resize", () => this.onResize());

    // Raycast on hover & click
    const dom = this.renderer.domElement;
    dom.addEventListener("mousemove", (e) => this.onMouseMove(e));
    dom.addEventListener("click", (e) => this.onClick(e));
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
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
    const pos = this.getPointerPosition(event);
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      this.container.style.cursor = "pointer";
      const hit = intersects[0].object;
      this.hoveredMesh = hit;

      // Dispatch custom hover event for UI tooltip
      const eventData = hit.userData || (hit.parent && hit.parent.userData);
      if (eventData && eventData.name) {
        window.dispatchEvent(new CustomEvent("room-element-hover", {
          detail: { name: eventData.name, type: eventData.type, clientX: event.clientX, clientY: event.clientY }
        }));
      }
    } else {
      this.container.style.cursor = "default";
      this.hoveredMesh = null;
      window.dispatchEvent(new CustomEvent("room-element-unhover"));
    }
  }

  onClick(event) {
    const pos = this.getPointerPosition(event);
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const targetData = hit.userData || (hit.parent && hit.parent.userData);
      if (targetData && targetData.type) {
        // Trigger quick selection panel in UI
        window.dispatchEvent(new CustomEvent("room-element-clicked", {
          detail: { id: targetData.id, name: targetData.name, type: targetData.type }
        }));
      }
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
    } else if (viewName === "sofa") {
      this.animateCameraTo({ x: 2.5, y: 1.8, z: 3.2 }, { x: -0.6, y: 0.8, z: -0.8 });
    }
  }

  animateCameraTo(targetPos, targetLookAt) {
    const startPos = { ...this.camera.position };
    const startTarget = { ...this.controls.target };
    const duration = 900;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      this.camera.position.x = startPos.x + (targetPos.x - startPos.x) * ease;
      this.camera.position.y = startPos.y + (targetPos.y - startPos.y) * ease;
      this.camera.position.z = startPos.z + (targetPos.z - startPos.z) * ease;

      this.controls.target.x = startTarget.x + (targetLookAt.x - startTarget.x) * ease;
      this.controls.target.y = startTarget.y + (targetLookAt.y - startTarget.y) * ease;
      this.controls.target.z = startTarget.z + (targetLookAt.z - startTarget.z) * ease;

      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  // --- MATERIAL & LIGHTING UPDATES ---
  applyMaterials(options) {
    this.currentSelections = { ...this.currentSelections, ...options };

    if (this.fallbackCanvas) {
      this.draw2DFallback();
      return;
    }

    // 1. Flooring
    if (this.meshes.floor && options.floorColor) {
      this.meshes.floor.material.color.set(options.floorColor);

      // Select texture style
      let texStyle = "wood-herringbone";
      if (options.floorMaterialId) {
        if (options.floorMaterialId.includes("walnut") || options.floorMaterialId.includes("chevron")) {
          texStyle = "wood-chevron";
        } else if (options.floorMaterialId.includes("microcement")) {
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

    // 2. Walls
    if (this.meshes.backWall && options.wallColor) {
      this.meshes.backWall.material.color.set(options.wallColor);
      this.meshes.leftWall.material.color.set(options.wallColor);

      // Check if slat feature should be highlighted or tinted
      const isSlatStyle = options.wallMaterialId && options.wallMaterialId.includes("slat");
      this.meshes.accentWallSlats.forEach(slat => {
        slat.material.color.set(isSlatStyle ? 0xa87e53 : 0x8a6e50);
      });
    }

    // 3. Sofa Upholstery
    if (options.sofaColor) {
      const sofaCol = new THREE.Color(options.sofaColor);
      this.meshes.sofaCushions.forEach(cushion => {
        cushion.material.color.copy(sofaCol);
        cushion.material.needsUpdate = true;
      });
    }

    // 4. Accent Elements (Coffee table base, hardware)
    if (options.accentColor && this.meshes.coffeeTableBase) {
      this.meshes.coffeeTableBase.material.color.set(options.accentColor);
    }

    // 5. Lighting Ambience
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
      // Natural Crisp Daylight
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
      // Warm Sunset Golden Hour
      this.scene.background.set("#1e1a18");
      this.ambientLight.color.set(0xffeed6);
      this.ambientLight.intensity = 0.8;

      this.sunLight.color.set(0xffa852);
      this.sunLight.intensity = 2.6;
      this.sunLight.position.set(12, 6, 8); // Lower sun angle for long shadows

      this.pendantLight.intensity = 1.2;
      this.lampLight.intensity = 1.0;
      if (this.meshes.lampShade) this.meshes.lampShade.material.emissiveIntensity = 0.6;
    } else if (mode === "night") {
      // Intimate Night Ambient
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

  // --- ANIMATION LOOP ---
  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // --- 2D ARCHITECTURAL FALLBACK (When offline or WebGL disabled) ---
  init2DFallback() {
    this.container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = this.container.clientWidth || 800;
    canvas.height = this.container.clientHeight || 550;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    this.container.appendChild(canvas);
    this.fallbackCanvas = canvas;
    this.draw2DFallback();

    // Hotspot clicks on 2D floorplan
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Sofa zone
      if (x > canvas.width * 0.35 && x < canvas.width * 0.65 && y > canvas.height * 0.25 && y < canvas.height * 0.55) {
        window.dispatchEvent(new CustomEvent("room-element-clicked", {
          detail: { id: "sofa", name: "Custom Sectional Sofa", type: "fabrics" }
        }));
      } else if (y < canvas.height * 0.2 || x < canvas.width * 0.2) {
        window.dispatchEvent(new CustomEvent("room-element-clicked", {
          detail: { id: "walls", name: "Wall Finish", type: "walls" }
        }));
      } else {
        window.dispatchEvent(new CustomEvent("room-element-clicked", {
          detail: { id: "floor", name: "Flooring", type: "flooring" }
        }));
      }
    });

    window.addEventListener("resize", () => {
      if (this.fallbackCanvas) {
        this.fallbackCanvas.width = this.container.clientWidth || 800;
        this.fallbackCanvas.height = this.container.clientHeight || 550;
        this.draw2DFallback();
      }
    });
  }

  draw2DFallback() {
    if (!this.fallbackCanvas) return;
    const ctx = this.fallbackCanvas.getContext("2d");
    const w = this.fallbackCanvas.width;
    const h = this.fallbackCanvas.height;

    // Background
    ctx.fillStyle = "#121620";
    ctx.fillRect(0, 0, w, h);

    // Architectural room box
    const rx = w * 0.15;
    const ry = h * 0.12;
    const rw = w * 0.7;
    const rh = h * 0.75;

    // Floor
    ctx.fillStyle = this.currentSelections.floorColor || "#C9A780";
    ctx.fillRect(rx, ry, rw, rh);

    // Subtle herringbone / plank pattern
    ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
    ctx.lineWidth = 1;
    for (let x = rx; x < rx + rw; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, ry);
      ctx.lineTo(x, ry + rh);
      ctx.stroke();
    }

    // Walls (Outer boundary)
    ctx.strokeStyle = this.currentSelections.wallColor || "#EAE6DF";
    ctx.lineWidth = 14;
    ctx.strokeRect(rx, ry, rw, rh);

    // Luxury Rug
    ctx.fillStyle = "rgba(235, 230, 222, 0.75)";
    const rugX = rx + rw * 0.25;
    const rugY = ry + rh * 0.25;
    const rugW = rw * 0.52;
    const rugH = rh * 0.52;
    ctx.fillRect(rugX, rugY, rugW, rugH);
    ctx.strokeStyle = "rgba(180, 160, 130, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(rugX, rugY, rugW, rugH);

    // Sectional Sofa
    ctx.fillStyle = this.currentSelections.sofaColor || "#F4F0EB";
    const sofaX = rugX + rugW * 0.15;
    const sofaY = rugY + rugH * 0.15;
    const sofaW = rugW * 0.7;
    const sofaH = rugH * 0.35;
    ctx.fillRect(sofaX, sofaY, sofaW, sofaH);
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;
    ctx.strokeRect(sofaX, sofaY, sofaW, sofaH);

    // Sofa Cushions divisions
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    const cW = sofaW / 3;
    for (let i = 0; i < 3; i++) {
      ctx.strokeRect(sofaX + i * cW, sofaY, cW, sofaH);
    }

    // Coffee Table (Round)
    ctx.fillStyle = "#faf6f0";
    ctx.beginPath();
    const ctxX = rugX + rugW * 0.5;
    const ctxY = rugY + rugH * 0.65;
    ctx.arc(ctxX, ctxY, Math.min(rw, rh) * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.currentSelections.accentColor || "#D4AF37";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Lighting mode tint overlay
    if (this.currentSelections.lightingMode === "golden") {
      ctx.fillStyle = "rgba(255, 170, 70, 0.12)";
      ctx.fillRect(0, 0, w, h);
    } else if (this.currentSelections.lightingMode === "night") {
      ctx.fillStyle = "rgba(10, 18, 40, 0.35)";
      ctx.fillRect(0, 0, w, h);
    }

    // Floor plan badge
    ctx.fillStyle = "rgba(16, 22, 34, 0.85)";
    ctx.fillRect(rx + 15, ry + 15, 230, 48);
    ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(rx + 15, ry + 15, 230, 48);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Architectural Layout Plan", rx + 25, ry + 36);
    ctx.fillStyle = "#d4af37";
    ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Interactive Configurator Active", rx + 25, ry + 52);
  }
}

// Export to window
window.InteriorRoomViewer = InteriorRoomViewer;
