# Glass scene and loading

The original torus-knot geometry, MeshTransmissionMaterial refraction settings, glass shards, and city reflection map are restored. The original 1K reflection map is served from public/environment/city.hdr instead of depending on raw.githack.com at runtime. A small generated studio environment lets the scene render while that map loads. The page and 3D code remain separate bundles, and images below the fold load lazily.

The spiral completes its shatter over the opening 1500px. The resulting shard field remains fixed behind the portfolio, then sweeps down from above to form a moving rounded glass frame around the full contact section as it enters view. Scrolling back reverses the transition. Rendering pauses when the document is hidden. Device pixel ratio is capped at 1.25. Refraction uses the original small render targets (192px for the spiral, 128px for shards) to preserve the original look without full-screen refraction buffers.

Gallery cards use the intrinsic dimensions of all 37 thumbnails. Each card therefore matches its render's landscape, portrait, or square aspect ratio without adding black side areas.

The gallery can be filtered into Game Environments, Props & Assets, and Archviz & Furniture while retaining an All Work view. The hero links directly to featured work and offers the supplied one-page résumé as a same-origin PDF download.

The added Form Exploration section has been removed. Core Expertise starts with 3D Modeling and ends with Social media marketing and Video editing.

Validation: npm run lint, npm run build, browser inspection of the intact glass, early shatter, later fade and updated expertise, and browser console error inspection. Load time depends on the device and connection; no universal timing is claimed.

Environment asset source: https://raw.githubusercontent.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/potsdamer_platz_1k.hdr (the same asset used by the original Drei city preset).

Deploy through the existing GitHub Pages workflow on pushes to main. The production build is in dist, which remains ignored by Git.
