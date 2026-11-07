/**
 * PixelX Studios - Interactive Design-Review, 3D Studio & Client Approval System
 * Course Project Submission - Group Sr. No. 4 (Hitansh Arora)
 * 
 * Features:
 * - 3D Interactive Room Studio with Real-time Material Swapping
 * - Dynamic Live Cost & Budget Tracking Engine
 * - Granular 3-Pillar Review: Layout, Materials & Color Scheme
 * - Modal-based Material Inspection (Zero annoying browser alerts)
 * - Client Sign-Off Reports and Audit Log Feedback Threads
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
  currentLightingMode: "golden",
  rooms: [
    {
      id: "room_living",
      name: "Living Room",
      description: "Spacious double-height living lounge with seamless terrace view and natural lighting.",
      sqft: 380,
      baseCost: 28500,
      status: "under_review", // 'approved' | 'changes_requested' | 'under_review'
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
            { category: "Headboard", name: "Fluted White Oak Wall", code: "TK-201", color: "#B89B7A", supplier: "Custom Millwork", pricePerSqft: 32, grade: "Acoustic Slat" },
            { category: "Bed Fabric", name: "Natural Belgian Linen", code: "FB-112", color: "#D7D0C5", supplier: "Libeco Home", pricePerSqft: 38, grade: "100% Organic Flax" }
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
            { category: "Cabinetry", name: "Fenix NTM Matte Black", code: "FN-0720", color: "#22252A", supplier: "Arpa Industriale", pricePerSqft: 40, grade: "Thermal Healing Nano" },
            { category: "Countertop", name: "Calacatta Gold Quartz", code: "QZ-880", color: "#F7F5F0", supplier: "Caesarstone", pricePerSqft: 55, grade: "Non-porous NSF Cert" },
            { category: "Backsplash", name: "Smoked Gray Terrazzo", code: "TZ-302", color: "#A8A49D", supplier: "Agglotech Italy", pricePerSqft: 26, grade: "Honed Satin Tile" },
            { category: "Flooring", name: "Continuous Micro-Cement", code: "MC-101", color: "#B8B3AB", supplier: "Ideal Work", pricePerSqft: 18, grade: "Seamless Water-Resistant" }
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
      return JSON.parse(saved);
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

// --- COST & BUDGET CALCULATIONS ---
function calculateRoomCost(room, conceptIndex = 0) {
  const concept = room.concepts[conceptIndex] || room.concepts[0];
  let cost = room.baseCost || 25000;

  // Add material adjustments based on active specifications
  if (concept.materials) {
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

// --- 3D VIEWER INITIALIZATION & SYNC ---
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
  if (!viewer) return;

  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  if (!currentRoom) return;

  const activeConcept = currentRoom.concepts[state.activeConceptIndex] || currentRoom.concepts[0];

  let wallColor = "#F0ECE1";
  let floorColor = "#CBB69D";
  let sofaColor = "#D7CFC7";
  let accentColor = "#CBB17C";

  if (activeConcept.materials) {
    activeConcept.materials.forEach(mat => {
      const cat = (mat.category || "").toLowerCase();
      if (cat.includes("wall")) wallColor = mat.color;
      else if (cat.includes("floor") || cat.includes("cement")) floorColor = mat.color;
      else if (cat.includes("upholstery") || cat.includes("bed") || cat.includes("cabinet")) sofaColor = mat.color;
      else if (cat.includes("metal") || cat.includes("accent") || cat.includes("stone") || cat.includes("counter")) accentColor = mat.color;
    });
  }

  viewer.applyMaterials({
    wallColor: wallColor,
    floorColor: floorColor,
    sofaColor: sofaColor,
    accentColor: accentColor,
    lightingMode: state.currentLightingMode || activeConcept.lightingMode || "golden"
  });
}

function switchViewportMode(mode) {
  state.viewportMode = mode;
  const is3D = mode === "3d";

  const btn3D = document.getElementById("btnView3D");
  const btnPhoto = document.getElementById("btnViewPhoto");
  const threeWrap = document.getElementById("three-canvas-container");
  const photoWrap = document.getElementById("photoRenderWrap");
  const controls3D = document.getElementById("viewport3DControls");
  const hint3D = document.getElementById("viewport3DHint");
  const gallery = document.getElementById("anglesGallery");

  if (btn3D) btn3D.classList.toggle("active", is3D);
  if (btnPhoto) btnPhoto.classList.toggle("active", !is3D);

  if (threeWrap) threeWrap.style.display = is3D ? "block" : "none";
  if (photoWrap) photoWrap.style.display = is3D ? "none" : "block";
  if (controls3D) controls3D.style.display = is3D ? "flex" : "none";
  if (hint3D) hint3D.style.display = is3D ? "block" : "none";
  if (gallery) gallery.style.display = is3D ? "none" : "flex";

  if (is3D && viewer) {
    setTimeout(() => {
      viewer.onResize();
      sync3DViewerMaterials();
    }, 50);
  }

  saveData(state);
}

function setViewerCamera(camType) {
  if (viewer) viewer.setCameraView(camType);

  ["btnCamPersp", "btnCamIso", "btnCamTop"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  if (camType === "perspective") {
    const el = document.getElementById("btnCamPersp");
    if (el) el.classList.add("active");
  } else if (camType === "isometric") {
    const el = document.getElementById("btnCamIso");
    if (el) el.classList.add("active");
  } else if (camType === "topdown") {
    const el = document.getElementById("btnCamTop");
    if (el) el.classList.add("active");
  }
}

function setViewerLighting(mode) {
  state.currentLightingMode = mode;
  if (viewer) viewer.setLightingMode(mode);

  ["btnLightDay", "btnLightGolden", "btnLightNight"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  const activeBtn = document.getElementById(
    mode === "day" ? "btnLightDay" : mode === "golden" ? "btnLightGolden" : "btnLightNight"
  );
  if (activeBtn) activeBtn.classList.add("active");

  saveData(state);
}

// --- CORE APPLICATION RENDERER ---
function renderApp() {
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId) || state.rooms[0];
  const activeConcept = currentRoom.concepts[state.activeConceptIndex] || currentRoom.concepts[0];

  // 1. Header info
  document.getElementById("projectName").innerText = state.projectName;

  // 2. Project Stats & Budget Banner
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

  // 3. Left Sidebar Room Navigation
  renderRoomList();

  // 4. Room Header & Meta
  document.getElementById("currentRoomTitle").innerText = currentRoom.name;
  document.getElementById("currentRoomDesc").innerText = currentRoom.description;

  const roomBadge = document.getElementById("currentRoomStatusBadge");
  roomBadge.className = `status-badge badge-${currentRoom.status}`;
  roomBadge.innerText = formatStatus(currentRoom.status);

  // 5. Concept Option Pills
  renderConceptOptions(currentRoom);

  // 6. Viewport Renders (Photo mode)
  document.getElementById("activeRenderImg").src = activeConcept.image;
  document.getElementById("renderConceptBadge").innerText = activeConcept.name;
  document.getElementById("renderRevisionVersion").innerText = activeConcept.version || "v2.0";

  // Thumbnails gallery
  renderAnglesGallery(activeConcept);

  // 7. Granular 3-Pillar Review Engine
  renderPillars(activeConcept);

  // 8. Material Swatches
  renderSwatches(activeConcept);

  // 9. Cost Summary Card
  const roomCost = calculateRoomCost(currentRoom, state.activeConceptIndex);
  document.getElementById("roomEstimatedCost").innerText = `$${roomCost.toLocaleString()}`;
  document.getElementById("roomSqftSubtext").innerText = `${currentRoom.sqft || 380} sq ft • Includes custom millwork, soft furnishings & labor`;

  // 10. Decision Status Box
  renderDecisionBox(activeConcept);

  // 11. Comments Thread
  renderCommentsFeed(activeConcept);

  // 12. Sync 3D scene
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

  // Overall badge
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
  showToast(`Viewing ${room.name}`, "info");
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
  gallery.innerHTML = "";

  if (activeConcept.thumbnails && activeConcept.thumbnails.length > 1) {
    activeConcept.thumbnails.forEach((thumbUrl, idx) => {
      const img = document.createElement("img");
      img.src = thumbUrl;
      img.className = `angle-thumb ${idx === 0 ? "active" : ""}`;
      img.title = `Camera Angle ${idx + 1}`;
      img.onclick = (e) => {
        document.querySelectorAll(".angle-thumb").forEach(t => t.classList.remove("active"));
        img.classList.add("active");
        document.getElementById("activeRenderImg").src = thumbUrl;
      };
      gallery.appendChild(img);
    });
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

// --- MATERIAL SWATCHES & MODAL INSPECTION (REPLACING ALERTS) ---
function renderSwatches(activeConcept) {
  const grid = document.getElementById("swatchesGrid");
  grid.innerHTML = "";

  const mats = activeConcept.materials || [];
  document.getElementById("activePaletteTag").innerText = `${mats.length} Specified Finishes`;

  mats.forEach((mat, idx) => {
    const card = document.createElement("div");
    card.className = `swatch-card ${idx === 0 ? "active-swatch" : ""}`;
    card.innerHTML = `
      <div class="swatch-color" style="background-color: ${mat.color}; border-bottom: 1px solid rgba(0,0,0,0.06);"></div>
      <div class="swatch-info">
        <div class="swatch-type">${mat.category}</div>
        <div class="swatch-name" title="${mat.name}">${mat.name}</div>
        <div class="swatch-code">${mat.code} &bull; $${mat.pricePerSqft || 20}/sq ft</div>
      </div>
    `;

    // Click opens elegant modal instead of browser alert()!
    card.onclick = () => openMaterialModal(mat, card);
    grid.appendChild(card);
  });
}

function openMaterialModal(mat, cardElement) {
  selectedMaterialForModal = mat;

  // Highlight active swatch in UI
  document.querySelectorAll(".swatch-card").forEach(c => c.classList.remove("active-swatch"));
  if (cardElement) cardElement.classList.add("active-swatch");

  // Populate modal data
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

  // Open modal
  document.getElementById("materialModal").classList.add("open");
}

function closeMaterialModal() {
  document.getElementById("materialModal").classList.remove("open");
  selectedMaterialForModal = null;
}

function confirmApplyMaterialFromModal() {
  if (!selectedMaterialForModal) return;

  const mat = selectedMaterialForModal;
  const currentRoom = state.rooms.find(r => r.id === state.activeRoomId);
  const activeConcept = currentRoom.concepts[state.activeConceptIndex];

  // Update 3D Viewer directly
  if (viewer) {
    const cat = (mat.category || "").toLowerCase();
    if (cat.includes("wall")) viewer.applyMaterials({ wallColor: mat.color });
    else if (cat.includes("floor") || cat.includes("cement")) viewer.applyMaterials({ floorColor: mat.color });
    else if (cat.includes("upholstery") || cat.includes("bed") || cat.includes("cabinet")) viewer.applyMaterials({ sofaColor: mat.color });
    else if (cat.includes("metal") || cat.includes("accent") || cat.includes("stone")) viewer.applyMaterials({ accentColor: mat.color });
  }

  closeMaterialModal();
  showToast(`Applied ${mat.name} to 3D room model & concept specifications.`, "success");
}

// --- ITEMISED COST BREAKDOWN MODAL ---
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
    { item: "Bespoke Furnishings & Seating", spec: "Custom Sectional Sofa, Coffee Table & Rug", qty: "1 Suite", rate: "Custom Spec", sub: Math.round(activeConcept.materials ? 14500 : 12000) },
    { item: "Custom Architectural Millwork", spec: "Fluted Slats, Built-in TV Credenza, Baseboards", qty: "Custom Joinery", rate: "Trade Schedule", sub: 6500 },
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
    sub.innerText = "Review 3D layout, colors, and finish swatches below.";
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

// --- ADD NEW SPACE MODAL (REPLACING NATIVE PROMPT) ---
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
  const approved = state.rooms.filter(r => r.status === "approved").length;

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
