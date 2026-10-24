const fs = require('fs');
const buf = fs.readFileSync('public/models/casual-man-rigged.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + jsonLen).toString('utf8');
const gltf = JSON.parse(jsonStr);

gltf.nodes.forEach((n, idx) => {
  if (n.name && /armature|root|neck|head/i.test(n.name)) {
    console.log(idx, n.name, 'scale:', n.scale, 'trans:', n.translation);
  }
});
