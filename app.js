/**
 * PixelX Studios - Interactive Design-Review, 3D Studio & Client Approval System
 * Course Project Submission - Group Sr. No. 4 (Hitansh Arora)
 * 
 * Features:
 * - Dynamic Multi-Room 3D Engine: Living Room (Sofa), Bedroom (King Bed), Kitchen (Island)
 * - Interactive 2D Color Customizer Canvas (Real-time color reflection for walls, floors, fabrics)
 * - Live Cost & Budget Tracking Engine
 * - Granular 3-Pillar Review: Layout, Materials & Color Scheme
 * - Modal-based Material Inspection (Zero annoying browser alerts)
 */

// Initial Seed Data showcasing realistic Interior Design project
const INITIAL_PROJECT_DATA = {
  projectName: "Villa Serena • Project #104",
  clientName: "Ananya & Rahul Sharma",
  designerName: "Hitansh Arora (Lead Architect)",
  targetBudget: 85000,
  currency: "$",
  activeRoomId: "room_living",
  activeConceptIndex: 0,
  currentRole: "client", // 'client' or 'designer'
  viewportMode: "3d", // '3d' or 'photo'
  view2DSubMode: "canvas", // 'canvas' or 'photo'
  view2DAngle: "perspective", // 'perspective' | 'isometric' | 'topdown'
  currentLightingMode: "golden",
  rooms: [
    {
      id: "room_living",
      name: "Living Room",
      description: "Spacious double-height living lounge with seamless terrace view and natural lighting.",
      sqft: 380,
      baseCost: 28500,
      status: "under_review",
      concepts: [
        {
          name: "Concept A: Japandi Minimalist",
          version: "v2.0",
          status: "under_review",
          image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
          thumbnails: [
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80"
          ],
          layoutDetails: "Open layout with 7-seater low-profile modular sofa & fluted wall partition",
          layoutStatus: "approved",
          colorSchemeName: "Warm Alabaster & Earthy Clay",
          colorSchemeStatus: "changes_requested",
          materialStatus: "approved",
          lightingMode: "golden",
          materials: [
            { category: "Wall Finish", name: "Warm Alabaster", code: "AP-8123", color: "#F0ECE1", supplier: "Asian Paints Royale", pricePerSqft: 12, grade: "Matte Velvet Zero-VOC" },
            { category: "Flooring", name: "Herringbone White Oak", code: "WD-701", color: "#CBB69D", supplier: "Havwoods International", pricePerSqft: 22, grade: "Select Grade UV Poly" },
            { category: "Accent Wood", name: "Natural Fluted Teak", code: "TK-402", color: "#8E5A3C", supplier: "WoodUpp Architectural", pricePerSqft: 34, grade: "Acoustic Slats NRC 0.85" },
            { category: "Upholstery", name: "Oatmeal Bouclé Fabric", code: "FB-209", color: "#D7CFC7", supplier: "Dedar Milano", pricePerSqft: 45, grade: "60,000 Heavy Duty Rubs" },
            { category: "Metal Trims", name: "Brushed Champagne Brass", code: "MT-105", color: "#CBB17C", supplier: "Armac Martin UK", pricePerSqft: 28, grade: "Living Satin Lacquer" }
          ],
          comments: [
            {
              author: "Hitansh Arora (Designer)",
              role: "designer",
              time: "Yesterday, 4:15 PM",
              tag: "Layout",
              text: "Updated the layout to move the accent lounge chair closer to the floor lamp as requested."
            },
            {
              author: "Ananya Sharma (Client)",
              role: "client",
              time: "Today, 10:20 AM",
              tag: "Materials",
              text: "We love the oatmeal bouclé fabric! Could we confirm if the wood finish is scratch-resistant for pets?"
            }
          ]
        },
        {
          name: "Concept B: Contemporary Luxe",
          version: "v1.1",
          status: "under_review",
          image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
          thumbnails: [
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80"
          ],
          layoutDetails: "Formal symmetrical seating with marble center coffee slab and velvet sectional",
          layoutStatus: "under_review",
          colorSchemeName: "Deep Greige & Charcoal Accent",
          colorSchemeStatus: "under_review",
          materialStatus: "under_review",
          lightingMode: "night",
          materials: [
            { category: "Wall Finish", name: "Muted Cashmere Plaster", code: "AP-9014", color: "#D9D2C9", supplier: "Portola Limewash", pricePerSqft: 14, grade: "Roman Clay Sheen" },
            { category: "Flooring", name: "American Smoked Walnut", code: "WD-904", color: "#7B624A", supplier: "Listone Giordano", pricePerSqft: 28, grade: "Chevron Reserve" },
            { category: "Stone Accent", name: "Italian Statuario Marble", code: "MB-101", color: "#EFEFEF", supplier: "Antolini Italy", pricePerSqft: 48, grade: "Honed Silk Extra" },
            { category: "Upholstery", name: "Midnight Charcoal Velvet", code: "FB-882", color: "#32373B", supplier: "Pierre Frey", pricePerSqft: 52, grade: "100,000 Rubs Mohair" },
            { category: "Metal Trims", name: "Matte Black Titanium", code: "MT-904", color: "#1E1E1E", supplier: "Architectural Fine Coat", pricePerSqft: 24, grade: "PVD Finish" }
          ],
          comments: [
            {
              author: "Hitansh Arora (Designer)",
              role: "designer",
              time: "Oct 28, 2:00 PM",
              tag: "General",
              text: "Concept B provides a moodier, evening lounge aesthetic with dramatic marble and dark walnut."
            }
          ]
        }
      ]
    },
    {
      id: "room_master_bed",
      name: "Master Bedroom",
      description: "Quiet sanctuary featuring acoustic wood panel headboard and walk-in wardrobe.",
      sqft: 290,
      baseCost: 22400,
      status: "approved",
      concepts: [
        {
          name: "Concept A: Serene Neutral Suite",
          version: "v2.1",
          status: "approved",
          image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
          thumbnails: [
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=300&q=80"
          ],
          layoutDetails: "Centered king bed with floating nightstands and integrated cove perimeter illumination",
          layoutStatus: "approved",
          colorSchemeName: "Whispering Sand & Oak",
          colorSchemeStatus: "approved",
          materialStatus: "approved",
          lightingMode: "golden",
          materials: [
            { category: "Wall Finish", name: "Whispering Sand", code: "AP-301", color: "#E8E2D7", supplier: "Farrow & Ball", pricePerSqft: 12, grade: "Estate Emulsion" },
            { category: "Flooring", name: "Natural White Oak Planks", code: "WD-102", color: "#D4C2AA", supplier: "Havwoods", pricePerSqft: 20, grade: "Engineered Plank" },
            { category: "Headboard Wood", name: "Fluted White Oak Wall", code: "TK-201", color: "#B89B7A", supplier: "Custom Millwork", pricePerSqft: 32, grade: "Acoustic Slat" },
            { category: "Bedding Fabric", name: "Natural Belgian Linen", code: "FB-112", color: "#D7D0C5", supplier: "Libeco Home", pricePerSqft: 38, grade: "100% Organic Flax" },
            { category: "Hardware", name: "Brushed Brass Sconces", code: "MT-302", color: "#D4AF37", supplier: "Custom Lighting", pricePerSqft: 25, grade: "Satin Brass" }
          ],
          comments: [
            {
              author: "Rahul Sharma (Client)",
              role: "client",
              time: "Nov 2, 11:00 AM",
              tag: "Approval",
              text: "The fluted headboard accent is exactly what we wanted! Fully approved."
            }
          ]
        }
      ]
    },
    {
      id: "room_kitchen",
      name: "Modular Kitchen",
      description: "Ergonomic German-engineered chef kitchen with quartz waterfall island.",
      sqft: 220,
      baseCost: 26800,
      status: "under_review",
      concepts: [
        {
          name: "Concept A: Italian Minimalist",
          version: "v1.2",
          status: "under_review",
          image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
          thumbnails: [
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80"
          ],
          layoutDetails: "Parallel island kitchen with hidden appliance garage and pocket fluted pantry",
          layoutStatus: "approved",
          colorSchemeName: "Graphite Charcoal & Warm Oak",
          colorSchemeStatus: "under_review",
          materialStatus: "under_review",
          lightingMode: "day",
          materials: [
            { category: "Cabinetry Finish", name: "Fenix NTM Matte Black", code: "FN-0720", color: "#22252A", supplier: "Arpa Industriale", pricePerSqft: 40, grade: "Thermal Healing Nano" },
            { category: "Countertop Quartz", name: "Calacatta Gold Quartz", code: "QZ-880", color: "#F7F5F0", supplier: "Caesarstone", pricePerSqft: 55, grade: "Non-porous NSF Cert" },
            { category: "Flooring", name: "Continuous Micro-Cement", code: "MC-101", color: "#B8B3AB", supplier: "Ideal Work", pricePerSqft: 18, grade: "Seamless Water-Resistant" },
            { category: "Barstool Fabric", name: "Caramel Saddle Leather", code: "FB-405", color: "#9E6843", supplier: "Pelle Frau", pricePerSqft: 42, grade: "Full Grain Tuscan" },
            { category: "Linear Lighting", name: "Brushed Champagne Brass", code: "MT-105", color: "#CBB17C", supplier: "Custom Studio", pricePerSqft: 30, grade: "Linear LED Bar" }
          ],
          comments: [
            {
              author: "Hitansh Arora (Designer)",
              role: "designer",
              time: "Nov 3, 3:30 PM",
              tag: "Appliances",
              text: "All cabinetry doors are integrated with tip-on Blumotion push mechanisms."
            }
          ]
        }
      ]
    }
  ]
};

// Global App State
let state = loadData();
let viewer = null;
let selectedMaterialForModal = null;

// --- PERSISTENCE HELPERS ---
function loadData() {
  const saved = localStorage.getItem("pixelx_design_review_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.view2DSubMode) parsed.view2DSubMode = "canvas";
      if (!parsed.view2DAngle) parsed.view2DAngle = "perspective";
      if (!parsed.currentLightingMode) parsed.currentLightingMode = "golden";
      return parsed;
    } catch (e) {
      console.warn("Failed to parse saved state, using seed data.", e);
    }
  }
  return JSON.parse(JSON.stringify(INITIAL_PROJECT_DATA));
}

function saveData(data) {
  localStorage.setItem("pixelx_design_review_state", JSON.stringify(data));
}

function resetDemoData() {
  if (confirm("Reset demo data back to initial state?")) {
    localStorage.removeItem("pixelx_design_review_state");
    state = JSON.parse(JSON.stringify(INITIAL_PROJECT_DATA));
    saveData(state);
    renderApp();
    showToast("Project data reset to initial showcase state.", "success");
  }
}

// Helper: Determine Room Type
function getRoomType(room) {
  if (!room) return "living";
  const rId = (room.id || "").toLowerCase();
  const rName = (room.name || "").toLowerCase();
  if (rId.includes("bed") || rName.includes("bed")) return "bedroom";
  if (rId.includes("kitchen") || rName.includes("kitchen") || rId.includes("cook")) return "kitchen";
  if (rId.includes("office") || rName.includes("office") || rName.includes("study")) return "office";
  return "living";
}

// --- COST & BUDGET CALCULATIONS ---
function calculateRoomCost(room, conceptIndex = 0) {
  const concept = room.concepts[conceptIndex] || room.concepts[0];
  let cost = room.baseCost || 25000;

  if (concept && concept.materials) {
    concept.materials.forEach(mat => {
      const rate = mat.pricePerSqft || 20;
      cost += Math.round((room.sqft || 250) * rate * 0.12);
    });
  }

  return cost;
}

function calculateProjectTotal() {
  return state.rooms.reduce((sum, room) => {
    return sum + calculateRoomCost(room, 0);
  }, 0);
}

// --- 3D VIEWER INITIALIZATION & DYNAMIC SYNC ---
function init3DViewer() {
  const container = document.getElementById("three-canvas-container");
  if (!container) return;

  if (typeof InteriorRoomViewer !== "undefined" && !viewer) {
    try {
      viewer = new InteriorRoomViewer("three-canvas-container");
    } catch (e) {
      console.warn("3D viewer init error", e);
    }
  }

  sync3DViewerMaterials();
}

function sync3DViewerMaterials() {
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  if (!currentRoom) return;

  const activeConcept = currentRoom.concepts[state.activeConceptIndex] || currentRoom.concepts[0];
  const roomType = getRoomType(currentRoom);

  let wallColor = "#F0ECE1";
  let floorColor = "#CBB69D";
  let sofaColor = "#D7CFC7";
  let accentWoodColor = "#8E5A3C";
  let accentColor = "#CBB17C";

  if (activeConcept && activeConcept.materials) {
    activeConcept.materials.forEach(mat => {
      const cat = (mat.category || "").toLowerCase();
      if (cat.includes("wall") || cat.includes("paint")) wallColor = mat.color;
      else if (cat.includes("floor") || cat.includes("cement")) floorColor = mat.color;
      else if (cat.includes("upholstery") || cat.includes("bed") || cat.includes("fabric") || cat.includes("linen") || cat.includes("leather")) sofaColor = mat.color;
      else if (cat.includes("wood") || cat.includes("cabinet") || cat.includes("teak") || cat.includes("slat") || cat.includes("headboard")) accentWoodColor = mat.color;
      else if (cat.includes("metal") || cat.includes("accent") || cat.includes("stone") || cat.includes("counter") || cat.includes("trim") || cat.includes("quartz")) accentColor = mat.color;
    });
  }

  const selections = {
    wallColor: wallColor,
    floorColor: floorColor,
    sofaColor: sofaColor,
    accentWoodColor: accentWoodColor,
    accentColor: accentColor,
    lightingMode: state.currentLightingMode || activeConcept.lightingMode || "golden"
  };

  // 1. Update 3D Model Room Type & Materials
  if (viewer) {
    try {
      if (viewer.currentRoomType !== roomType) {
        viewer.setRoomType(roomType, selections);
      } else {
        viewer.applyMaterials(selections);
      }
    } catch (e) {
      console.warn("3D viewer update error:", e);
    }
  }

  // 2. Update 2D Interactive Architectural Canvas Model with chosen colors & angle!
  render2DColorCustomizerCanvas(roomType, selections, state.view2DAngle || "perspective");

  // 3. Update Reference Photo Hotspots & Lighting Tint!
  renderPhotoHotspots(activeConcept, selections);
}

// Helper: Color Math Utility
function adjustBrightness(hex, percent) {
  if (!hex || hex[0] !== "#") return hex || "#888888";
  let num = parseInt(hex.slice(1), 16);
  if (hex.length === 4) {
    num = parseInt(hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3], 16);
  }
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// --- 2D ARCHITECTURAL CANVAS ENGINE ---
function render2DColorCustomizerCanvas(roomType, selections, angleMode = "perspective") {
  const canvas = document.getElementById("photo2DCanvas");
  if (!canvas) return;

  const parent = canvas.parentElement;
  const rect = parent ? parent.getBoundingClientRect() : null;
  const dpr = window.devicePixelRatio || 1;
  const displayW = (rect && rect.width > 0) ? rect.width : (parent ? parent.clientWidth || 800 : 800);
  const displayH = (rect && rect.height > 0) ? rect.height : 480;

  canvas.width = Math.round(displayW * dpr);
  canvas.height = Math.round(displayH * dpr);

  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.scale(dpr, dpr);

  const w = displayW;
  const h = displayH;

  // Background
  ctx.fillStyle = "#10131a";
  ctx.fillRect(0, 0, w, h);

  if (angleMode === "topdown") {
    drawBlueprintView(ctx, w, h, roomType, selections);
  } else if (angleMode === "isometric") {
    drawIsometricView(ctx, w, h, roomType, selections);
  } else {
    drawPerspectiveView(ctx, w, h, roomType, selections);
  }

  // 4. Update Floating HUD Pill
  const hud = document.getElementById("canvasHudPill");
  if (hud) {
    const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
    const roomName = currentRoom ? currentRoom.name : "Studio";
    const sqft = currentRoom ? currentRoom.sqft || 320 : 320;
    const lightIcon = selections.lightingMode === "golden" ? "🌅 Golden" : (selections.lightingMode === "night" ? "🌙 Night" : "☀️ Day");
    const angleLabel = angleMode === "isometric" ? "📐 Isometric" : (angleMode === "topdown" ? "🗺️ Blueprint" : "🛋️ Perspective");

    hud.innerHTML = `
      <span class="canvas-hud-space">${roomName} • ${sqft} sq ft</span>
      <div class="canvas-hud-chips">
        <span class="canvas-hud-chip" title="Wall Paint"><span class="canvas-hud-dot" style="background:${selections.wallColor}"></span> Wall</span>
        <span class="canvas-hud-chip" title="Flooring"><span class="canvas-hud-dot" style="background:${selections.floorColor}"></span> Floor</span>
        <span class="canvas-hud-chip" title="Fabric / Upholstery"><span class="canvas-hud-dot" style="background:${selections.sofaColor}"></span> Fabric</span>
        <span class="canvas-hud-chip" title="Millwork Wood"><span class="canvas-hud-dot" style="background:${selections.accentWoodColor}"></span> Wood</span>
        <span class="canvas-hud-chip" title="Stone / Metal Accent"><span class="canvas-hud-dot" style="background:${selections.accentColor}"></span> Accent</span>
      </div>
      <span class="badge badge-subtle" style="font-size:0.68rem; padding: 2px 7px;">${angleLabel} • ${lightIcon}</span>
    `;
  }

  ctx.restore();
}

// 1. Perspective 2.5D Studio View
function drawPerspectiveView(ctx, w, h, roomType, selections) {
  const vp = { x: w * 0.45, y: h * 0.32 };
  const bwX = w * 0.18, bwY = h * 0.08, bwW = w * 0.76, bwH = h * 0.44;
  const floorY = bwY + bwH; // approx 0.52 * h

  // 1. Ceiling
  const ceilGrad = ctx.createLinearGradient(0, 0, 0, bwY);
  ceilGrad.addColorStop(0, "#11141e");
  ceilGrad.addColorStop(1, "#1a1f2e");
  ctx.fillStyle = ceilGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(bwX + bwW, bwY);
  ctx.lineTo(bwX, bwY);
  ctx.closePath();
  ctx.fill();

  // Ceiling Cove Light Strip
  ctx.strokeStyle = selections.lightingMode === "night" ? "rgba(255, 200, 120, 0.65)" : "rgba(255, 235, 205, 0.45)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bwX, bwY);
  ctx.lineTo(bwX + bwW, bwY);
  ctx.stroke();

  // 2. Left Wall in perspective
  const wallCol = selections.wallColor || "#F0ECE1";
  const leftWallGrad = ctx.createLinearGradient(0, 0, bwX, floorY);
  leftWallGrad.addColorStop(0, adjustBrightness(wallCol, -25));
  leftWallGrad.addColorStop(0.7, wallCol);
  leftWallGrad.addColorStop(1, adjustBrightness(wallCol, -15));

  ctx.fillStyle = leftWallGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(bwX, bwY);
  ctx.lineTo(bwX, floorY);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Architectural Floor-to-Ceiling Window on Left
  const winTopLeft = { x: w * 0.02, y: h * 0.06 };
  const winTopRight = { x: w * 0.14, y: h * 0.12 };
  const winBotLeft = { x: w * 0.02, y: h * 0.88 };
  const winBotRight = { x: w * 0.14, y: h * 0.58 };

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(winTopLeft.x, winTopLeft.y);
  ctx.lineTo(winTopRight.x, winTopRight.y);
  ctx.lineTo(winBotRight.x, winBotRight.y);
  ctx.lineTo(winBotLeft.x, winBotLeft.y);
  ctx.closePath();
  ctx.clip();

  // Outside Sky
  const skyGrad = ctx.createLinearGradient(0, winTopLeft.y, 0, winBotLeft.y);
  if (selections.lightingMode === "night") {
    skyGrad.addColorStop(0, "#080c18");
    skyGrad.addColorStop(1, "#141d33");
  } else if (selections.lightingMode === "golden") {
    skyGrad.addColorStop(0, "#ff8450");
    skyGrad.addColorStop(0.6, "#ffbe76");
    skyGrad.addColorStop(1, "#dff9fb");
  } else {
    skyGrad.addColorStop(0, "#74b9ff");
    skyGrad.addColorStop(0.8, "#c7ecee");
    skyGrad.addColorStop(1, "#f5f6fa");
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w * 0.3, h);

  // Landscape silhouette in window
  ctx.fillStyle = selections.lightingMode === "night" ? "#04070e" : "#2d3436";
  ctx.beginPath();
  ctx.arc(winBotLeft.x + 30, winBotRight.y + 20, 48, Math.PI, 0);
  ctx.arc(winBotRight.x - 10, winBotRight.y + 30, 40, Math.PI, 0);
  ctx.fill();

  ctx.restore();

  // Window frame & mullions
  ctx.strokeStyle = "#1b1f2b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(winTopLeft.x, winTopLeft.y);
  ctx.lineTo(winTopRight.x, winTopRight.y);
  ctx.lineTo(winBotRight.x, winBotRight.y);
  ctx.lineTo(winBotLeft.x, winBotLeft.y);
  ctx.closePath();
  ctx.stroke();

  // Window crossbar
  const midTop = { x: (winTopLeft.x + winTopRight.x) / 2, y: (winTopLeft.y + winTopRight.y) / 2 };
  const midBot = { x: (winBotLeft.x + winBotRight.x) / 2, y: (winBotLeft.y + winBotRight.y) / 2 };
  ctx.beginPath();
  ctx.moveTo(midTop.x, midTop.y);
  ctx.lineTo(midBot.x, midBot.y);
  ctx.stroke();

  // Sheer Curtains
  ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
  ctx.fillRect(winTopLeft.x - 3, winTopLeft.y, 12, winBotLeft.y - winTopLeft.y + 10);
  ctx.fillRect(winTopRight.x - 8, winTopRight.y, 14, winBotRight.y - winTopRight.y + 10);

  // Light Spill across floor
  ctx.fillStyle = selections.lightingMode === "golden" 
    ? "rgba(255, 175, 75, 0.12)" 
    : (selections.lightingMode === "night" ? "rgba(90, 140, 255, 0.04)" : "rgba(255, 255, 255, 0.09)");
  ctx.beginPath();
  ctx.moveTo(winBotRight.x, winBotRight.y);
  ctx.lineTo(winBotLeft.x, winBotLeft.y);
  ctx.lineTo(w * 0.40, h);
  ctx.lineTo(w * 0.52, h);
  ctx.closePath();
  ctx.fill();

  // 3. Back Wall
  const backWallGrad = ctx.createLinearGradient(0, bwY, 0, floorY);
  backWallGrad.addColorStop(0, wallCol);
  backWallGrad.addColorStop(1, adjustBrightness(wallCol, -8));
  ctx.fillStyle = backWallGrad;
  ctx.fillRect(bwX, bwY, bwW, bwH);

  // Baseboard along back wall
  ctx.fillStyle = selections.accentWoodColor || "#8E5A3C";
  ctx.fillRect(bwX, floorY - 6, bwW, 6);

  // 4. Floor Plane
  const floorCol = selections.floorColor || "#CBB69D";
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(bwX, floorY);
  ctx.lineTo(bwX + bwW, floorY);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.clip();

  // Floor Base Fill
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
  floorGrad.addColorStop(0, adjustBrightness(floorCol, -12));
  floorGrad.addColorStop(1, floorCol);
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, h - floorY);

  // Perspective Wood Planks
  ctx.strokeStyle = "rgba(0, 0, 0, 0.10)";
  ctx.lineWidth = 1;
  const plankSpacing = 30;
  for (let px = -w * 0.4; px <= w * 1.4; px += plankSpacing) {
    ctx.beginPath();
    ctx.moveTo(vp.x, vp.y);
    ctx.lineTo(px, h);
    ctx.stroke();
  }

  // Staggered cross seams
  for (let k = 1; k <= 7; k++) {
    const py = floorY + (h - floorY) * Math.pow(k / 7.2, 1.7);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(w, py);
    ctx.stroke();
  }
  ctx.restore();

  // Baseboard on left wall bottom
  ctx.strokeStyle = selections.accentWoodColor || "#8E5A3C";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(bwX, floorY);
  ctx.stroke();

  // --- ROOM-SPECIFIC FURNITURE & ARCHITECTURAL ELEMENTS ---
  const woodCol = selections.accentWoodColor || "#8E5A3C";
  const fabricCol = selections.sofaColor || "#D7CFC7";
  const accentCol = selections.accentColor || "#CBB17C";

  if (roomType === "bedroom") {
    // 1. Full-Height Fluted Headboard Wall
    const hbX = bwX + bwW * 0.16;
    const hbW = bwW * 0.68;
    const hbY = bwY + 6;
    const hbH = floorY - hbY;

    // LED Backlight Halo
    ctx.fillStyle = selections.lightingMode === "night" ? "rgba(255, 190, 110, 0.7)" : "rgba(255, 225, 150, 0.45)";
    ctx.fillRect(hbX - 8, hbY - 6, hbW + 16, 12);

    // Fluted Wood Slats
    const slatW = 8;
    for (let sx = hbX; sx < hbX + hbW; sx += slatW) {
      ctx.fillStyle = woodCol;
      ctx.fillRect(sx, hbY, slatW - 2, hbH);
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.fillRect(sx + slatW - 2, hbY, 2, hbH);
    }

    // 2. King Platform Bed Suite
    const bedW = bwW * 0.50;
    const bedX = bwX + (bwW - bedW) / 2;
    const bedTopY = floorY - 65;
    const bedBotY = h - 115;
    const bedH = bedBotY - bedTopY;

    // Floating Nightstands (Left & Right)
    const nsLX = bedX - 48, nsLY = floorY - 60, nsW = 38, nsH = 44;
    const nsRX = bedX + bedW + 10, nsRY = floorY - 60, nsW2 = 38, nsH2 = 44;

    ctx.fillStyle = adjustBrightness(woodCol, -12);
    ctx.fillRect(nsLX, nsLY, nsW, nsH);
    ctx.fillRect(nsRX, nsRY, nsW2, nsH2);

    // Nightstand Drop Shadows
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(nsLX, floorY - 2, nsW, 4);
    ctx.fillRect(nsRX, floorY - 2, nsW2, 4);

    // Glowing Bedside Glass Orbs
    ctx.fillStyle = "rgba(255, 245, 220, 0.95)";
    ctx.beginPath();
    ctx.arc(nsLX + 19, nsLY - 16, 11, 0, Math.PI * 2);
    ctx.arc(nsRX + 19, nsRY - 16, 11, 0, Math.PI * 2);
    ctx.fill();

    // Halo glow
    ctx.fillStyle = "rgba(255, 215, 130, 0.35)";
    ctx.beginPath();
    ctx.arc(nsLX + 19, nsLY - 16, 24, 0, Math.PI * 2);
    ctx.arc(nsRX + 19, nsRY - 16, 24, 0, Math.PI * 2);
    ctx.fill();

    // Large Bedroom Area Rug under bed
    const rugX1 = bedX - 35, rugY1 = floorY - 6, rugW1 = bedW + 70;
    const rugX2 = bedX - 55, rugY2 = h - 25, rugW2 = bedW + 110;
    ctx.fillStyle = "rgba(228, 222, 212, 0.92)";
    ctx.beginPath();
    ctx.moveTo(rugX1, rugY1);
    ctx.lineTo(rugX1 + rugW1, rugY1);
    ctx.lineTo(rugX2 + rugW2, rugY2);
    ctx.lineTo(rugX2, rugY2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.stroke();

    // Bed Platform Base
    ctx.fillStyle = adjustBrightness(woodCol, -15);
    ctx.fillRect(bedX - 4, bedBotY - 14, bedW + 8, 16);

    // Mattress Edge
    ctx.fillStyle = "#faf8f5";
    ctx.fillRect(bedX, bedTopY + 18, bedW, 22);

    // Propped Sleeping Pillows
    const pW = (bedW - 36) / 2;
    // White Euro Shams behind
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bedX + 8, bedTopY - 16, pW, 32);
    ctx.fillRect(bedX + 8 + pW + 20, bedTopY - 16, pW, 32);

    // Front Accent Pillows (Fabric Color)
    ctx.fillStyle = fabricCol;
    ctx.fillRect(bedX + 16, bedTopY - 2, pW - 16, 26);
    ctx.fillRect(bedX + 16 + pW + 20, bedTopY - 2, pW - 16, 26);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
    ctx.strokeRect(bedX + 16, bedTopY - 2, pW - 16, 26);
    ctx.strokeRect(bedX + 16 + pW + 20, bedTopY - 2, pW - 16, 26);

    // Luxury Duvet / Bedspread (Takes chosen fabric color!)
    const duvetGrad = ctx.createLinearGradient(0, bedTopY + 28, 0, bedBotY - 14);
    duvetGrad.addColorStop(0, fabricCol);
    duvetGrad.addColorStop(1, adjustBrightness(fabricCol, -15));

    ctx.fillStyle = duvetGrad;
    ctx.beginPath();
    ctx.roundRect(bedX - 2, bedTopY + 28, bedW + 4, bedH - 42, [8, 8, 4, 4]);
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Crisp white sheet turnover at top of duvet
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bedX - 2, bedTopY + 26, bedW + 4, 9);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.strokeRect(bedX - 2, bedTopY + 26, bedW + 4, 9);

    // Folded Bed Throw Blanket at Foot (Accent Wood color)
    ctx.fillStyle = adjustBrightness(woodCol, 10);
    ctx.fillRect(bedX - 3, bedBotY - 44, bedW + 6, 24);
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.strokeRect(bedX - 3, bedBotY - 44, bedW + 6, 24);

    // End-of-Bed Bench
    const benchW = bedW * 0.72;
    const benchX = bedX + (bedW - benchW) / 2;
    const benchY = bedBotY + 6;
    ctx.fillStyle = fabricCol;
    ctx.fillRect(benchX, benchY, benchW, 14);
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 2;
    ctx.strokeRect(benchX, benchY, benchW, 14);

    // Bench brass legs
    ctx.fillStyle = accentCol;
    ctx.fillRect(benchX + 6, benchY + 14, 4, 10);
    ctx.fillRect(benchX + benchW - 10, benchY + 14, 4, 10);

  } else if (roomType === "kitchen") {
    // 1. Full-Height Cabinet Millwork Wall
    const cabCol = woodCol;
    const wallH = floorY - bwY;

    ctx.fillStyle = cabCol;
    ctx.fillRect(bwX, bwY, bwW, wallH);

    // Cabinet Panel Dividers
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.5;
    const colW = bwW / 8;
    for (let c = 1; c < 8; c++) {
      ctx.beginPath();
      ctx.moveTo(bwX + c * colW, bwY);
      ctx.lineTo(bwX + c * colW, floorY);
      ctx.stroke();
    }
    // Horizontal shelf reveal
    ctx.beginPath();
    ctx.moveTo(bwX, bwY + wallH * 0.42);
    ctx.lineTo(bwX + bwW, bwY + wallH * 0.42);
    ctx.stroke();

    // Recessed Prep Backsplash Niche
    const nicheX = bwX + bwW * 0.20;
    const nicheW = bwW * 0.58;
    const nicheY = bwY + wallH * 0.25;
    const nicheH = wallH * 0.42;

    ctx.fillStyle = "#f6f4ee";
    ctx.fillRect(nicheX, nicheY, nicheW, nicheH);
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 1;
    ctx.strokeRect(nicheX, nicheY, nicheW, nicheH);

    // Under-Cabinet LED Strip Task Glow
    ctx.fillStyle = "rgba(255, 240, 180, 0.65)";
    ctx.fillRect(nicheX, nicheY, nicheW, 6);

    // Double Black Glass Wall Ovens on Right
    const ovenX = bwX + bwW * 0.82;
    const ovenW = bwW * 0.14;
    const ovenY = bwY + wallH * 0.22;
    ctx.fillStyle = "#111215";
    ctx.fillRect(ovenX, ovenY, ovenW, wallH * 0.50);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.strokeRect(ovenX, ovenY, ovenW, wallH * 0.50);
    // Oven displays
    ctx.fillStyle = "#00e5ff";
    ctx.fillRect(ovenX + 10, ovenY + 12, 18, 4);

    // 2. Central Waterfall Kitchen Island
    const islW = bwW * 0.68;
    const islX = bwX + (bwW - islW) / 2;
    const islTopY = floorY - 12;
    const islH = 105;
    const islBotY = islTopY + islH;

    // Island Base Cabinetry Face
    ctx.fillStyle = cabCol;
    ctx.fillRect(islX + 14, islTopY + 14, islW - 28, islH - 14);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.strokeRect(islX + 14, islTopY + 14, islW - 28, islH - 14);

    // Waterfall Quartz Countertop (Top Slab + Left/Right Waterfall sides)
    ctx.fillStyle = "#fdfbfa";
    ctx.fillRect(islX, islTopY, islW, 14);

    // Left Waterfall End
    ctx.fillStyle = "#eae6df";
    ctx.fillRect(islX, islTopY, 14, islH);
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(islX, islTopY, 14, islH);

    // Right Waterfall End
    ctx.fillStyle = "#dcd7cf";
    ctx.fillRect(islX + islW - 14, islTopY, 14, islH);
    ctx.strokeRect(islX + islW - 14, islTopY, 14, islH);

    // Top slab trim outline
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 2;
    ctx.strokeRect(islX, islTopY, islW, 14);

    // Undermount Sink & Tall Brass Gooseneck Faucet
    const sinkX = islX + islW * 0.25;
    ctx.fillStyle = "#1e2024";
    ctx.fillRect(sinkX, islTopY + 3, 44, 8);

    // Brass Faucet
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sinkX + 22, islTopY + 3);
    ctx.lineTo(sinkX + 22, islTopY - 24);
    ctx.arc(sinkX + 15, islTopY - 24, 7, 0, Math.PI, true);
    ctx.stroke();

    // 3. Trio of Modern Bar Stools (Taking Upholstery / Leather Color)
    const stoolCol = fabricCol;
    const stoolSpacing = islW / 4;
    for (let s = 1; s <= 3; s++) {
      const stX = islX + s * stoolSpacing;
      const stY = islBotY + 8;

      // Drop shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.beginPath();
      ctx.ellipse(stX, stY + 36, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Slender metal legs
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(stX - 12, stY + 6);
      ctx.lineTo(stX - 14, stY + 36);
      ctx.moveTo(stX + 12, stY + 6);
      ctx.lineTo(stX + 14, stY + 36);
      // Footrest rail
      ctx.moveTo(stX - 13, stY + 24);
      ctx.lineTo(stX + 13, stY + 24);
      ctx.stroke();

      // Padded Seat Cushion
      ctx.fillStyle = stoolCol;
      ctx.beginPath();
      ctx.roundRect(stX - 15, stY - 4, 30, 10, [4, 4, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      ctx.stroke();

      // Low Backrest
      ctx.fillStyle = stoolCol;
      ctx.fillRect(stX - 12, stY - 18, 24, 10);
      ctx.strokeRect(stX - 12, stY - 18, 24, 10);
    }

    // Overhead Linear Brass LED Chandelier
    ctx.fillStyle = accentCol;
    ctx.fillRect(islX + 30, bwY + 26, islW - 60, 5);
    ctx.fillStyle = "rgba(255, 245, 215, 0.9)";
    ctx.fillRect(islX + 35, bwY + 31, islW - 70, 3);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(islX + 60, 0);
    ctx.lineTo(islX + 60, bwY + 26);
    ctx.moveTo(islX + islW - 60, 0);
    ctx.lineTo(islX + islW - 60, bwY + 26);
    ctx.stroke();

  } else {
    // Living Room (Default)
    // 1. Acoustic Fluted Wood Slat Wall on Right Side
    const slatStartX = bwX + bwW * 0.54;
    const slatEndX = bwX + bwW;
    for (let sx = slatStartX; sx < slatEndX; sx += 9) {
      ctx.fillStyle = woodCol;
      ctx.fillRect(sx, bwY, 7, floorY - bwY);
      ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
      ctx.fillRect(sx + 7, bwY, 2, floorY - bwY);
    }

    // 2. Large Gallery Abstract Art on Left
    const artX = bwX + bwW * 0.08;
    const artY = bwY + 22;
    const artW = bwW * 0.38;
    const artH = (floorY - bwY) * 0.65;

    ctx.fillStyle = "#faf7f2";
    ctx.fillRect(artX, artY, artW, artH);
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 3;
    ctx.strokeRect(artX, artY, artW, artH);

    // Abstract strokes
    ctx.fillStyle = "rgba(142, 90, 60, 0.4)";
    ctx.beginPath();
    ctx.arc(artX + artW * 0.45, artY + artH * 0.45, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = selections.wallColor || "#F0ECE1";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(artX + 16, artY + artH - 20);
    ctx.lineTo(artX + artW - 16, artY + 24);
    ctx.stroke();

    // 3. Hand-Knotted Textured Area Rug
    const rugX1 = w * 0.18, rugY1 = floorY - 5, rugW1 = w * 0.66;
    const rugX2 = w * 0.08, rugY2 = h - 20, rugW2 = w * 0.84;
    ctx.fillStyle = "rgba(235, 230, 222, 0.92)";
    ctx.beginPath();
    ctx.moveTo(rugX1, rugY1);
    ctx.lineTo(rugX1 + rugW1, rugY1);
    ctx.lineTo(rugX2 + rugW2, rugY2);
    ctx.lineTo(rugX2, rugY2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.stroke();

    // 4. Sectional Lounge Sofa
    const sofaCol = fabricCol;
    const sofaX = w * 0.20;
    const sofaY = floorY - 10;
    const sofaW = w * 0.54;
    const sofaH = 105;

    // Sofa Wood Plinth Base
    ctx.fillStyle = woodCol;
    ctx.fillRect(sofaX, sofaY + sofaH - 12, sofaW, 14);

    // Main Seating Blocks
    const seatW = sofaW / 3;
    for (let i = 0; i < 3; i++) {
      const grad = ctx.createLinearGradient(0, sofaY, 0, sofaY + sofaH);
      grad.addColorStop(0, sofaCol);
      grad.addColorStop(1, adjustBrightness(sofaCol, -14));

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(sofaX + i * seatW + 2, sofaY, seatW - 4, sofaH - 14, [6, 6, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
      ctx.stroke();
    }

    // Plush Backrest
    ctx.fillStyle = sofaCol;
    ctx.fillRect(sofaX, sofaY - 24, sofaW, 24);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.strokeRect(sofaX, sofaY - 24, sofaW, 24);

    // Right Chaise Extension
    const chaiseX = sofaX + sofaW - 20;
    const chaiseW = w * 0.16;
    ctx.fillStyle = adjustBrightness(sofaCol, -5);
    ctx.fillRect(chaiseX, sofaY + 10, chaiseW, sofaH + 16);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
    ctx.strokeRect(chaiseX, sofaY + 10, chaiseW, sofaH + 16);

    // Accent Pillows
    ctx.fillStyle = woodCol;
    ctx.fillRect(sofaX + 16, sofaY - 12, 26, 20);
    ctx.fillStyle = accentCol;
    ctx.fillRect(chaiseX + 8, sofaY + 16, 24, 20);

    // 5. Sculptural Coffee Table (Calacatta Top & Brass Base)
    const tableX = w * 0.44;
    const tableY = sofaY + sofaH + 8;
    const tableR = Math.min(w, h) * 0.08;

    // Table shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(tableX, tableY + 5, tableR, tableR * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Table Top Marble Slab
    ctx.fillStyle = "#faf7f2";
    ctx.beginPath();
    ctx.ellipse(tableX, tableY, tableR, tableR * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Hardcover Book on Table
    ctx.fillStyle = "#1e2229";
    ctx.fillRect(tableX - 14, tableY - 6, 22, 10);
    ctx.fillStyle = accentCol;
    ctx.fillRect(tableX - 12, tableY - 4, 7, 7);

    // 6. Arc Floor Lamp
    ctx.strokeStyle = "#1e2025";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bwX + 25, floorY + 30);
    ctx.bezierCurveTo(bwX + 10, bwY - 10, w * 0.32, bwY - 20, w * 0.35, sofaY - 30);
    ctx.stroke();

    // Glowing Lamp Diffuser
    ctx.fillStyle = "rgba(255, 235, 180, 0.95)";
    ctx.beginPath();
    ctx.arc(w * 0.35, sofaY - 30, 11, 0, Math.PI, true);
    ctx.fill();
  }

  // Atmospheric Lighting Wash Tint
  if (selections.lightingMode === "golden") {
    ctx.fillStyle = "rgba(255, 165, 60, 0.12)";
    ctx.fillRect(0, 0, w, h);
  } else if (selections.lightingMode === "night") {
    ctx.fillStyle = "rgba(10, 18, 40, 0.35)";
    ctx.fillRect(0, 0, w, h);
  }
}

function drawIsometricView(ctx, w, h, roomType, selections) {
  const cx = w * 0.5;
  const cy = h * 0.52;
  const isoW = Math.min(w * 0.38, 280);
  const isoH = isoW * 0.58;

  // Background Grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }

  // Isometric Diamond Floor
  const floorCol = selections.floorColor || "#CBB69D";
  ctx.fillStyle = floorCol;
  ctx.beginPath();
  ctx.moveTo(cx, cy - isoH);
  ctx.lineTo(cx + isoW, cy);
  ctx.lineTo(cx, cy + isoH);
  ctx.lineTo(cx - isoW, cy);
  ctx.closePath();
  ctx.fill();

  // Floor grid planks
  ctx.strokeStyle = "rgba(0,0,0,0.14)";
  for (let d = -3; d <= 3; d++) {
    const shift = d * (isoW / 4);
    ctx.beginPath();
    ctx.moveTo(cx + shift, cy - isoH + Math.abs(shift)*0.58);
    ctx.lineTo(cx + shift, cy + isoH - Math.abs(shift)*0.58);
    ctx.stroke();
  }

  // Left Wall Cutaway
  const wallCol = selections.wallColor || "#F0ECE1";
  const wallH = 140;
  ctx.fillStyle = adjustBrightness(wallCol, -12);
  ctx.beginPath();
  ctx.moveTo(cx - isoW, cy);
  ctx.lineTo(cx, cy - isoH);
  ctx.lineTo(cx, cy - isoH - wallH);
  ctx.lineTo(cx - isoW, cy - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.stroke();

  // Right Wall Cutaway
  ctx.fillStyle = wallCol;
  ctx.beginPath();
  ctx.moveTo(cx, cy - isoH);
  ctx.lineTo(cx + isoW, cy);
  ctx.lineTo(cx + isoW, cy - wallH);
  ctx.lineTo(cx, cy - isoH - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Room Isometric Furniture Block
  const sofaCol = selections.sofaColor || "#D7CFC7";
  const woodCol = selections.accentWoodColor || "#8E5A3C";

  if (roomType === "bedroom") {
    // 3D Isometric King Bed
    const bx = cx - 40, by = cy - 20;
    // Bed Base
    ctx.fillStyle = woodCol;
    ctx.fillRect(bx, by, 90, 55);
    // Bed Duvet
    ctx.fillStyle = sofaCol;
    ctx.fillRect(bx + 6, by + 12, 78, 40);
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.strokeRect(bx + 6, by + 12, 78, 40);
    // Pillows
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bx + 10, by + 2, 32, 12);
    ctx.fillRect(bx + 48, by + 2, 32, 12);
  } else if (roomType === "kitchen") {
    // 3D Isometric Island
    const ix = cx - 55, iy = cy - 10;
    ctx.fillStyle = woodCol;
    ctx.fillRect(ix, iy, 110, 48);
    // Waterfall Quartz Slab
    ctx.fillStyle = "#faf8f4";
    ctx.fillRect(ix - 4, iy - 6, 118, 10);
    ctx.strokeStyle = selections.accentColor || "#CBB17C";
    ctx.lineWidth = 2;
    ctx.strokeRect(ix - 4, iy - 6, 118, 10);
  } else {
    // 3D Isometric Sofa
    const sx = cx - 60, sy = cy - 20;
    ctx.fillStyle = sofaCol;
    ctx.fillRect(sx, sy, 120, 45);
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.strokeRect(sx, sy, 120, 45);
    // Coffee Table
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy + 30, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = selections.accentColor || "#CBB17C";
    ctx.stroke();
  }

  // Label
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Axonometric 3D Cutaway Studio", 24, 34);
}

// 3. Architectural Blueprint Floorplan View
function drawBlueprintView(ctx, w, h, roomType, selections) {
  // Blueprint Grid Background
  ctx.fillStyle = "#0c1220";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(0, 180, 255, 0.08)";
  ctx.lineWidth = 1;
  const grid = 24;
  for (let x = 0; x < w; x += grid) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += grid) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  const rx = w * 0.15, ry = h * 0.14;
  const rw = w * 0.70, rh = h * 0.72;

  // Floor Fill
  ctx.fillStyle = selections.floorColor || "#CBB69D";
  ctx.fillRect(rx, ry, rw, rh);

  // Floor Hatching
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  for (let x = rx; x < rx + rw; x += 22) {
    ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x, ry + rh); ctx.stroke();
  }

  // Outer Walls with Architectural Thickness
  ctx.strokeStyle = selections.wallColor || "#F0ECE1";
  ctx.lineWidth = 14;
  ctx.strokeRect(rx, ry, rw, rh);

  // Door Swing Arc in bottom-left
  ctx.strokeStyle = "#4da3ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(rx, ry + rh, 50, -Math.PI / 2, 0, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rx, ry + rh);
  ctx.lineTo(rx + 50, ry + rh);
  ctx.stroke();

  // Furniture Layout
  const sofaCol = selections.sofaColor || "#D7CFC7";
  const woodCol = selections.accentWoodColor || "#8E5A3C";

  if (roomType === "bedroom") {
    // Bed Headboard
    ctx.fillStyle = woodCol;
    ctx.fillRect(rx + rw * 0.28, ry + 8, rw * 0.44, 20);

    // Bed
    ctx.fillStyle = sofaCol;
    ctx.fillRect(rx + rw * 0.30, ry + 28, rw * 0.40, rh * 0.54);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rx + rw * 0.30, ry + 28, rw * 0.40, rh * 0.54);

    // Bed Text
    ctx.fillStyle = "#111";
    ctx.font = "bold 11px monospace";
    ctx.fillText("KING BED 76\" x 80\"", rx + rw * 0.34, ry + rh * 0.32);

    // Nightstands
    ctx.fillStyle = woodCol;
    ctx.fillRect(rx + rw * 0.20, ry + 12, 34, 38);
    ctx.fillRect(rx + rw * 0.72, ry + 12, 34, 38);

  } else if (roomType === "kitchen") {
    // Rear Cabinets
    ctx.fillStyle = woodCol;
    ctx.fillRect(rx + 8, ry + 8, rw - 16, 42);

    // Island
    ctx.fillStyle = "#faf8f4";
    ctx.fillRect(rx + rw * 0.22, ry + rh * 0.42, rw * 0.56, rh * 0.32);
    ctx.strokeStyle = selections.accentColor || "#CBB17C";
    ctx.lineWidth = 3;
    ctx.strokeRect(rx + rw * 0.22, ry + rh * 0.42, rw * 0.56, rh * 0.32);

    ctx.fillStyle = "#111";
    ctx.font = "bold 11px monospace";
    ctx.fillText("WATERFALL ISLAND 96\" x 42\"", rx + rw * 0.30, ry + rh * 0.58);

  } else {
    // Sectional Sofa
    ctx.fillStyle = sofaCol;
    ctx.fillRect(rx + rw * 0.18, ry + rh * 0.18, rw * 0.60, rh * 0.34);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rx + rw * 0.18, ry + rh * 0.18, rw * 0.60, rh * 0.34);

    // Coffee table
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(rx + rw * 0.48, ry + rh * 0.68, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = selections.accentColor || "#CBB17C";
    ctx.stroke();

    ctx.fillStyle = "#111";
    ctx.font = "bold 11px monospace";
    ctx.fillText("MODULAR SECTIONAL", rx + rw * 0.32, ry + rh * 0.36);
  }

  // Dimension lines
  ctx.strokeStyle = "#4da3ff";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#4da3ff";
  ctx.font = "11px monospace";
  ctx.fillText("<--- 18'-6\" --->", rx + rw * 0.38, ry - 14);
  ctx.fillText("<--- 14'-2\" --->", rx - 65, ry + rh * 0.52);
}

// --- PHOTO HOTSPOTS OVERLAY ---
function renderPhotoHotspots(activeConcept, selections) {
  const container = document.getElementById("photoHotspotsContainer");
  const tint = document.getElementById("photoTintOverlay");
  if (!container) return;

  if (tint) {
    if (selections.lightingMode === "golden") {
      tint.style.background = selections.accentColor || "#CBB17C";
      tint.style.opacity = "0.22";
    } else if (selections.lightingMode === "night") {
      tint.style.background = "#141e30";
      tint.style.opacity = "0.36";
    } else {
      tint.style.background = selections.wallColor || "#F0ECE1";
      tint.style.opacity = "0.14";
    }
  }

  container.innerHTML = "";
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  const roomType = getRoomType(currentRoom);

  const pinConfigs = {
    living: [
      { top: "28%", left: "32%", cat: "Wall", color: selections.wallColor, label: "Wall Paint" },
      { top: "66%", left: "48%", cat: "Upholstery", color: selections.sofaColor, label: "Sofa Fabric" },
      { top: "86%", left: "70%", cat: "Floor", color: selections.floorColor, label: "Oak Floor" },
      { top: "74%", left: "28%", cat: "Metal", color: selections.accentColor, label: "Brass Table" },
      { top: "36%", left: "78%", cat: "Wood", color: selections.accentWoodColor, label: "Fluted Slats" }
    ],
    bedroom: [
      { top: "34%", left: "50%", cat: "Wood", color: selections.accentWoodColor, label: "Fluted Headboard" },
      { top: "64%", left: "46%", cat: "Fabric", color: selections.sofaColor, label: "Belgian Linen" },
      { top: "26%", left: "20%", cat: "Wall", color: selections.wallColor, label: "Limewash Wall" },
      { top: "86%", left: "25%", cat: "Floor", color: selections.floorColor, label: "Oak Planks" },
      { top: "62%", left: "80%", cat: "Metal", color: selections.accentColor, label: "Brass Sconce" }
    ],
    kitchen: [
      { top: "58%", left: "45%", cat: "Stone", color: selections.accentColor, label: "Waterfall Quartz" },
      { top: "32%", left: "72%", cat: "Cabinet", color: selections.accentWoodColor, label: "Millwork Wall" },
      { top: "74%", left: "28%", cat: "Fabric", color: selections.sofaColor, label: "Barstool Leather" },
      { top: "38%", left: "36%", cat: "Metal", color: selections.accentColor, label: "Brass Pendant" },
      { top: "88%", left: "68%", cat: "Floor", color: selections.floorColor, label: "Micro-Cement" }
    ]
  };

  const pins = pinConfigs[roomType] || pinConfigs.living;
  pins.forEach(pin => {
    const el = document.createElement("div");
    el.className = "photo-hotspot-pin";
    el.style.top = pin.top;
    el.style.left = pin.left;
    el.title = `Click to inspect ${pin.label} specification`;

    el.innerHTML = `
      <span class="photo-hotspot-dot" style="background: ${pin.color};"></span>
      <span>${pin.label}</span>
    `;

    el.onclick = (e) => {
      e.stopPropagation();
      const mat = (activeConcept.materials || []).find(m => 
        m.category.toLowerCase().includes(pin.cat.toLowerCase())
      );
      if (mat) {
        openMaterialModal(mat);
      }
    };

    container.appendChild(el);
  });
}

// --- VIEWPORT MODES & SUB-TABS ---
function switchViewportMode(mode) {
  state.viewportMode = mode;
  const is3D = mode === "3d";

  const btn3D = document.getElementById("btnView3D");
  const btnPhoto = document.getElementById("btnViewPhoto");
  const threeWrap = document.getElementById("three-canvas-container");
  const photoWrap = document.getElementById("photoRenderWrap");
  const controls3D = document.getElementById("viewport3DControls");
  const controls2D = document.getElementById("viewport2DControls");
  const hint = document.getElementById("viewport3DHint");
  const gallery = document.getElementById("anglesGallery");

  if (btn3D) btn3D.classList.toggle("active", is3D);
  if (btnPhoto) btnPhoto.classList.toggle("active", !is3D);

  if (threeWrap) threeWrap.style.display = is3D ? "block" : "none";
  if (photoWrap) photoWrap.style.display = is3D ? "none" : "block";
  if (controls3D) controls3D.style.display = is3D ? "flex" : "none";
  if (controls2D) controls2D.style.display = is3D ? "none" : "flex";
  if (gallery) gallery.style.display = is3D ? "none" : "flex";

  if (hint) {
    hint.innerText = is3D
      ? "✨ Rotate & pan with mouse. Click any material swatch below to customize the 3D model in real time!"
      : "🎨 Live 2D Architectural Studio. Click swatches below to customize walls, flooring, millwork & fabrics!";
  }

  if (is3D) {
    if (viewer) {
      setTimeout(() => {
        viewer.onResize();
        sync3DViewerMaterials();
      }, 50);
    }
  } else {
    switch2DSubTab(state.view2DSubMode || "canvas");
  }

  saveData(state);
}

function switch2DSubTab(subMode) {
  state.view2DSubMode = subMode;
  const isCanvas = subMode === "canvas";

  const btnCanvas = document.getElementById("btn2DCanvasTab");
  const btnPhoto = document.getElementById("btn2DPhotoTab");
  const canvasWrap = document.getElementById("view2DCanvasWrap");
  const photoWrap = document.getElementById("view2DPhotoWrap");
  const anglesGroup = document.getElementById("group2DAngles");
  const anglesDivider = document.getElementById("divider2DAngles");

  if (btnCanvas) btnCanvas.classList.toggle("active", isCanvas);
  if (btnPhoto) btnPhoto.classList.toggle("active", !isCanvas);

  if (canvasWrap) canvasWrap.style.display = isCanvas ? "block" : "none";
  if (photoWrap) photoWrap.style.display = isCanvas ? "none" : "block";

  if (anglesGroup) anglesGroup.style.display = isCanvas ? "flex" : "none";
  if (anglesDivider) anglesDivider.style.display = isCanvas ? "block" : "none";

  sync3DViewerMaterials();
  saveData(state);

  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  if (currentRoom) {
    const activeConcept = currentRoom.concepts[state.activeConceptIndex] || currentRoom.concepts[0];
    renderAnglesGallery(activeConcept);
  }
}

function set2DAngle(angle) {
  state.view2DAngle = angle;

  ["btn2DAnglePersp", "btn2DAngleIso", "btn2DAngleTop"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  const activeBtn = document.getElementById(
    angle === "perspective" ? "btn2DAnglePersp" : (angle === "isometric" ? "btn2DAngleIso" : "btn2DAngleTop")
  );
  if (activeBtn) activeBtn.classList.add("active");

  sync3DViewerMaterials();
  saveData(state);

  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  if (currentRoom) {
    const activeConcept = currentRoom.concepts[state.activeConceptIndex] || currentRoom.concepts[0];
    renderAnglesGallery(activeConcept);
  }
}

function setViewerCamera(camType) {
  if (viewer) viewer.setCameraView(camType);

  ["btnCamPersp", "btnCamIso", "btnCamTop"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  const btn = document.getElementById(
    camType === "perspective" ? "btnCamPersp" : camType === "isometric" ? "btnCamIso" : "btnCamTop"
  );
  if (btn) btn.classList.add("active");
}

function setViewerLighting(mode) {
  state.currentLightingMode = mode;
  if (viewer) viewer.setLightingMode(mode);

  // Sync 3D buttons
  ["btnLightDay", "btnLightGolden", "btnLightNight"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
  const active3D = document.getElementById(
    mode === "day" ? "btnLightDay" : mode === "golden" ? "btnLightGolden" : "btnLightNight"
  );
  if (active3D) active3D.classList.add("active");

  // Sync 2D buttons
  ["btn2DLightDay", "btn2DLightGolden", "btn2DLightNight"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
  const active2D = document.getElementById(
    mode === "day" ? "btn2DLightDay" : mode === "golden" ? "btn2DLightGolden" : "btn2DLightNight"
  );
  if (active2D) active2D.classList.add("active");

  sync3DViewerMaterials();
  saveData(state);
}

function renderApp() {
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId) || state.rooms[0];
  const activeConcept = currentRoom.concepts[state.activeConceptIndex] || currentRoom.concepts[0];

  // 1. Header
  document.getElementById("projectName").innerText = state.projectName;

  // 2. Budget Banner
  const totalCost = calculateProjectTotal();
  const targetBudget = state.targetBudget;
  const approvedCount = state.rooms.filter(r => r.status === "approved").length;
  const pendingCount = state.rooms.filter(r => r.status === "under_review" || r.status === "changes_requested").length;

  document.getElementById("statsTotalSpaces").innerText = `${state.rooms.length} Spaces`;
  document.getElementById("statsApprovalRatio").innerText = `${approvedCount} of ${state.rooms.length} Approved`;
  document.getElementById("statsPendingReview").innerText = `${pendingCount} In Review`;
  document.getElementById("statsTotalCost").innerText = `$${totalCost.toLocaleString()}`;
  document.getElementById("statsTargetBudget").innerText = `of $${targetBudget.toLocaleString()} Target`;

  const budgetRatio = Math.min((totalCost / targetBudget) * 100, 100);
  const budgetBar = document.getElementById("statsBudgetBar");
  const budgetStatus = document.getElementById("statsBudgetStatus");

  if (budgetBar && budgetStatus) {
    budgetBar.style.width = `${budgetRatio}%`;
    if (totalCost > targetBudget) {
      budgetBar.style.background = "var(--status-changes)";
      budgetStatus.innerText = "Over Target";
      budgetStatus.style.background = "var(--status-changes-bg)";
      budgetStatus.style.color = "var(--status-changes)";
    } else {
      budgetBar.style.background = "linear-gradient(90deg, var(--status-approved), var(--accent-gold))";
      budgetStatus.innerText = "Within Budget";
      budgetStatus.style.background = "var(--status-approved-bg)";
      budgetStatus.style.color = "var(--status-approved)";
    }
  }

  // 3. Room Navigation List
  renderRoomList();

  // 4. Room Header & Meta
  document.getElementById("currentRoomTitle").innerText = currentRoom.name;
  document.getElementById("currentRoomDesc").innerText = currentRoom.description;

  const roomBadge = document.getElementById("currentRoomStatusBadge");
  roomBadge.className = `status-badge badge-${currentRoom.status}`;
  roomBadge.innerText = formatStatus(currentRoom.status);

  // 5. Concept Options
  renderConceptOptions(currentRoom);

  // 6. Viewport Renders
  document.getElementById("activeRenderImg").src = activeConcept.image;
  document.getElementById("renderConceptBadge").innerText = activeConcept.name;
  document.getElementById("renderRevisionVersion").innerText = activeConcept.version || "v2.0";

  renderAnglesGallery(activeConcept);
  renderPillars(activeConcept);
  renderSwatches(activeConcept);

  // 7. Cost Summary Card
  const roomCost = calculateRoomCost(currentRoom, state.activeConceptIndex);
  document.getElementById("roomEstimatedCost").innerText = `$${roomCost.toLocaleString()}`;
  document.getElementById("roomSqftSubtext").innerText = `${currentRoom.sqft || 380} sq ft • Includes custom millwork, soft furnishings & labor`;

  // 8. Decision Box & Comments
  renderDecisionBox(activeConcept);
  renderCommentsFeed(activeConcept);

  // 9. Sync 3D & 2D Models!
  sync3DViewerMaterials();
}

function renderRoomList() {
  const nav = document.getElementById("roomNavList");
  nav.innerHTML = "";

  state.rooms.forEach(room => {
    const li = document.createElement("li");
    li.className = `room-item ${room.id === state.activeRoomId ? "active" : ""}`;
    li.onclick = () => selectRoom(room.id);

    const cost = calculateRoomCost(room);

    li.innerHTML = `
      <div class="room-item-row">
        <span class="room-name">${room.name}</span>
        <span class="status-indicator-dot ${room.status}"></span>
      </div>
      <div class="room-sub-row">
        <span>${room.sqft || 300} sq ft</span>
        <span>$${cost.toLocaleString()}</span>
      </div>
    `;
    nav.appendChild(li);
  });

  const approved = state.rooms.filter(r => r.status === "approved").length;
  document.getElementById("overallApprovalBadge").innerText = `${approved}/${state.rooms.length} Approved`;
  const pct = Math.round((approved / state.rooms.length) * 100);
  document.getElementById("overallProgressBar").style.width = `${pct}%`;
  document.getElementById("progressText").innerText = `${pct}% Complete`;
}

function selectRoom(roomId) {
  state.activeRoomId = roomId;
  state.activeConceptIndex = 0;
  saveData(state);
  renderApp();

  const room = state.rooms.find(r => r.id === roomId);
  showToast(`Switched to ${room.name} (${getRoomType(room).toUpperCase()})`, "info");
}

function renderConceptOptions(currentRoom) {
  const container = document.getElementById("conceptButtonGroup");
  container.innerHTML = "";

  currentRoom.concepts.forEach((concept, idx) => {
    const btn = document.createElement("button");
    btn.className = `option-pill ${idx === state.activeConceptIndex ? "active" : ""}`;
    btn.innerText = concept.name.split(":")[0];
    btn.onclick = () => {
      state.activeConceptIndex = idx;
      saveData(state);
      renderApp();
      showToast(`Selected ${concept.name}`, "info");
    };
    container.appendChild(btn);
  });
}

function renderAnglesGallery(activeConcept) {
  const gallery = document.getElementById("anglesGallery");
  if (!gallery) return;
  gallery.innerHTML = "";

  if (state.viewportMode === "photo") {
    if (state.view2DSubMode === "canvas") {
      // 2D Studio Angle Cards
      const angles = [
        { id: "perspective", label: "🛋️ Eye-Level Perspective" },
        { id: "isometric", label: "📐 Isometric 3D Cutaway" },
        { id: "topdown", label: "🗺️ Architectural Blueprint" }
      ];

      angles.forEach(ang => {
        const btn = document.createElement("button");
        btn.className = `angle-card-btn ${state.view2DAngle === ang.id ? "active" : ""}`;
        btn.innerText = ang.label;
        btn.onclick = () => set2DAngle(ang.id);
        gallery.appendChild(btn);
      });

      // Quick toggle to editorial photo
      const photoBtn = document.createElement("button");
      photoBtn.className = "angle-card-btn";
      photoBtn.innerText = "📸 View Editorial Photo";
      photoBtn.onclick = () => switch2DSubTab("photo");
      gallery.appendChild(photoBtn);

    } else {
      // Editorial Photo Mode: Show angle thumbnails with resilient fallbacks
      const canvasBtn = document.createElement("button");
      canvasBtn.className = "angle-card-btn";
      canvasBtn.innerText = "🎨 Open 2D Color Studio";
      canvasBtn.onclick = () => switch2DSubTab("canvas");
      gallery.appendChild(canvasBtn);

      if (activeConcept.thumbnails && activeConcept.thumbnails.length > 0) {
        activeConcept.thumbnails.forEach((thumbUrl, idx) => {
          const btn = document.createElement("button");
          btn.className = `angle-card-btn ${idx === 0 ? "active" : ""}`;
          btn.innerText = `📸 Shot Angle ${idx + 1}`;
          btn.onclick = () => {
            document.querySelectorAll(".angle-card-btn").forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            const img = document.getElementById("activeRenderImg");
            if (img) img.src = thumbUrl;
          };
          gallery.appendChild(btn);
        });
      }
    }
  }
}

// --- 3-PILLAR REVIEW SYSTEM ---
function renderPillars(activeConcept) {
  const grid = document.getElementById("pillarReviewGrid");
  grid.innerHTML = "";

  const pillars = [
    {
      key: "layoutStatus",
      name: "1. Room Layout",
      status: activeConcept.layoutStatus || "under_review",
      detail: activeConcept.layoutDetails || "Custom furniture & circulation layout"
    },
    {
      key: "materialStatus",
      name: "2. Materials & Finishes",
      status: activeConcept.materialStatus || "under_review",
      detail: `${(activeConcept.materials || []).length} Specified Finishes & Textures`
    },
    {
      key: "colorSchemeStatus",
      name: "3. Color Scheme",
      status: activeConcept.colorSchemeStatus || "under_review",
      detail: activeConcept.colorSchemeName || "Cohesive Warm Palette"
    }
  ];

  pillars.forEach(pillar => {
    const el = document.createElement("div");
    el.className = `pillar-item ${pillar.status}`;

    el.innerHTML = `
      <div class="pillar-top">
        <span class="pillar-title">${pillar.name}</span>
        <span class="pillar-status-badge ${pillar.status}">${formatStatus(pillar.status)}</span>
      </div>
      <div class="pillar-desc">${pillar.detail}</div>
      <div class="pillar-actions">
        <button class="btn btn-xs btn-outline-success ${pillar.status === 'approved' ? 'active' : ''}" 
          onclick="togglePillarStatus('${pillar.key}', 'approved')">✓ Approve</button>
        <button class="btn btn-xs btn-outline-danger ${pillar.status === 'changes_requested' ? 'active' : ''}" 
          onclick="togglePillarStatus('${pillar.key}', 'changes_requested')">✎ Revise</button>
      </div>
    `;

    grid.appendChild(el);
  });
}

function togglePillarStatus(pillarKey, newStatus) {
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  const activeConcept = currentRoom.concepts[state.activeConceptIndex];

  activeConcept[pillarKey] = newStatus;

  const pillarNameMap = {
    layoutStatus: "Layout Plan",
    materialStatus: "Materials & Finishes",
    colorSchemeStatus: "Color Scheme"
  };

  if (!activeConcept.comments) activeConcept.comments = [];
  activeConcept.comments.push({
    author: state.currentRole === "client" ? `Client (${state.clientName.split(" ")[0]})` : "Lead Designer",
    role: state.currentRole,
    time: "Just now",
    tag: pillarNameMap[pillarKey] || "Status Update",
    text: `Marked ${pillarNameMap[pillarKey]} as "${newStatus === 'approved' ? 'Approved' : 'Changes Requested'}".`
  });

  saveData(state);
  renderApp();
  showToast(`Updated ${pillarNameMap[pillarKey]} to ${formatStatus(newStatus)}`, "success");
}

// --- MATERIAL SWATCHES & MODAL INSPECTION ---
function renderSwatches(activeConcept) {
  const grid = document.getElementById("swatchesGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const mats = activeConcept.materials || [];
  const tag = document.getElementById("activePaletteTag");
  if (tag) tag.innerText = `${mats.length} Specified Finishes`;

  mats.forEach((mat, idx) => {
    const card = document.createElement("div");
    card.className = `swatch-card ${idx === 0 ? "active-swatch" : ""}`;
    card.innerHTML = `
      <div class="swatch-color" style="background-color: ${mat.color}; border-bottom: 1px solid rgba(0,0,0,0.06);"></div>
      <div class="swatch-info">
        <div class="swatch-header-row">
          <div class="swatch-type">${mat.category}</div>
          <span class="swatch-spec-link" title="View technical specifications">🔍 Spec</span>
        </div>
        <div class="swatch-name" title="${mat.name}">${mat.name}</div>
        <div class="swatch-code">${mat.code} &bull; $${mat.pricePerSqft || 20}/sq ft</div>
      </div>
    `;

    // Clicking card applies color directly to 3D and 2D models
    card.onclick = (e) => {
      if (e.target.classList.contains("swatch-spec-link")) {
        openMaterialModal(mat, card);
      } else {
        applySingleMaterialLive(mat, card);
      }
    };

    grid.appendChild(card);
  });
}

function openMaterialModal(mat, cardElement) {
  selectedMaterialForModal = mat;

  document.querySelectorAll(".swatch-card").forEach(c => c.classList.remove("active-swatch"));
  if (cardElement) cardElement.classList.add("active-swatch");

  applySingleMaterialLive(mat, cardElement);

  document.getElementById("matModalTitle").innerText = mat.name;
  document.getElementById("matModalCategory").innerText = `${mat.category} • Technical Specification`;
  document.getElementById("matModalSwatch").style.backgroundColor = mat.color;
  document.getElementById("matModalName").innerText = mat.name;
  document.getElementById("matModalCode").innerText = `Specification Code: ${mat.code} • Finish: ${mat.grade || 'Standard'}`;
  document.getElementById("matModalPrice").innerText = `$${mat.pricePerSqft || 25} / sq ft • Trade Cost`;

  document.getElementById("matModalSupplier").innerText = mat.supplier || "PixelX Certified Trade Partner";
  document.getElementById("matModalHex").innerText = mat.color;
  document.getElementById("matModalGrade").innerText = mat.grade || "Commercial & Residential Grade";
  document.getElementById("matModalLeadTime").innerText = "2-3 Weeks Direct Stock";

  document.getElementById("materialModal").classList.add("open");
}

function closeMaterialModal() {
  document.getElementById("materialModal").classList.remove("open");
  selectedMaterialForModal = null;
}

function applySingleMaterialLive(mat, cardElement) {
  if (!mat) return;
  const cat = (mat.category || "").toLowerCase();

  // Highlight card
  document.querySelectorAll(".swatch-card").forEach(c => c.classList.remove("active-swatch"));
  if (cardElement) cardElement.classList.add("active-swatch");

  const updates = {};
  if (cat.includes("wall") || cat.includes("paint")) updates.wallColor = mat.color;
  else if (cat.includes("floor") || cat.includes("cement")) updates.floorColor = mat.color;
  else if (cat.includes("upholstery") || cat.includes("bed") || cat.includes("fabric") || cat.includes("linen") || cat.includes("leather")) updates.sofaColor = mat.color;
  else if (cat.includes("wood") || cat.includes("cabinet") || cat.includes("teak") || cat.includes("slat") || cat.includes("headboard")) updates.accentWoodColor = mat.color;
  else if (cat.includes("metal") || cat.includes("accent") || cat.includes("stone") || cat.includes("counter") || cat.includes("trim") || cat.includes("quartz")) updates.accentColor = mat.color;

  if (viewer) {
    try {
      viewer.applyMaterials(updates);
    } catch (e) {
      console.warn("Viewer apply error:", e);
    }
  }

  // Update 2D canvas & photo live
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  const activeConcept = currentRoom ? (currentRoom.concepts[state.activeConceptIndex] || currentRoom.concepts[0]) : null;
  const currentSelections = (viewer && viewer.currentSelections) ? viewer.currentSelections : {
    wallColor: "#F0ECE1",
    floorColor: "#CBB69D",
    sofaColor: "#D7CFC7",
    accentWoodColor: "#8E5A3C",
    accentColor: "#CBB17C",
    lightingMode: state.currentLightingMode || "golden"
  };
  const merged = { ...currentSelections, ...updates };

  render2DColorCustomizerCanvas(getRoomType(currentRoom), merged, state.view2DAngle || "perspective");
  if (activeConcept) renderPhotoHotspots(activeConcept, merged);

  showToast(`Applied ${mat.name} (${mat.color}) to 3D and 2D models.`, "info");
}

function confirmApplyMaterialFromModal() {
  if (!selectedMaterialForModal) return;

  const mat = selectedMaterialForModal;
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  const activeConcept = currentRoom.concepts[state.activeConceptIndex];

  // Persist into concept materials
  const existing = activeConcept.materials.find(m => m.category === mat.category);
  if (existing) {
    existing.color = mat.color;
    existing.name = mat.name;
    existing.code = mat.code;
  }

  saveData(state);
  applySingleMaterialLive(mat);
  closeMaterialModal();
  showToast(`Applied ${mat.name} to 3D and 2D models.`, "success");
}

// --- ITEMIZED COST BREAKDOWN MODAL ---
function openCostModal() {
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  const activeConcept = currentRoom.concepts[state.activeConceptIndex];
  const container = document.getElementById("costModalContent");

  const totalCost = calculateProjectTotal();
  const roomCost = calculateRoomCost(currentRoom, state.activeConceptIndex);

  let itemsHtml = "";
  const lines = [
    { item: "Flooring Package", spec: "White Oak Herringbone / Engineered Wood", qty: `${currentRoom.sqft} sq ft`, rate: "$22/sq ft", sub: Math.round(currentRoom.sqft * 22) },
    { item: "Architectural Wall Finishes", spec: "Velvet Wash / Acoustic Slat Panels", qty: `${Math.round(currentRoom.sqft * 2.2)} sq ft`, rate: "$12/sq ft", sub: Math.round(currentRoom.sqft * 2.2 * 12) },
    { item: "Bespoke Furnishings & Seating", spec: "Custom Bed / Sectional Sofa / Island Suite", qty: "1 Suite", rate: "Custom Spec", sub: Math.round(activeConcept.materials ? 14500 : 12000) },
    { item: "Custom Architectural Millwork", spec: "Fluted Slats, Built-in Headboard / Cabinetry", qty: "Custom Joinery", rate: "Trade Schedule", sub: 6500 },
    { item: "Lighting Fixtures & Electrical", spec: "Chandelier, Floor Lamp, Dimmable Cove LEDs", qty: "1 Package", rate: "UL Certified", sub: 3200 },
    { item: "Skilled Trade Labor & Installation", spec: "Leveling, Fitting, White-Glove Installation", qty: "Comprehensive", rate: "Contractor Fee", sub: Math.round(roomCost * 0.15) }
  ];

  lines.forEach(l => {
    itemsHtml += `
      <tr>
        <td><strong>${l.item}</strong></td>
        <td>${l.spec}</td>
        <td>${l.qty}</td>
        <td>${l.rate}</td>
        <td style="text-align: right; font-weight: 700;">$${l.sub.toLocaleString()}</td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div style="background: var(--bg-subtle); padding: 1rem; border-radius: 8px; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Current Space Estimate:</span>
        <div style="font-size: 1.5rem; font-family: var(--font-serif); font-weight: 700; color: var(--accent-gold-dark);">${currentRoom.name}: $${roomCost.toLocaleString()}</div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Total Project Portfolio:</span>
        <div style="font-size: 1.5rem; font-family: var(--font-serif); font-weight: 700; color: var(--status-approved);">$${totalCost.toLocaleString()}</div>
      </div>
    </div>

    <table class="summary-table">
      <thead>
        <tr>
          <th>Line Item Component</th>
          <th>Specification Details</th>
          <th>Quantity</th>
          <th>Unit Rate</th>
          <th style="text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr style="background: var(--accent-gold-soft); font-weight: 700;">
          <td colspan="4" style="text-align: right; text-transform: uppercase;">Space Subtotal:</td>
          <td style="text-align: right; color: var(--accent-gold-dark); font-size: 1.05rem;">$${roomCost.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  `;

  document.getElementById("costModal").classList.add("open");
}

function closeCostModal() {
  document.getElementById("costModal").classList.remove("open");
}

// --- DECISION STATUS BOX ---
function renderDecisionBox(activeConcept) {
  const box = document.getElementById("decisionStatusBox");
  const icon = document.getElementById("decisionStatusIcon");
  const title = document.getElementById("decisionStatusTitle");
  const sub = document.getElementById("decisionStatusSubtitle");

  if (activeConcept.status === "approved") {
    box.className = "decision-status-box approved";
    icon.innerText = "✓";
    title.innerText = "Layout & Materials Approved";
    sub.innerText = `Signed-off by Client for ${activeConcept.name} (${activeConcept.version})`;
  } else if (activeConcept.status === "changes_requested") {
    box.className = "decision-status-box changes";
    icon.innerText = "✕";
    title.innerText = "Modifications Requested";
    sub.innerText = "Revisions logged for interior designer review.";
  } else {
    box.className = "decision-status-box";
    icon.innerText = "⏳";
    title.innerText = "Awaiting Client Sign-Off";
    sub.innerText = "Review 3D/2D layout, colors, and finish swatches below.";
  }
}

// --- APPROVAL & REVISION WORKFLOWS ---
function handleApprove() {
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  const activeConcept = currentRoom.concepts[state.activeConceptIndex];

  activeConcept.status = "approved";
  currentRoom.status = "approved";

  if (!activeConcept.comments) activeConcept.comments = [];
  activeConcept.comments.push({
    author: state.currentRole === "client" ? `Client (${state.clientName.split(" ")[0]})` : "Lead Designer",
    role: state.currentRole,
    time: "Just now",
    tag: "Formal Sign-off",
    text: `✅ Formally approved ${activeConcept.name} (${activeConcept.version}). Layout, materials, and color scheme locked for procurement.`
  });

  saveData(state);
  renderApp();
  showToast(`🎉 Approved ${currentRoom.name} (${activeConcept.name})!`, "success");
}

function openRevisionModal() {
  document.getElementById("revisionModal").classList.add("open");
}

function closeRevisionModal() {
  document.getElementById("revisionModal").classList.remove("open");
}

function submitRevisionRequest() {
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  const activeConcept = currentRoom.concepts[state.activeConceptIndex];

  const checkboxes = document.querySelectorAll('input[name="revAspect"]:checked');
  const selectedAspects = Array.from(checkboxes).map(cb => cb.value).join(", ");
  const notes = document.getElementById("revisionNotes").value.trim();

  if (!notes) {
    showToast("Please provide specific feedback instructions for the designer.", "warning");
    return;
  }

  activeConcept.status = "changes_requested";
  currentRoom.status = "changes_requested";

  const aspectTag = selectedAspects ? selectedAspects : "Revision Request";

  if (!activeConcept.comments) activeConcept.comments = [];
  activeConcept.comments.push({
    author: state.currentRole === "client" ? `Client (${state.clientName.split(" ")[0]})` : "Design Review",
    role: state.currentRole,
    time: "Just now",
    tag: aspectTag,
    text: `⚠️ Revision requested [Aspects: ${aspectTag}]: "${notes}"`
  });

  checkboxes.forEach(cb => cb.checked = false);
  document.getElementById("revisionNotes").value = "";
  closeRevisionModal();

  saveData(state);
  renderApp();
  showToast("Design revision request submitted to the interior designer.", "warning");
}

// --- COMMENTS & FEEDBACK THREAD ---
function renderCommentsFeed(activeConcept) {
  const feed = document.getElementById("commentsFeed");
  feed.innerHTML = "";

  const comments = activeConcept.comments || [];
  document.getElementById("commentCountBadge").innerText = `${comments.length} Notes`;

  if (comments.length === 0) {
    feed.innerHTML = `<p style="color:var(--text-muted); font-size:0.8rem; text-align:center; padding:1.5rem;">No remarks posted yet. Share your feedback below!</p>`;
    return;
  }

  comments.forEach(c => {
    const card = document.createElement("div");
    card.className = "comment-bubble";
    card.innerHTML = `
      <div class="comment-top">
        <span class="comment-author ${c.role === 'designer' ? 'designer' : ''}">${c.author}</span>
        <span class="comment-time">${c.time}</span>
      </div>
      <div class="comment-tag"># ${c.tag || 'General'}</div>
      <div class="comment-text">${c.text}</div>
    `;
    feed.appendChild(card);
  });
}

function handlePostComment(e) {
  e.preventDefault();
  const input = document.getElementById("commentInput");
  const tagSelect = document.getElementById("commentTagSelect");
  const text = input.value.trim();
  const tag = tagSelect ? tagSelect.value : "General";

  if (!text) return;

  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  const activeConcept = currentRoom.concepts[state.activeConceptIndex];

  if (!activeConcept.comments) activeConcept.comments = [];
  activeConcept.comments.push({
    author: state.currentRole === "client" ? `Client (${state.clientName.split(" ")[0]})` : "Hitansh Arora (Designer)",
    role: state.currentRole,
    time: "Just now",
    tag: tag,
    text: text
  });

  input.value = "";
  saveData(state);
  renderCommentsFeed(activeConcept);
  showToast("Feedback note posted.", "info");
}

// --- ADD NEW SPACE MODAL ---
function openAddRoomModal() {
  document.getElementById("addRoomModal").classList.add("open");
}

function closeAddRoomModal() {
  document.getElementById("addRoomModal").classList.remove("open");
}

function confirmAddRoomFromModal() {
  const nameInput = document.getElementById("newRoomNameInput");
  const sqftInput = document.getElementById("newRoomSqftInput");
  const budgetInput = document.getElementById("newRoomBudgetInput");

  const name = nameInput.value.trim();
  const sqft = parseInt(sqftInput.value, 10) || 200;
  const budget = parseInt(budgetInput.value, 10) || 20000;

  if (!name) {
    showToast("Please provide a name for the space.", "warning");
    return;
  }

  const newId = `room_${Date.now()}`;
  const newRoom = {
    id: newId,
    name: name,
    description: "New space ready for layout concepts and 3D material selections.",
    sqft: sqft,
    baseCost: budget,
    status: "under_review",
    concepts: [
      {
        name: "Concept A: Modern Contemporary",
        version: "v1.0",
        status: "under_review",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        thumbnails: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80"],
        layoutDetails: "Custom space layout with bespoke joinery",
        layoutStatus: "under_review",
        colorSchemeName: "Neutral Warm Greige",
        colorSchemeStatus: "under_review",
        materialStatus: "under_review",
        materials: [
          { category: "Wall Finish", name: "Classic Alabaster", code: "AP-100", color: "#F4F1EA", pricePerSqft: 12 },
          { category: "Flooring", name: "Select White Oak", code: "WD-101", color: "#CBB69D", pricePerSqft: 22 }
        ],
        comments: []
      }
    ]
  };

  state.rooms.push(newRoom);
  state.activeRoomId = newId;
  state.activeConceptIndex = 0;

  nameInput.value = "";
  closeAddRoomModal();

  saveData(state);
  renderApp();
  showToast(`Created space: ${name}`, "success");
}

// --- SIGN-OFF REPORT MODAL ---
function openSummaryModal() {
  const container = document.getElementById("summaryModalContent");
  const totalCost = calculateProjectTotal();

  let rowsHtml = "";
  state.rooms.forEach(room => {
    const concept = room.concepts[0];
    const cost = calculateRoomCost(room);
    rowsHtml += `
      <tr>
        <td><strong>${room.name}</strong></td>
        <td>${concept.name} (${concept.version || 'v1.0'})</td>
        <td><span class="pillar-status-badge ${concept.layoutStatus || 'under_review'}">${formatStatus(concept.layoutStatus || 'under_review')}</span></td>
        <td><span class="pillar-status-badge ${concept.materialStatus || 'under_review'}">${formatStatus(concept.materialStatus || 'under_review')}</span></td>
        <td><span class="pillar-status-badge ${concept.colorSchemeStatus || 'under_review'}">${formatStatus(concept.colorSchemeStatus || 'under_review')}</span></td>
        <td><span class="status-badge badge-${room.status}">${formatStatus(room.status)}</span></td>
        <td style="text-align: right; font-weight: 700;">$${cost.toLocaleString()}</td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--accent-gold); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
      <div>
        <h2 style="font-family: var(--font-serif); font-size: 1.45rem;">PIXELX INTERIOR ARCHITECTURAL STUDIOS</h2>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Client Specification Sign-Off Ledger &bull; Group Sr. No. 4</p>
      </div>
      <div style="text-align: right; font-size: 0.75rem; color: var(--text-muted);">
        <div>Lead Architect: ${state.designerName}</div>
        <div>Client: ${state.clientName}</div>
      </div>
    </div>

    <table class="summary-table">
      <thead>
        <tr>
          <th>Space</th>
          <th>Chosen Concept</th>
          <th>Layout</th>
          <th>Materials</th>
          <th>Colors</th>
          <th>Room Status</th>
          <th style="text-align: right;">Estimate</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
        <tr style="background: var(--bg-subtle); font-weight: 700;">
          <td colspan="6" style="text-align: right; text-transform: uppercase;">Total Estimated Portfolio:</td>
          <td style="text-align: right; color: var(--accent-gold-dark); font-size: 1.1rem;">$${totalCost.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; font-size: 0.8rem;">
      <div style="border-top: 1px dashed #ccc; padding-top: 0.75rem;">
        <span style="color: var(--text-muted); display: block; margin-bottom: 1rem;">Client Sign-Off Authorization:</span>
        <div style="font-family: 'Playfair Display', serif; font-size: 1.35rem; color: var(--accent-gold-dark);">${state.clientName}</div>
        <span style="font-size: 0.7rem; color: var(--text-muted);">Digital Client Approval Recorded &bull; ${new Date().toLocaleDateString()}</span>
      </div>
      <div style="border-top: 1px dashed #ccc; padding-top: 0.75rem;">
        <span style="color: var(--text-muted); display: block; margin-bottom: 1rem;">Architectural Approval:</span>
        <div style="font-family: 'Playfair Display', serif; font-size: 1.35rem; color: var(--accent-gold-dark);">${state.designerName}</div>
        <span style="font-size: 0.7rem; color: var(--text-muted);">Studio Principal &bull; PixelX Studios</span>
      </div>
    </div>
  `;

  document.getElementById("summaryModal").classList.add("open");
}

function closeSummaryModal() {
  document.getElementById("summaryModal").classList.remove("open");
}

// --- ROLE SWITCHER ---
function setRole(role) {
  state.currentRole = role;
  const isClient = role === "client";

  document.getElementById("roleClientBtn").classList.toggle("active", isClient);
  document.getElementById("roleDesignerBtn").classList.toggle("active", !isClient);

  document.getElementById("commentingAsLabel").innerHTML = isClient
    ? "As: <b>Client (Ananya)</b>"
    : "As: <b>Hitansh Arora (Designer)</b>";

  saveData(state);
  showToast(`Switched perspective to ${isClient ? 'Client' : 'Lead Designer'}.`, "info");
}

// --- UTILITY HELPERS ---
function formatStatus(status) {
  if (status === "approved") return "Approved";
  if (status === "changes_requested") return "Changes Needed";
  return "Under Review";
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-message ${type}`;
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// --- ON DOM LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  renderApp();
  init3DViewer();
  switchViewportMode(state.viewportMode || "3d");

  // Close modals on backdrop click
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  });
});
