const fs = require('fs')
const path = require('path')

// console.log(process.argv[2]);
// console.log(process.argv[3]);

let keyboard_info = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
let kps = fs.readFileSync(process.argv[3], 'utf-8');

if(!keyboard_info.languages) {
  // console.log('- no languages');
  process.exit(99);
}

if(Array.isArray(keyboard_info.languages)) {
  // console.log('- languages is Array');
  process.exit(99);
}

let fontFilenames = [];
let oskFontFilenames = [];
let hasFont = false;
for(const lang of Object.keys(keyboard_info.languages)) {
  if(keyboard_info.languages[lang].font) {
    hasFont = true;
    if(Array.isArray(keyboard_info.languages[lang].font.source))
      fontFilenames.push(...keyboard_info.languages[lang].font.source);
    else
      fontFilenames.push(keyboard_info.languages[lang].font.source);
    // console.log('+ lang.font!');
  }
  if(keyboard_info.languages[lang].oskFont) {
    hasFont = true;
    if(Array.isArray(keyboard_info.languages[lang].oskFont.source))
      oskFontFilenames.push(...keyboard_info.languages[lang].oskFont.source);
    else
      oskFontFilenames.push(keyboard_info.languages[lang].oskFont.source);
    // console.log('+ lang.font!');
  }
}

if(!hasFont) {
  // console.log('- no fonts');
  process.exit(99);
}

// console.log(fontFilenames);
fontFilenames = [...new Set(fontFilenames)];
oskFontFilenames = [...new Set(oskFontFilenames)];

// Collect fonts from kps
let kpsFontFilenames = [];
let kpsOskFontFilenames = [];

const displayFonts = kps.matchAll(/<DisplayFont>([^<]+)/g);
for(const match of displayFonts) {
  const displayFont = path.basename(match[1]);
  kpsFontFilenames.push(displayFont);
  // console.log(displayFont);
}
// console.log('-----------')
const oskFonts = kps.matchAll(/<OSKFont>([^<]+)/g);
for(const match of oskFonts) {
  const oskFont = path.basename(match[1]);
  kpsOskFontFilenames.push(oskFont);
  // console.log(oskFont);
}

kpsFontFilenames = [...new Set(kpsFontFilenames)];
kpsOskFontFilenames = [...new Set(kpsOskFontFilenames)];

// COMPARE

// console.dir(DisplayFonts);

let missingFont = [];
for(let font of fontFilenames) {
  if(!kpsFontFilenames.includes(font)) {
    missingFont.push(font);
  }
}

let missingOskFont = [];
for(let font of oskFontFilenames) {
  if(!kpsOskFontFilenames.includes(font)) {
    missingOskFont.push(font);
  }
}

if(missingFont.length == 0 && missingOskFont.length == 0) {
  // console.log(' - all fonts present');
  process.exit(99);
}

console.log(JSON.stringify({fonts:missingFont, oskFonts:missingOskFont}));
// console.log(JSON.stringify(keyboard_info.languages));

// console.dir(keyboard_info);
/*
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

fs.writeFileSync(process.argv[2], data, 'utf-8');*/