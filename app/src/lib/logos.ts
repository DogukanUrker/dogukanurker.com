// raw svg path data for the company logos. shared by the react glyphs in
// components/brand.tsx and the server-rendered share image
// (app/opengraph-image.tsx), which can't import client components.

export const sensityLogo = {
  viewBox: "0 0 200 200",
  // width / height of the viewBox
  ratio: 1,
  // the center square
  core: "M122 130H71.5C70.67 130 70 129.33 70 128.5V77.9999C70 73.5799 73.58 69.9999 78 69.9999H128.5C129.33 69.9999 130 70.6699 130 71.4999V122C130 126.42 126.42 130 122 130Z",
  // the two corner brackets (they move on hover)
  topLeft:
    "M38 140H8C3.58 140 0 136.42 0 132V7.99994C0 3.57994 3.58 -6.10352e-05 8 -6.10352e-05H132C136.42 -6.10352e-05 140 3.57994 140 7.99994V37.9999C140 39.0999 139.1 39.9999 138 39.9999H44C41.79 39.9999 40 41.7899 40 43.9999V138C40 139.1 39.1 140 38 140Z",
  bottomRight:
    "M162 59.9999H192C196.42 59.9999 200 63.5799 200 67.9999V192C200 196.42 196.42 200 192 200H68C63.58 200 60 196.42 60 192V162C60 160.9 60.9 160 62 160H156C158.21 160 160 158.21 160 156V61.9999C160 60.8999 160.89 59.9999 162 59.9999Z",
};
