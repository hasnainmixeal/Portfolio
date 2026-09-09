# 3D experience and performance

The opening spiral uses local procedural geometry and an instanced shatter effect. The Form Exploration section uses one scroll-controlled assembly with 27 components; reversing scroll restores their original positions. Pointer movement adds a small change of perspective.

The page and Three.js scene are separate bundles. The scene generates its own reflection environment; there are no model, texture, or HDR network requests. Materials approximate glass with reflections and transparency instead of expensive screen refraction. Rendering is capped at approximately 30 fps and 1.25 device pixel ratio, skips drawing outside the relevant sections, and stops while the document is hidden. Phone layouts use a smaller composition. Reduced-motion preferences disable the time-driven rotation, shatter and scroll explosion. Portfolio images below the fold load lazily, and the gallery only auto-scrolls while visible.

Validation: TypeScript (`npm run lint`), production build (`npm run build`), desktop and 390px phone browser inspection, reversible scroll assembly, and browser error log inspection. Bundle gzip sizes are approximately 116 KB for the page and 133 KB for the separately loaded scene. These are build measurements, not a guarantee of load time on a particular connection or device.

Deploy with the existing GitHub Pages Actions workflow on pushes to main. The generated site is in dist (intentionally ignored by Git).
