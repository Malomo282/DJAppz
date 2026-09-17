// Hero image positioning configuration
// Adjust these values to fine-tune how the hero image displays
// X: 0 = left, 50 = center, 100 = right
// Y: 0 = top, 50 = center, 100 = bottom
// Scale: 0.8 = 80% zoom, 1 = 100% (normal), 1.5 = 150% zoom

export const HERO_IMAGE_CONFIG = {
  x: 50,      // Horizontal position (0-100%)
  y: 40,      // Vertical position - moved up 10% (0-100%)
  scale: 1.3, // Zoom level - 30% zoom to show face/expression
};

// Quick adjustment guide:
// If image is too dark: increase Y value (move down)
// If image is too light: decrease Y value (move up)
// If image is cut off: decrease scale value
// If image shows too much empty space: increase scale value
// If image is off to the side: adjust X value towards 50
