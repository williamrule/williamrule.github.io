# William Rule — Portfolio

A single-page personal portfolio built with semantic HTML5, custom CSS, and
vanilla JavaScript. No frameworks, no build step, and no external runtime
dependencies, so it works when opened directly from disk and on GitHub Pages.

## Contents

```
portfolio/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── will-rule.jpg                # hero photo
    ├── projects/                    # real project figures
    │   ├── carbon-credit-transaction-activity.png
    │   ├── binomial-bsm-convergence.png
    │   ├── bsm-taylor-call-price-error.png
    │   └── spy-moving-average-sharpe-heatmap.png
    └── resume/
        └── William_Rule_Resume.pdf
```

## Run it locally

Because every path is relative and nothing is loaded from a CDN, you can just
open the file:

- Double-click `index.html`, or
- Open it from your browser with **File → Open**.

If you'd rather serve it over `http://` (useful for testing the resume download
behavior exactly as it works when deployed), run a tiny static server from the
project folder:

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

No server is required for the page to function — this is only a convenience.

## Deploy on GitHub Pages

1. **Create a repository** on GitHub (for example, `portfolio` or
   `williamrule.github.io`).

2. **Add these files at the repository root.** `index.html` must sit at the top
   level of the repo (not inside a subfolder), with `assets/` beside it.

   ```bash
   git init
   git add .
   git commit -m "Add portfolio site"
   git branch -M main
   git remote add origin https://github.com/williamrule/<your-repo>.git
   git push -u origin main
   ```

3. **Turn on Pages.** In the repository, go to
   **Settings → Pages**. Under **Build and deployment**, set **Source** to
   *Deploy from a branch*, choose the **main** branch and the **/ (root)**
   folder, then **Save**.

4. **Wait a moment, then visit the URL.** GitHub shows the published address on
   the same Pages settings screen. It will be one of:

   - `https://williamrule.github.io/<your-repo>/` for a project repo, or
   - `https://williamrule.github.io/` if the repo is named
     `williamrule.github.io`.

   The first build can take a minute or two. After that, pushing new commits to
   `main` updates the live site automatically.

### Note on paths

All asset references are **relative** (`assets/...`), so the site works whether
it's served from a user page (`williamrule.github.io`) or a project subpath
(`williamrule.github.io/portfolio`). You don't need to set a `base` URL.

## Editing

- **Text and structure:** `index.html`
- **Colors, layout, typography:** `styles.css` (design tokens live in the
  `:root` block at the top)
- **Behavior** (sticky nav, mobile menu, active-section highlighting,
  figure lightbox): `script.js`

To swap a project figure, replace the matching file in `assets/projects/` and
update the `<img>` `alt` text and the figure's `data-caption` in `index.html`.

## Accessibility

The site uses landmark elements, a skip link, descriptive image alt text,
visible keyboard focus states, an accessible mobile menu toggle, and a lightbox
that manages focus and closes on `Esc`. It also honors
`prefers-reduced-motion` by removing transitions and transforms for visitors who
request reduced motion.
