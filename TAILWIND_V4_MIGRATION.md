# Tailwind CSS v4 Migration - Waiting for Plugin Support

**Status**: ⏳ **Waiting for `tw-colors` v4 compatibility**  
**Last Updated**: 2025-12-08

## Why We're Waiting

This project uses the `tw-colors` plugin to manage 24+ dynamic color themes (amber, teal, mint, tomato, etc. with dark variants). Tailwind CSS v4 introduces a new CSS-first configuration system that requires plugin updates.

**Current Blocker**: The `tw-colors` plugin needs to be updated to support Tailwind v4's new architecture.

## What to Monitor

### 1. tw-colors Package
- **GitHub**: https://github.com/L-Blondy/tw-colors
  - Watch for issues/PRs mentioning "v4" or "Tailwind 4"
  - Check for new releases
- **npm**: https://www.npmjs.com/package/tw-colors
  - Monitor version updates
  - Look for changelog entries about v4 support

### 2. Other Affected Plugins
- ✅ **`@tailwindcss/forms`**: Has v4 support
- ❌ **`tailwindcss-animated`**: Not compatible - replace with `tailwind-animate` or `tw-animate-css`
- ⏳ **`tw-colors`**: Waiting for v4 support

## Migration Checklist (When Ready)

When `tw-colors` v4 support is available, follow these steps:

### Phase 1: Dependencies
- [ ] Update `tailwindcss` to `^4.0.0` (or latest v4.x)
- [ ] Add `@tailwindcss/postcss` package
- [ ] Update `tw-colors` to v4-compatible version
- [ ] Replace `tailwindcss-animated` with `tailwind-animate` or `tw-animate-css`
- [ ] Update `@tailwindcss/forms` to latest v4 version

### Phase 2: Configuration Files
- [ ] Update `postcss.config.cjs`:
  ```javascript
  module.exports = {
    plugins: [
      require("postcss-advanced-variables"),
      require("@tailwindcss/postcss"),
    ],
  };
  ```
  - Remove: `autoprefixer`, `postcss-nested`, `tailwindcss/nesting`
  - Keep: `postcss-advanced-variables` (for @for loops)

- [ ] Update `src/oryx.css`:
  ```css
  @import "tailwindcss";
  
  /* Keep existing @for loops and custom styles */
  ```
  - Replace `@tailwind` directives with single `@import "tailwindcss";`

- [ ] Review `tailwind.config.js`:
  - Check if `tw-colors` v4 still uses JavaScript config
  - OR migrate themes to CSS `@theme` blocks (depending on v4 version)

### Phase 3: Testing
- [ ] Run `npm install`
- [ ] Run `npm run dev` - verify development server works
- [ ] Test all 24+ color themes using `SelectTheme` component
- [ ] Verify all animations work (accordion, popover, navigation, etc.)
- [ ] Test responsive design
- [ ] Run `npm run build` - verify production build
- [ ] Run `npm run lint` - ensure no new errors

### Phase 4: Verification
- [ ] Compare build times (should be 3.5x faster)
- [ ] Verify bundle size (should be 10-15% smaller)
- [ ] Test dark mode variants
- [ ] Test size variants using `SelectSize` component
- [ ] Cross-browser testing

## Expected Benefits (Post-Migration)

- ⚡ **3.5x faster** full builds
- ⚡ **100x faster** incremental builds (microseconds)
- 📦 **10-15% smaller** bundle sizes
- 🎨 Native CSS variables for theming
- 🏗️ Built-in container queries (no plugin needed)
- 🚀 Modern CSS features (cascade layers, @property, color-mix)

## Current Configuration

**Tailwind CSS**: v3.3.2  
**Key Plugins**:
- `tw-colors@^1.2.6` - Multi-theme support ⏳
- `tailwindcss-animated@^1.0.1` - Animations ❌
- `@tailwindcss/forms@^0.5.3` - Form styling ✅

**Custom Features**:
- 24+ Radix UI color themes
- Custom animations (slideUpAndFade, overlayShow, etc.)
- Dynamic size system (2, 3, 4 size variants)
- PostCSS advanced variables for @for loops

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/v4-beta)
- [tw-colors GitHub Issues](https://github.com/L-Blondy/tw-colors/issues)
- [Migration Implementation Plan](file:///.gemini/antigravity/brain/6d604d1a-13d1-406b-87e9-0193af5f621e/implementation_plan.md)

## Notes

- Consider subscribing to the `tw-colors` repository for notifications
- Check periodically (monthly) for updates
- If migration is urgent, manual CSS variable conversion is possible but time-consuming
- Alternative: Create custom v4 plugin to replicate `tw-colors` functionality

---

**Action Required**: Check for `tw-colors` v4 updates periodically. When available, follow the migration checklist above.
