// Script to check contrast ratios for all themes
const fs = require('fs');

// Helper function to parse RGB values from CSS color strings
function parseColor(colorString) {
  const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3])
  };
}

// Calculate relative luminance
function getLuminance(color) {
  const { r, g, b } = color;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Read the global.scss file
const scss = fs.readFileSync('global.scss', 'utf8');

// Extract theme definitions
const themeRegex = /body\.theme-([a-z0-9-]+)\s*{([^}]+)}/g;
const colorVarRegex = /--color-([a-z0-9-]+):\s*(rgba?\([^)]+\))/g;

// First, extract all color definitions
const colors = {};
let colorMatch;
while ((colorMatch = colorVarRegex.exec(scss)) !== null) {
  colors[`--color-${colorMatch[1]}`] = colorMatch[2];
}

// Function to resolve color variable references
function resolveColor(value, colors) {
  if (value.startsWith('rgba') || value.startsWith('rgb')) {
    return value;
  }
  if (value.startsWith('var(')) {
    const varName = value.match(/var\((--[^)]+)\)/)[1];
    return colors[varName] || value;
  }
  return value;
}

// Extract and analyze themes
const themes = [];
let match;
while ((match = themeRegex.exec(scss)) !== null) {
  const themeName = match[1];
  const themeContent = match[2];

  // Extract theme variables
  const themeVars = {};
  const varRegex = /--(theme-[a-z-]+):\s*([^;]+)/g;
  let varMatch;
  while ((varMatch = varRegex.exec(themeContent)) !== null) {
    themeVars[varMatch[1]] = varMatch[2].trim();
  }

  // Resolve colors
  const background = resolveColor(themeVars['theme-background'], colors);
  const text = resolveColor(themeVars['theme-text'], colors);
  const modalBg = resolveColor(themeVars['theme-background-modal'], colors);
  const inputBg = resolveColor(themeVars['theme-background-input'], colors);
  const button = resolveColor(themeVars['theme-button'], colors);
  const buttonText = resolveColor(themeVars['theme-button-text'], colors);
  const buttonBg = resolveColor(themeVars['theme-button-background'], colors);

  // Parse colors
  const bgColor = parseColor(background);
  const textColor = parseColor(text);
  const modalBgColor = parseColor(modalBg);
  const inputBgColor = parseColor(inputBg);
  const buttonColor = parseColor(button);
  const buttonTextColor = parseColor(buttonText);
  const buttonBgColor = parseColor(buttonBg);

  // Calculate contrast ratios
  const contrasts = {};
  if (bgColor && textColor) {
    contrasts.textOnBg = getContrastRatio(textColor, bgColor);
  }
  if (modalBgColor && textColor) {
    contrasts.textOnModal = getContrastRatio(textColor, modalBgColor);
  }
  if (inputBgColor && textColor) {
    contrasts.textOnInput = getContrastRatio(textColor, inputBgColor);
  }
  if (buttonBgColor && buttonTextColor) {
    contrasts.buttonTextOnButton = getContrastRatio(buttonTextColor, buttonBgColor);
  }
  if (bgColor && buttonColor) {
    contrasts.buttonOnBg = getContrastRatio(buttonColor, bgColor);
  }

  themes.push({
    name: themeName,
    contrasts
  });
}

// Sort themes by name
themes.sort((a, b) => a.name.localeCompare(b.name));

// WCAG guidelines:
// AA: 4.5:1 for normal text, 3:1 for large text
// AAA: 7:1 for normal text, 4.5:1 for large text

console.log('Theme Contrast Analysis');
console.log('========================');
console.log('WCAG AA requires 4.5:1 for normal text');
console.log('WCAG AAA requires 7:1 for normal text\n');

themes.forEach(theme => {
  console.log(`\n${theme.name.toUpperCase()}`);
  console.log('-'.repeat(40));

  Object.entries(theme.contrasts).forEach(([key, ratio]) => {
    if (ratio) {
      const rounded = ratio.toFixed(2);
      let status = '❌ FAIL';
      if (ratio >= 7) {
        status = '✅ AAA';
      } else if (ratio >= 4.5) {
        status = '🟡 AA';
      } else if (ratio >= 3) {
        status = '⚠️  Low (OK for large text)';
      }

      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());

      console.log(`  ${label}: ${rounded}:1 ${status}`);
    }
  });
});

// Summary of problematic themes
console.log('\n\nTHEMES WITH CONTRAST ISSUES');
console.log('============================');

themes.forEach(theme => {
  const issues = Object.entries(theme.contrasts).filter(([key, ratio]) =>
    ratio && ratio < 4.5
  );

  if (issues.length > 0) {
    console.log(`\n${theme.name}:`);
    issues.forEach(([key, ratio]) => {
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      console.log(`  - ${label}: ${ratio.toFixed(2)}:1`);
    });
  }
});
