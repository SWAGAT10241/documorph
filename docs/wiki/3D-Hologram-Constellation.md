# 🌌 3D Hologram & WebGL Constellation Engine

The **3D Hologram Constellation** in DocuMorph elevates architecture documentation into an immersive, interactive 3D WebGL space powered by **Three.js**.

---

## 1. Architectural Philosophy

Traditional architecture diagrams are flat 2D abstractions. In large distributed systems, microservices form complex multidimensional dependency webs. The 3D Hologram view models services as celestial nodes floating in a cybernetic nebula, giving engineers a tactile, intuitive sense of service hierarchy, data flow, and bottlenecks.

---

## 2. Geometric Node Representation

Each microservice type in DocuMorph is modeled with custom 3D geometry, neon emissive shaders, and animated orbital components:

| Microservice Type | 3D Core Geometry | Emissive Accent | Kinetic Components |
| :--- | :--- | :--- | :--- |
| **Edge Gateway** | `OctahedronGeometry` | Cyan (`#00f0ff`) | Dual rotating wireframe gyroscopic rings (`RingGeometry`) |
| **AI Agent** | `IcosahedronGeometry` | Rose (`#ff007f`) | 3 orbiting quantum satellite spheres in elliptical paths |
| **Database** | `CylinderGeometry` | Emerald (`#10b981`) | Layered glowing storage disks with pulse core |
| **Message Queue** | `TorusGeometry` | Amber (`#f59e0b`) | Expanding pulse shockwave envelope |
| **Microservice** | `BoxGeometry` | Indigo (`#6366f1`) | Chamfered cube with inner glowing core |
| **Memory Cache** | `ConeGeometry` (dual) | Teal (`#06b6d4`) | High-speed spinning diamond with electric sparks |
| **Auth Gateway** | `TorusKnotGeometry` | Purple (`#a855f7`) | Cryptographic laser security sweep |

---

## 3. Spatial Layout Algorithms

DocuMorph provides three mathematical layout algorithms in 3D:

### A. Tiered Layout (`tiered`)
Arranges services into hierarchical tiers:
- **Upper Tier (`y = +14`)**: Ingress Edge Gateways and Authentication layers.
- **Middle Tier (`y = 0`)**: Core business microservices and AI agent reasoning pipelines.
- **Lower Tier (`y = -14`)**: Persistence layer (PostgreSQL, MongoDB), in-memory caches, and message brokers.

### B. Orbital Galaxy (`orbital`)
Selects the primary ingress gateway or AI agent as the central gravity well (`x=0, y=0, z=0`), while dependent microservices orbit at varying radial distances:
$$x = R \cos(\theta), \quad z = R \sin(\theta), \quad y = \sin(2\theta) \cdot 5$$

### C. Constellation Matrix (`constellation`)
Distributes nodes evenly over a 3D sphere using the Golden Ratio / Fibonacci spiral formula to maximize visual clarity without overlapping nodes.

---

## 4. Arched Edge Connections & Real-Time Light Packets

Connections between microservices are drawn using 3D parabolic curves:
```ts
const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
mid.y += Math.max(4.5, start.distanceTo(end) * 0.28);
const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
```
Glowing data packets continuously travel along the curves from source to target. When the user clicks **"Simulate Packet Surge"**, packet speeds quadruple and flash brightly to visualize high-throughput traffic spikes.

---

## 5. Raycasting & Holographic HUD

Using Three.js `Raycaster`, hovering over any 3D node calculates the 2D screen coordinate projection:
```ts
const screenPosition = nodeVector.clone().project(camera);
```
A cyberpunk HUD appears above the hovered service showing:
- Node type & operational status (pulsing emerald indicator).
- P95 latency (e.g. `18ms`) & SLA uptime (e.g. `99.9%`).
- Discovered tech stack pills.
- Clicking the node focuses the camera and inspects its endpoints in the right-side Node Inspector.

---

## 6. Performance & Lifecycle Optimization

- **Zero Deprecation Warnings**: Uses `performance.now() * 0.001` instead of deprecated `THREE.Clock`.
- **Dynamic Import with `ssr: false`**: Next.js only loads Three.js on the client side, maintaining fast initial server-side page loads.
- **Garbage Collection**: Automatically disposes renderers, geometries, materials, and removes DOM canvases on component unmount to prevent WebGL memory leaks.
