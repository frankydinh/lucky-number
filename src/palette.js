// A palette of 50 visually distinct colors, shared by race lanes and wheel
// segments so entries rarely repeat their colour.
//
// Hues are spread with the golden angle (~137.5°) so consecutive entries —
// i.e. neighbouring lanes/segments — always land far apart on the colour
// wheel and never look alike. Small, deterministic saturation/lightness
// variation keeps same-family hues distinguishable while staying dark enough
// for white text (used on the wheel).
export const RACER_COLORS = Array.from({ length: 50 }, (_, i) => {
  const hue = Math.round((i * 137.508) % 360);
  const saturation = 60 + (i % 2) * 12; // 60% or 72%
  const lightness = 44 + (i % 3) * 6; // 44%, 50% or 56%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
});
