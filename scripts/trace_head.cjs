const fs = require('fs');
const THREE = require('three');



const buf = fs.readFileSync('public/models/casual-man-rigged.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + jsonLen).toString('utf8');
const gltf = JSON.parse(jsonStr);




console.log('Armature scale:', gltf.nodes[55].scale);
console.log('Head translation relative to neck:', gltf.nodes[29].translation);
console.log('head_end (top of skull) relative to Head:', gltf.nodes[27].translation);
