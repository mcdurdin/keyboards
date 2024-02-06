const fs = require('fs')

// console.log(process.argv[2]);
// console.log(process.argv[3]);

let data = fs.readFileSync(process.argv[2], 'utf-8');
const p = JSON.parse(process.argv[3]);

const n = data.indexOf('</Package>');
if(n < 0) {
  console.error('could not find </Package>');
  process.exit(3);
}

const nd = data.indexOf('<RelatedPackages>');
if(nd > 0) {
  // already present
  process.exit(0);
}

let sub = '  <RelatedPackages>\n';
for(let rel of Object.keys(p)) {
  sub += `    <RelatedPackage ID="${rel}"`;
  if(p[rel].deprecates) sub += ' Relationship="deprecates"';
  sub += ' />\n';
}
sub += '  </RelatedPackages>\n';
data = data.substring(0, n)+sub+data.substring(n);

fs.writeFileSync(process.argv[2], data, 'utf-8');