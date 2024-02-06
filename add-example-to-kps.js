const fs = require('fs')
const path = require('path')

let keyboard_info = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
let kps = fs.readFileSync(process.argv[3], 'utf-8');

const nd = kps.indexOf('<Examples>');
if(nd > 0) {
  // already processed
  process.exit(0);
}

if(!keyboard_info.languages) {
  // console.log('- no languages');
  process.exit(99);
}

if(Array.isArray(keyboard_info.languages)) {
  // console.log('- languages is Array');
  process.exit(99);
}

let examples = {};
let hasExample = false;
for(const lang of Object.keys(keyboard_info.languages)) {
  if(keyboard_info.languages[lang].example) {
    hasExample = true;
    examples[lang] = keyboard_info.languages[lang].example;
  }
}

if(!hasExample) {
  // console.log('- no fonts');
  process.exit(99);
}

console.log(JSON.stringify(examples));
console.log('');
let xml = '    <Examples>\n';

for(const lang of Object.keys(examples)) {
  const ex = examples[lang];
  ex.keys = old_keyboard_info_keys_to_kps_keys(ex.keys);
  ex.note = ex.note ?? '';
  ex.text = ex.text ?? '';
  xml += `        <Example ID="${lang}" Keys=${JSON.stringify(ex.keys)} Text=${JSON.stringify(ex.text)} Note=${JSON.stringify(ex.note)} />\n`;
}
xml += '      </Examples>\n';

console.log(xml);

function old_keyboard_info_keys_to_kps_keys(keys) {
  let res = '';
  for(let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if(key == '[') {
      i++;
      if(keys[i] != '[') {
        // modifier game
        let n = keys.indexOf(']', i);
        if(n < 0) {
          console.log(`${process.argv[2]}: This example seems to be malformed`);
          process.exit(0);
        }
        let mods = keys.substring(i, n-1);
        key = keys.substring(n-1, n);
        i = n;
        for(let j = 0; j < mods.length; j++) {
          switch(mods[j]) {
            case 'C': res += 'ctrl+'; break;
            case 'A': res += 'alt+'; break;
            case 'S': res += 'shift+'; break;
            default:
          }
        }
      }
    }
    if(key == ' ') res += 'space ';
    else if(key == '+') res += 'plus ';
    else res += key + ' ';
  }
  return res.trim();
}

// INJECT

// console.dir(DisplayFonts);

// console.log(JSON.stringify({fonts:missingFont, oskFonts:missingOskFont}));
// console.log(JSON.stringify(keyboard_info.languages));

// console.dir(keyboard_info);

const n = kps.indexOf('  </Keyboard>');
if(n < 0) {
  console.error('could not find </Keyboard>');
  process.exit(3);
}

kps = kps.substring(0, n)+xml+kps.substring(n);

fs.writeFileSync(process.argv[3], kps, 'utf-8');
