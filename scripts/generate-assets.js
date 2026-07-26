/**
 * Generate placeholder PNG assets for ReadWell.
 * Produces valid PNG files using only zlib (no native deps).
 * Run with: node scripts/generate-assets.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');

// Brand color: #0D9488 (teal)
const R = 0x0d, G = 0x94, B = 0x88;

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePNG(width, height, draw) {
  // PNG signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type: RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  // Raw pixel data with per-row filter byte (0 = None)
  const rowBytes = width * 4;
  const raw = Buffer.alloc((rowBytes + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (rowBytes + 1)] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = draw(x, y, width, height);
      const off = y * (rowBytes + 1) + 1 + x * 4;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
      raw[off + 3] = a;
    }
  }
  const idatData = zlib.deflateSync(raw);

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Drawing helpers
const blend = (fg, bg, a) => Math.round(fg * a + bg * (1 - a));

function solidTealBg(x, y, w, h) {
  // Solid teal background
  return [R, G, B, 255];
}

function centeredBookIcon(x, y, w, h) {
  // Solid teal background with a simple book glyph in white center
  const cx = w / 2, cy = h / 2;
  const scale = w / 1024; // design at 1024
  // Book "spine" + two pages drawn as rectangles
  const spineHalfW = 60 * scale;
  const pageTop = cy - 180 * scale;
  const pageBot = cy + 180 * scale;
  const pageW = 200 * scale;

  // Left page
  const inLeftPage =
    x >= cx - spineHalfW - pageW && x <= cx - spineHalfW &&
    y >= pageTop && y <= pageBot;
  // Right page
  const inRightPage =
    x >= cx + spineHalfW && x <= cx + spineHalfW + pageW &&
    y >= pageTop && y <= pageBot;
  // Spine
  const inSpine =
    x >= cx - spineHalfW && x <= cx + spineHalfW &&
    y >= pageTop - 10 * scale && y <= pageBot + 10 * scale;

  if (inLeftPage || inRightPage || inSpine) {
    return [255, 255, 255, 255];
  }
  return [R, G, B, 255];
}

function roundedSquare(x, y, w, h, radius) {
  const cx = w / 2, cy = h / 2;
  const half = Math.min(w, h) / 2;
  // Square bounds
  const sx = cx - half, sy = cy - half, ex = cx + half, ey = cy + half;
  if (x < sx || x > ex || y < sy || y > ey) return false;
  // Check corners
  const rx = Math.min(radius, half);
  const corners = [
    [sx + rx, sy + rx, sx, sy],
    [ex - rx, sy + rx, ex, sy],
    [sx + rx, ey - rx, sx, ey],
    [ex - rx, ey - rx, ex, ey],
  ];
  for (const [ccx, ccy, bx, by] of corners) {
    const inCornerX = (bx < ccx ? x < ccx : x > ccx);
    const inCornerY = (by < ccy ? y < ccy : y > ccy);
    if (inCornerX && inCornerY) {
      const dx = x - ccx, dy = y - ccy;
      if (dx * dx + dy * dy > rx * rx) return false;
    }
  }
  return true;
}

function adaptiveIcon(x, y, w, h) {
  // Foreground: white rounded-square-ish area with book glyph in teal
  const cx = w / 2, cy = h / 2;
  const scale = w / 1024;
  // White circle area in center
  const r = Math.min(w, h) * 0.34;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist <= r) {
    // Inside white disc: draw teal book
    const spineHalfW = 50 * scale;
    const pageTop = cy - 150 * scale;
    const pageBot = cy + 150 * scale;
    const pageW = 170 * scale;

    const inLeftPage = x >= cx - spineHalfW - pageW && x <= cx - spineHalfW && y >= pageTop && y <= pageBot;
    const inRightPage = x >= cx + spineHalfW && x <= cx + spineHalfW + pageW && y >= pageTop && y <= pageBot;
    const inSpine = x >= cx - spineHalfW && x <= cx + spineHalfW && y >= pageTop - 10 * scale && y <= pageBot + 10 * scale;

    if (inLeftPage || inRightPage || inSpine) return [R, G, B, 255];
    return [255, 255, 255, 255];
  }
  // Outside disc: transparent (adaptive icon foreground)
  return [0, 0, 0, 0];
}

function favicon(x, y, w, h) {
  // Teal background with white book
  return centeredBookIcon(x, y, w, h);
}

const assets = [
  { name: 'icon.png', w: 1024, h: 1024, draw: centeredBookIcon },
  { name: 'splash-icon.png', w: 512, h: 512, draw: centeredBookIcon },
  { name: 'android-icon-foreground.png', w: 1024, h: 1024, draw: adaptiveIcon },
  { name: 'favicon.png', w: 48, h: 48, draw: favicon },
];

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

for (const a of assets) {
  const png = makePNG(a.w, a.h, a.draw);
  const out = path.join(ASSETS_DIR, a.name);
  fs.writeFileSync(out, png);
  console.log(`Generated ${out} (${a.w}x${a.h}, ${png.length} bytes)`);
}

console.log('Done.');
