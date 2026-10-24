const fs = require('fs');

const buf = fs.readFileSync('public/models/casual-man-rigged.glb');
const str = buf.toString('latin1');
const re = /"name":"([^"]+)"/g;
let m;
const names = new Set();
while ((m = re.exec(str)) !== null) {
  if (/head|neck|spine|arm|leg|bone/i.test(m[1])) {
    names.add(m[1]);
  }
}
console.log('Found bones:', Array.from(names));
