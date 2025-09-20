# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a mobile-first educational website about red panda subspecies (小熊貓世界), comparing Chinese Red Pandas and Himalayan Red Pandas. The site is built as a static website optimized for GitHub Pages deployment with interactive features and comprehensive mobile testing.

## Development Commands

### Local Development Server
```bash
# NPM Scripts (recommended)
npm start                           # Start development server
npm run dev                         # Start with mobile access (0.0.0.0)

# Direct Python commands
python scripts/server.py            # Port 8000, auto-opens browser
python scripts/server.py --port 3000    # Custom port
python scripts/server.py --host 0.0.0.0 # Allow mobile device connections
python scripts/server.py --no-browser   # Don't auto-open browser

# Quick start scripts
./scripts/start.sh          # Linux/Mac
scripts/start.bat          # Windows
```

### Testing
```bash
npm test                    # Run all Playwright tests
npm run test:mobile        # Mobile Chrome + Safari only
npm run test:mobile-only   # Mobile Chrome only
npm run test:headed        # Run with visible browser
npm run test:ui            # Interactive test UI
npm run test:debug         # Debug mode
npm run test:report        # Show test report
```

### Data Validation
```bash
npm run validate           # Validate JSON data files
python scripts/test_json.py   # Direct validation
```

## Architecture & Structure

### Component System
The site uses a **componentized navigation system**:
- `components/navbar.html` - Shared navigation bar template
- `assets/js/navbar.js` - Dynamic loader with page highlighting
- All pages use `<div id="navbar-container"></div>` for injection
- Navigation is fixed at bottom on mobile with `navbar-fixed` CSS class

### Data Architecture
**JSON-driven content system** for easy maintenance:
- `data/subspecies.json` - Complete red panda subspecies data
- `data/quiz.json` - Interactive quiz questions and scoring
- `data/animals.json` - Species comparison data
- All content loaded via `fetch()` API for GitHub Pages compatibility

### Page Structure
Core pages follow consistent patterns:
- `index.html` - Homepage with feature cards and hero section
- `compare.html` - Subspecies comparison with tabbed interface
- `species-comparison.html` - Cross-species comparison (red panda vs others)
- `quiz.html` - Interactive 8-question quiz system
- `gallery.html` - Image gallery
- `map.html` - Distribution maps

### CSS System
**Hybrid Tailwind + Custom approach**:
- Tailwind CSS via CDN for utility classes
- `assets/css/styles.css` - Custom components and animations
- Mobile-first responsive design with fixed bottom navigation
- Dark mode support throughout
- Custom animations and transitions

### Mobile-First Design
**Critical mobile optimizations**:
- Fixed bottom navigation (`position: fixed; bottom: 0`)
- `body { padding-bottom: 90px }` prevents content overlap
- Safari safe area support with `env(safe-area-inset-bottom)`
- Comprehensive Playwright mobile testing across devices

## Testing Strategy

**Playwright Configuration**:
- Tests run against `http://localhost:8000` with auto-server startup
- Mobile devices: Pixel 5, iPhone 12, Galaxy S8, iPad Pro
- Desktop browsers: Chrome, Firefox, Safari
- Test categories: homepage, navigation, functionality, performance

**Test Server**: Playwright automatically starts `python3 server.py` before tests

## Key Technical Details

### Navigation System Implementation
```javascript
// Page mapping for current page detection
const PAGE_MAP = {
    'index.html': 'home',
    'compare.html': 'compare',
    'species-comparison.html': 'species',
    'quiz.html': 'quiz',
    'gallery.html': 'gallery'
};
```

### JSON Data Loading Pattern
All pages use consistent async data loading:
```javascript
async function loadData() {
    const response = await fetch('./data/filename.json');
    const data = await response.json();
    // Process and render data
}
```

### Mobile Navigation CSS
```css
.navbar-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(248, 247, 246, 0.95);
    backdrop-filter: blur(12px);
}
```

## File Organization

### Current Structure
```
/
├── index.html                 # Main entry page (root level)
├── server.py                  # Development server (root level for resource access)
├── package.json              # NPM configuration
├── README.md & CLAUDE.md      # Documentation
├── pages/                     # All other HTML pages
│   ├── compare.html
│   ├── quiz.html
│   ├── species-comparison.html
│   ├── gallery.html
│   └── map.html
├── archive/                   # Historical files and backups
├── config/                    # Configuration files
│   ├── playwright.config.js
│   └── mcp-config.json
├── scripts/                   # Development tools
│   ├── test_json.py
│   ├── start.sh & start.bat
├── assets/                    # CSS and JS resources
├── components/                # Shared components
├── data/                      # JSON data files
├── images/                    # Image resources
└── tests/                     # Test files
```

### Access Patterns
- Main page: `http://localhost:8000/`
- Other pages: `http://localhost:8000/pages/quiz.html`
- Assets: `http://localhost:8000/assets/css/styles.css`
- Data: `http://localhost:8000/data/quiz.json`

### Component Updates
When modifying navigation:
1. Update `components/navbar.html` for structure changes
2. Update `assets/js/navbar.js` for logic changes
3. Test across all pages as changes affect entire site

### Data Modifications
When updating content:
1. Modify JSON files in `data/` directory
2. Run `python test_json.py` to validate structure
3. Test dynamic loading on affected pages

### Mobile Testing Workflow
1. Start server with `python server.py --host 0.0.0.0`
2. Test on physical devices via network IP
3. Run Playwright mobile tests: `npm run test:mobile`
4. Validate fixed navigation behavior across pages

## Deployment

**GitHub Pages Ready**: Static site with no build process required. All assets are self-contained and use CDN resources (Tailwind CSS, Google Fonts).

## Browser Support
- Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- Optimized for mobile Safari and Chrome
- Progressive enhancement approach