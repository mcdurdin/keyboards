const fs = require('fs')

// console.log(process.argv[2]);
// console.log(process.argv[3]);

let data = fs.readFileSync(process.argv[2], 'utf-8');

const n = data.indexOf('  </Info>');
if(n < 0) {
  console.error('could not find </Info>');
  process.exit(3);
}

const nd = data.indexOf('<Description>');
if(nd > data.indexOf('<Info>') && nd < n) {
  // already in the <Info> section
  process.exit(0);
}

data = data.substring(0, n)+'    <Description>'+process.argv[3]+'</Description>\n'+data.substring(n);

fs.writeFileSync(process.argv[2], data, 'utf-8');