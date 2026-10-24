const fs = require('fs');
const THREE = require('three');

// Let's test attaching a mesh to Head bone in Three.js
// By inspecting Head's world scale
const buf = fs.readFileSync('public/models/casual-man-rigged.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + jsonLen).toString('utf8');
const gltf = JSON.parse(jsonStr);

// In gltf, node 55 is Armature with scale [0.01, 0.01, 0.01]
// So inside Head, the world scale is 0.01.
// If an object inside Head has scale [100, 100, 100], its world scale is 1.0 (meters)!
console.log('Armature scale:', gltf.nodes[55].scale);
console.log('Head translation relative to neck:', gltf.nodes[29].translation);
console.log('head_end (top of skull) relative to Head:', gltf.nodes[27].translation);
