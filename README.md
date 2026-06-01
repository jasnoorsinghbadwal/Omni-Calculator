# Omni Calculator 🧮
> **A multi-functional, high-fidelity computational platform built with a premium glassmorphic interface.**

Omni Calculator is a comprehensive, responsive calculation web application designed to replace basic, single-purpose calculators. It packs seven dedicated computational systems into a single unified tab-based web app, styled with rich dark backgrounds, glowing border highlights, fluid page transitions, and a mobile-friendly layout.

---

## ✨ Features

### 1. 🎛️ Standard & Scientific Calculator
- **Keyboard Support**: Full integration with physical keyboards (numbers, operators, enter, backspace, escape).
- **Advanced Math Functions**: Supports square roots, exponentiation ($x^y$), trigonometric functions ($\sin$, $\cos$, $\tan$), percentages, and parentheses levels.
- **Log History**: Features a scrollable sidebar log that stores previous calculations. Clicking on any past entry restores the equation directly into the input buffer.

### 2. ⏳ Age & Astrology Ticker
- **Live Ticker**: Input a birthdate and watch exact age increment live in real-time, down to years, months, weeks, days, hours, minutes, seconds, and milliseconds.
- **Zodiac Insights**: Calculates western astrology signs (Zodiac) and personality traits.
- **Chinese Element Zodiac**: Computes Chinese birth elements (e.g., Earth Tiger, Water Monkey) and descriptions based on traditional lunar-solar cycles.

### 3. 📅 Date Duration & Offset Calculator
- **Interval Mode**: Calculates the precise difference between two dates (expressing the interval in years, months, weeks, days, and total cumulative days).
- **Date Offset Mode**: Input a starting date, select a duration (years/months/weeks/days), choose an operation (add/subtract), and instantly compute the resulting calendar date.

### 4. 🌍 Time Zone & City Clocks
- **Local Clock**: High-fidelity running clock showing current local day, date, and time.
- **World Cities**: Search and pin multiple international cities (e.g., London, Tokyo, New York, Sydney) to a dynamic dashboard.
- **Live Comparison**: Displays running times for all pinned cities, complete with timezone offset labels relative to your current local time.

### 5. 💸 Tip & Split Calculator
- **Quick Gratuities**: Sliders and quick-buttons to instantly set tip percentages.
- **Bill Splitting**: Enter the total bill and number of patrons to instantly divide the bill.
- **Detailed Breakdown**: Shows tip amount, total cost, tip per person, and total per person with clean decimal alignments.

### 6. ⚖️ BMI Gauge Analyzer
- **Dual Units**: Metric (kg/cm) and Imperial (lbs/inches) unit toggles.
- **Dynamic Gauge**: Generates a gorgeous visual color-coded arc index indicating BMI ranges (Underweight, Normal, Overweight, Obese).
- **Health Assessment**: Provides tailored text descriptions of BMI scores to assist wellness analysis.

### 7. 📈 Compound Interest Scheduler
- **Wealth Planner**: Calculate interest gains based on initial deposits, interest rates, monthly compounding contributions, and periods.
- **Amortization Table**: Dynamically outputs a clean table detailing year-by-year totals, cumulative interest earned, and final account values.

---

## 🛠️ Architecture & Tech Stack

- **Core Structure**: Semantic HTML5 document sections equipped with unique test IDs.
- **Styling Layout**: Pure Vanilla CSS3 using custom CSS variables (for dark/light support), Flexbox, CSS Grid systems, absolute z-index layouts, and CSS keyframe transitions.
- **Engine Logic**: Native modular vanilla JavaScript utilizing DOM selection, standard event tracking, calendar math, real-time timezone lookups, and local calculations.
- **Visual Palette**: Curated dark modes featuring glowing purple-to-blue gradients (`#a855f7` and `#6366f1`), translucent card layers, and micro-hover states.

---

## 📱 Mobile Responsiveness & Polish

- **Adaptive Dashboard**: On desktop, features a dual layout with sidebar/log controls. On mobile viewports, sidebars adaptively transition to full-width or slide-in menus to avoid horizontal overflow.
- **Touch-optimized Keys**: Calculation keys are spaced and sized for comfortable finger-tapping, with tactile visual feedback states.
- **No Stretched Grids**: Ensures grid alignments remain uniform on various aspect ratios without shrinking controls.

---

## 🚀 Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/jasnoorsinghbadwal/Omni-Calculator.git
   ```
2. Open `index.html` in any modern web browser.
3. No build tools or package dependencies are required to run locally!
