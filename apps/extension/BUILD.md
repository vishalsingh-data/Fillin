# Building for Chrome Web Store

To create a production-ready build of the Fillin extension for submission to the Chrome Web Store, follow these exact steps:

1. **Navigate to the extension directory:**
   ```bash
   cd apps/extension
   ```

2. **Run the production build:**
   ```bash
   pnpm run build
   ```
   *This command runs `vite build && vite build -c vite.content.config.ts`. It compiles the popup UI, background service worker, and the content script (in IIFE format) into a clean, unminified-but-optimized `dist` folder.*

3. **Verify the `dist/` directory:**
   Ensure your `dist/` directory contains:
   - `manifest.json`
   - `icon.jpg`
   - `background.js`
   - `content.js`
   - `src/popup/index.html` (and associated assets)

4. **Create the distribution archive:**
   Compress the **contents** of the `dist/` directory into a `.zip` file. 
   *(Note: Do not zip the `dist` folder itself, but rather the files inside it, so `manifest.json` is at the root of the `.zip` archive).*
   
   On Windows (using PowerShell):
   ```powershell
   Compress-Archive -Path dist\* -DestinationPath fillin-production-build.zip
   ```

5. **Upload to Chrome Web Store:**
   Upload `fillin-production-build.zip` to the Chrome Developer Dashboard.

### Security Notes
- No development URLs or secrets are bundled.
- We deliberately do not output source maps (`.map` files) to keep the extension footprint small and secure.
- The extension only requests the `storage` permission and `<all_urls>` host permissions, which is the absolute minimum required for a global text expander.
