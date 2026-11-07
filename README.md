# PixelX | Interior Design Client Review & 3D Approval Portal
**Course Project Submission - Group Sr. No. 4 (Team PixelX)**

## Team Members
* **Hitansh Arora** (Reg. No: 12629444) - *Team Leader*
* Member 2 (Reg. No: 12627898)
* Member 3 (Reg. No: 12601431)

---

## 🎯 Direct Alignment with Problem Statement
> **Problem Statement:** *"Interior designers frequently exchange design concepts with clients and need to record which layouts, materials, and color schemes have been approved or require changes."*

Our system provides a specialized **3-Pillar Review Engine**:
1. **Layout Review & Approval:** Record sign-off on furniture layouts and room flow.
2. **Material Selection & Finishes:** Technical swatches (veneer, quartz, fabric, tiles, metal trims) with codes and statuses.
3. **Color Scheme Review:** Wall paint codes (e.g. Asian Paints) and accent schemes.

---

## 🚀 Key Features Built

### 1. Interactive 3D Room Studio ("Build Your Dream Interior")
- Powered by Three.js & WebGL with realistic procedural parametric modeling.
- **Real-Time Material Syncing:** Clicking any material swatch (Flooring, Walls, Furniture Bouclé/Velvet, Fluted Slats, Brass Trims) updates the 3D model in real time.
- **Lighting Ambience Presets:** Switch between ☀️ Daylight, 🌅 Golden Hour Warmth, and 🌙 Evening Ambient glow.
- **Camera View Presets:** 🛋️ Perspective lounge walkthrough, 📐 Isometric architectural cutaway, and 🗺️ Top-Down 2D/3D floorplan.
- **Dual View Modes:** Seamless toggle between interactive 3D WebGL studio and 2D photo render angle galleries.

### 2. Live Estimated Cost & Budget Tracker
- **Real-Time Cost Calculations:** Dynamically computes estimated space and total portfolio costs based on room square footage, material square-foot rates, millwork joinery, furniture packages, and contractor labor.
- **Target Budget Meter:** Visual progress bar comparing estimated investments against the client's target budget (`$85,000`).
- **Itemized Cost Modal:** Clean financial ledger breakdown with print/PDF export support.

### 3. Granular 3-Pillar Status Tracker
- Instant click-to-approve or click-to-revise for:
  - **1. Room Layout** (`[✓ Approve]` `[✎ Revise]`)
  - **2. Materials & Finishes** (`[✓ Approve]` `[✎ Revise]`)
  - **3. Color Scheme** (`[✓ Approve]` `[✎ Revise]`)
- Auto-logs timestamped decisions directly into the design feedback audit thread.

### 4. Zero Annoying Browser Alerts (Modern Modal Architecture)
- Replaced primitive JavaScript `alert()` and `prompt()` popups with:
  - **Material Specification Modal:** Swatch preview, category, technical code, supplier information, durability rating, and trade cost per sq ft.
  - **Add Space Modal:** Clean dialog to add custom rooms, area (sq ft), and allocated target budgets.
  - **Structured Revision Modal:** Categorized checkboxes and detailed instruction capture.
  - **Luxury Toast Notifications:** Smooth confirmation pills for all actions.

### 5. Role Toggle & Client Sign-Off Report
- **Client vs. Lead Designer Switcher:** Homeowner perspective (`Client - Ananya`) vs. architect controls (`Hitansh Arora`).
- **Client Sign-off Summary Sheet:** Formal printable PDF-ready summary ledger with digital sign-off and approval timestamps.

---

## 💻 How to Run
Simply open `index.html` in any web browser (Google Chrome, Microsoft Edge, Brave, etc.). No installation or server setup is required!
```bash
# Path to open:
C:\Users\User\.gemini\antigravity\scratch\pixelx-design-review\index.html
```
