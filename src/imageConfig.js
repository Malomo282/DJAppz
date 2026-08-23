// Image positioning configuration for service cards
// Adjust these values to fine-tune how images display in service cards
// X: 0 = left, 50 = center, 100 = right
// Y: 0 = top, 50 = center, 100 = bottom
// Scale: 0.5 = 50% zoom, 1 = 100% (normal), 2 = 200% zoom

export const IMAGE_POSITIONS = {
  private: {
    x: 50,      // Horizontal position (0-100%)
    y: 40,      // Vertical position - slightly towards top (0-100%)
    scale: 1.1, // Slight zoom to fill card nicely
  },
  wedding: {
    x: 50,      // Center horizontally
    y: 45,      // Slightly above center for better framing
    scale: 1.05, // Slight zoom
  },
  corporate: {
    x: 50,      // Center
    y: 50,      // Center vertically
    scale: 1,   // Full size
  },
  club: {
    x: 50,      // Center
    y: 55,      // Slightly below center to show crowd energy
    scale: 1.15, // Zoom in slightly to emphasize crowd
  },
};

// Quick adjustment guide:
// If image is too dark: increase Y value (move down)
// If image is too light: decrease Y value (move up)
// If image is cut off: decrease scale value
// If image shows too much empty space: increase scale value
// If image is off to the side: adjust X value towards 50
