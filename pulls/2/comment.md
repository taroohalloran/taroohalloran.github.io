Please make the following additional changes to this PR:

## 1. Retarget base branch
PR #1 has already been merged to `main`. Please retarget this PR's base branch from `copilot/fix-site-layout-issues` to `main` and rebase accordingly.

## 2. Name position on non-home pages
When navigating away from the home page and the name shrinks, it currently sits too high. Add more top padding/margin so it has more breathing room from the top of the browser window on non-home routes.

## 3. Subtitle stays visible on all pages
PR #1 hid the subtitle `( writer , director , producer )` on non-home pages. Undo that — keep the subtitle visible on ALL pages. On non-home pages it should just be slightly smaller and tighter, but still present.

## 4. Fonts — EB Garamond + Cormorant Garamond
Add Google Fonts import for **EB Garamond** (body text, metadata, descriptions) and **Cormorant Garamond** (headings, film titles, section headers). Replace the current system font stack with these throughout. The name logo is already a PNG so it won't change, but all other text on the site should use these fonts. They evoke old movie credits.

## 5. Home page layout — match mockup more closely
The home page image layout needs to match the original mockup:
- Two images stacked vertically on the LEFT side of the main hero image
- Two images stacked vertically on the RIGHT side of the main hero image
- The side stacks should be roughly vertically centered alongside the hero
- At the BOTTOM of the viewport, additional images should be partially visible, mostly hidden/cropped by the dark vignette overlay — peeking out to give depth and imply more content beneath the darkness
- Currently the side stacks have `padding-top: 140px` which pushes them down too much

## 6. Button grain oval fix
The grain effect on nav buttons currently shows a gray oval halo extending beyond the red pill shape. This happens because CSS `filter: url(#grain-noise)` on the `::after` pseudo-element renders outside the element bounds before clipping. Fix this so the grain is strictly contained within the pill border-radius. Consider using `backdrop-filter`, `mask`, or `overflow: hidden` on a parent wrapper, or apply the filter differently so it doesn't bleed.

## 7. Purge old film-grain.png tiling
Make sure the old `background-image: url(film-grain.png)` with `grainMove` keyframe animation is completely removed from ALL elements — film tiles, nav pills, everything. The SVG feTurbulence approach should be the only grain source. The old approach causes a visible repeating grid pattern artifact.

## 8. Full mobile responsive layout
Add comprehensive responsive CSS:
- On mobile (<768px), the home page side stacks should disappear and the hero goes full-width
- The film grid should stack to a single column on mobile
- The lightbox needs touch/swipe support for navigating between stills
- The slideshow also needs swipe support
- Nav buttons should be slightly smaller or closer together on mobile
- YouTube embeds must be responsive

## 9. Mobile film tiles — title visible by default
Hover effects don't work on touchscreens. On mobile, the film title and year should be visible by default on each tile (e.g., a small text bar at the bottom), instead of only appearing on hover. The blur+overlay reveal should only happen on desktop (:hover).

## 10. Loading state — "Projector warming up"
Add a loading overlay that shows on initial page load:
- Dark background with just a subtle projector flicker effect
- Brief warm glow pulse
- Once key assets are loaded, the overlay fades out and the site fades in
- Makes the load time feel intentional and atmospheric

## 11. About page — press kit layout
Redesign the About page like film production notes / festival press kit:
- Photo on the left (at `assets/branding/about-photo.jpg`), styled like a film still
- Bio text on the right, formatted like festival program notes
- "ABOUT THE FILMMAKER" header in small tracked uppercase
- Below: "FESTIVAL SELECTIONS" section with condensed laurel row (space for 10, same assets displayed smaller)
- Below: "PRESS" section with press items
- Apply `.filmGrade` to the about photo

## 12. Humanzee detail page — Festival laurels
Add horizontally scrollable laurel row on Humanzee page:
- Space for 10: `assets/films/humanzee/laurels/laurel-01.png` through `laurel-10.png`
- Each optionally links to a festival URL
- Section header: "FESTIVAL SELECTIONS" in small tracked uppercase
- Hide broken/missing images gracefully
- Hidden scrollbar CSS

Add to Humanzee film data:
```js
laurels: [
  { src: "assets/films/humanzee/laurels/laurel-01.png", href: "" },
  // ... through laurel-10
]
```

## 13. Humanzee detail page — Press & Publications section
Add "PRESS & PUBLICATIONS" section below laurels:
- Styled like VHS sleeve credits — clean list with subtle borders
- Three types: review, article, press-release

```js
press: [
  { type: "review", source: "PUBLICATION NAME", quote: "Pull quote here", href: "" },
  { type: "article", source: "PUBLICATION NAME", title: "Article Title", href: "" },
  { type: "press-release", source: "FESTIVAL NAME", title: "Press Release Title", href: "" },
]
```

## 14. Letterboxd buttons
Add "LOG IT ON LETTERBOXD" badge on detail pages for Humanzee, Rendezvous, and UAP. Add `letterboxd: ""` field (user fills in URLs later). Action buttons layout:
- Humanzee: WATCH + LETTERBOXD
- Rendezvous: WATCH + LETTERBOXD
- UAP: LETTERBOXD only
- Dragons: none
- Whispers: WATCH only

## 15. SEO — Open Graph, meta description, favicon
Add to `<head>`:
```html
<meta name="description" content="Taro O'Halloran — writer, director, producer. Horror and genre filmmaking.">
<meta property="og:title" content="Taro O'Halloran — Filmmaker">
<meta property="og:description" content="Writer, director, producer. Horror and genre filmmaking.">
<meta property="og:image" content="assets/branding/og-image.jpg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/branding/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="assets/branding/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="assets/branding/favicon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="assets/branding/favicon-512.png">
```

## 16. Focus trapping in lightbox
Add focus trapping: Tab cycles between close/prev/next buttons only. Save and restore previous focus on close.

## 17. Error page — "REEL MISSING"
Restyle error view as projectionist's error card:
- Large "REEL MISSING" in Cormorant Garamond
- Smaller error message subtitle
- Subtle projector flicker on text
- "RETURN TO PROJECTOR" link back to home

## 18. Grain improvements
- Increase seed values in feTurbulence animation for less repetitive grain
- Projector flicker should have organic, slightly irregular timing
- Ensure name grain (::before/::after with mask and filter) is actually visible — check mask-image path and filter application

## 19. Ensure name grain renders visibly
The grain on the name letters must be clearly visible as an animated texture. Verify the mask-image path to taro-name.png is correct, the filter is applied, and the opacity values make the grain noticeable.