# Portfolio Website Guide

A research-backed guide to building a phenomenal portfolio website for a web developer.
Synthesized from 15+ top developer portfolio resources, Codrops award-winning case studies,
and hiring manager perspectives (2026).

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [Information Architecture](#2-information-architecture)
3. [The Hero Section — Your 6-Second Filter](#3-the-hero-section--your-6-second-filter)
4. [Project Case Studies — The Core](#4-project-case-studies--the-core)
5. [About Section — Personality, Not Resume](#5-about-section--personality-not-resume)
6. [Skills Section — Depth Over Logos](#6-skills-section--depth-over-logos)
7. [Contact — Remove All Friction](#7-contact--remove-all-friction)
8. [Design Principles That Matter](#8-design-principles-that-matter)
9. [Performance Is Credibility](#9-performance-is-credibility)
10. [SEO — Be Findable](#10-seo--be-findable)
11. [Technical Stack — What Works](#11-technical-stack--what-works)
12. [Content Strategy — Two Audiences](#12-content-strategy--two-audiences)
13. [Animation & Motion — Restraint Wins](#13-animation--motion--restraint-wins)
14. [Accessibility — Not Optional](#14-accessibility--not-optional)
15. [Common Mistakes That Kill Portfolios](#15-common-mistakes-that-kill-portfolios)
16. [Portfolio Audit: dagm.dev](#16-portfolio-audit-dagmdev)

---

## 1. Philosophy

> "A portfolio is your proof of work, not a design showpiece.
> The site is the frame. Nobody buys a frame. They buy the painting."
> — Solid Web

The single most important principle: **show, don't tell.**

A portfolio website has three jobs:
1. Answer "what do you build?" in under 5 seconds
2. Prove you can solve real problems with 3-5 deep case studies
3. Make it effortless to contact you

Everything else — animations, WebGL, custom cursors — is decoration.
Decoration is fine if it serves the work. It's a problem if it replaces it.

### What Hiring Managers Actually Evaluate

| Phase | What They Check | Time |
|-------|----------------|------|
| Scan (6s) | Role, stack, location, top project | ~6 seconds |
| Skim (30s) | Project descriptions, tech keywords, company names | ~30 seconds |
| Deep read | Case studies, code quality, READMEs | 2-5 minutes |

The scan phase decides whether they keep reading or close the tab.
Optimize for the scan first. Everything else is secondary.

---

## 2. Information Architecture

The structure that works for most developers — four to five pages:

```
Home (Hero + featured project)
├── Projects (3-5 case studies)
├── About (short, human, specific)
├── Skills (grouped by category)
└── Contact (email + social links)
```

### Why This Works

- **Home** answers the three questions immediately
- **Projects** provides the evidence (the most visited section after hero)
- **About** adds personality (read only after other signals are positive)
- **Skills** confirms tech fit for ATS-like screening
- **Contact** converts interest into action

### Navigation Rules

- Keep it small and predictable
- Sticky or fixed navigation (always accessible)
- Active state should be obvious
- No hamburger menu on desktop — ever
- Mobile: bottom nav or simple hamburger is acceptable

---

## 3. The Hero Section — Your 6-Second Filter

The hero is the single most important section. It receives ~100% of visitor attention.

### The Three Questions It Must Answer

1. **Who are you?** — Name + role title
2. **What do you build?** — Specific, not generic
3. **What should they do next?** — Clear CTA

### The F-Pattern Layout

Nielsen Norman Group's eye-tracking research shows the F-pattern:
- First horizontal pass: top of content area (longest scan)
- Second horizontal pass: shorter, slightly lower
- Vertical scan: left edge of content, catching first words

**Implications for your hero:**
- Left-align your positioning statement (survives the vertical scan)
- First words of each line carry disproportionate weight
- "Senior WordPress Developer" reads faster than "I am a developer who has been working with..."

### Positioning Statement Formula

```
Role + Domain + Stack
```

**Weak:** "I'm a full-stack developer"
**Strong:** "I build fast, conversion-focused WordPress and WooCommerce stores for businesses worldwide"

### Hero Best Practices

- No intro animations that delay content (every second = bounce risk)
- Professional photo is optional but recommended
- Stack keywords visible above the fold (recruiters scan for these)
- Status indicator ("Available for freelance") adds urgency
- Two CTAs: primary (View Work) + secondary (Get in Touch)

### What Kills Hero Sections

- Cryptic animation with no text above the fold
- "Welcome to my portfolio" (wastes the first line)
- Auto-playing video (performance killer)
- Loading screens over 2 seconds
- Center-aligned text that loses the F-pattern

---

## 4. Project Case Studies — The Core

> "Three strong case studies beat ten project cards with no substance."
> — Scrimba

This is where hiring managers spend the most time.
A project without a case study is a screenshot. A project with one is evidence.

### The CASE Format

For each project, write four things:

#### 1. Challenge (1-2 sentences)
The problem that forced a change.

**Weak:** "Built a website for a nonprofit"
**Strong:** "JB Dondolo needed an e-commerce platform to sell handcrafted goods internationally while handling WooCommerce payment gateways and maintaining fast load times on shared hosting"

#### 2. Approach
What you decided and why. This is where you show judgment, not just output.

- What alternatives did you consider?
- What tradeoffs did you accept?
- What constraints shaped your decisions?

**Example:** "Chose WordPress with Divi over a headless CMS because the client needed to manage content independently, and LiteSpeed Cache solved the performance concern on their Hostinger shared plan"

#### 3. Solution
What you built. Name technologies only when they were load-bearing.

- Architecture decisions
- Key technical challenges
- What you specifically owned

#### 4. Impact (numbers)
If you have a metric, use it. Numbers make the work legible.

- "Loads under 3 seconds on mobile"
- "Improved conversion rates by 40% via Elementor landing pages"
- "Reduced cart abandonment with optimized checkout flow"

If you can't measure impact yet, describe what changed:
- "Client can now manage all product listings without developer assistance"

### Project Selection Rules

- **3-5 projects** is the sweet spot (more = decision fatigue)
- Each should demonstrate a **different skill or technology**
- Lead with your strongest, most recent work
- Include at least one project that covers the full stack
- Skip tutorial clones unless you significantly extended them
- Show progression over time (early work -> recent work)

### Every Project Needs

- Live demo link (that works on mobile AND desktop)
- GitHub repo link (with a real README)
- Screenshot or preview image
- Stack listed with context, not just logos

---

## 5. About Section — Personality, Not Resume

The About section is where personality lives. Hiring managers read it to decide whether they want to work with you, not just whether you're qualified.

### Structure

1. **Who you are** — One sentence, specific
2. **What you do** — Your focus area and approach
3. **What drives you** — One human detail
4. **What you're looking for** — Role type, team size, etc.

### Rules

- Write it like a person, not a LinkedIn summary
- 2-3 short paragraphs maximum
- Skip the third-person "passionate full-stack ninja" voice
- Include your location/timezone (important for remote roles)
- One personal detail makes you memorable ("I obsess over load times" or "I believe every site should work without JavaScript")

### What NOT to Include

- Your entire work history (that's what the resume is for)
- A wall of adjectives ("passionate, dedicated, creative, detail-oriented...")
- Your education unless it's directly relevant
- Generic statements about loving technology

---

## 6. Skills Section — Depth Over Logos

> "A skills section that lists forty logos is visually cluttered and
> informationally useless."
> — Munix Studio

### How to Organize

Group by category, not alphabetically:

```
Development: WordPress, WooCommerce, PHP, JavaScript, HTML5/CSS3
Design: Elementor Pro, Figma to WordPress, Landing Pages
Tools: Git, LiteSpeed, cPanel, Vercel
SEO: On-Page SEO, Core Web Vitals, Speed Optimization
```

### What to Include vs. What to Skip

| Include | Skip |
|---------|------|
| Technologies you'd defend in an interview | Everything you've ever touched |
| Production-level experience with context | Progress bars (meaningless) |
| 10-15 max across all categories | 40+ tag clouds |
| Category labels | Skill "levels" or percentages |

### The Context Rule

"React (1 year, built 3 projects)" is more useful than a colored bar at 75%.
Be honest about what you use in production vs. what you've experimented with.

---

## 7. Contact — Remove All Friction

The contact section converts interest into action. If a recruiter has to hunt for your email, they won't.

### Non-Negotiable Elements

- **Email address** — visible in header AND footer
- **GitHub profile** — link to your best work
- **LinkedIn** — professional networking
- **Phone/WhatsApp** — optional but helpful for international clients
- **Timezone** — critical for remote work

### Contact Form Best Practices

If you include a form:
- Name, email, message — that's it
- Confirm receipt ("Thanks! I'll respond within 24 hours")
- Rate limiting to prevent spam
- Test that it actually sends

### Placement

- Visible in the header or footer on every page
- Don't bury it behind three clicks
- CTA in the hero should link directly to contact

---

## 8. Design Principles That Matter

### Typography (Highest Leverage)

Typography is the single highest-leverage design decision on a portfolio.

**Rules:**
- Maximum 2 font families (display + body)
- One monospace font for code-like elements
- Consistent typographic hierarchy across all headings
- Generous line-height on body copy (1.6-1.8)
- Limit font weights to what you actually use

**Strong choices for developer portfolios:**
- Space Grotesk, Inter, JetBrains Mono (current dagm.dev stack)
- DM Sans, Plus Jakarta Sans, Syne

### Whitespace

Cramped portfolios signal inexperience with layout.

- Generous padding around sections (60-80px)
- Clear visual separation between content blocks
- Let content breathe — don't fill every pixel

### Color

- Dark themes are appropriate for developer audiences (IDE-native)
- Light themes can feel more distinctive now that dark is default
- Maximum 2-3 colors total
- Accent color used deliberately, not scattered
- Body text must meet WCAG AA contrast minimum (4.5:1)

### Consistency

- Same spacing system throughout
- Same border radius on all cards
- Same transition timing on all hover states
- Same font sizes for equivalent elements

### The Minimalism Trap

Minimalism doesn't mean boring. It means intentional.
Every element should earn its place. If you can remove it and the section still works, remove it.

---

## 9. Performance Is Credibility

> "A developer portfolio that scores poorly on Google Lighthouse is a
> self-defeating artifact."
> — Munix Studio

For a developer claiming expertise, slow load times are actively damaging.

### Performance Budget

| Metric | Target | Why |
|--------|--------|-----|
| Lighthouse Performance | 95+ | Visible to anyone who checks |
| LCP (Largest Contentful Paint) | < 2.5s | First impression metric |
| CLS (Cumulative Layout Shift) | < 0.1 | Layout stability |
| INP (Interaction to Next Paint) | < 100ms | Responsiveness |
| Total page weight | < 500KB | Fast on all connections |

### How to Hit These Targets

1. **Images:** WebP format, explicit width/height, lazy loading below fold
2. **Fonts:** Only weights you use, `font-display: swap`, preconnect hints
3. **CSS:** Critical CSS inlined, defer non-critical
4. **JavaScript:** Defer everything, split bundles, avoid heavy libraries
5. **Hosting:** CDN-backed (Vercel, Cloudflare, Netlify)
6. **No autoplay video** on landing pages
7. **No render-blocking scripts** in `<head>`

### The dagm.dev Advantage

Your current stack (vanilla HTML/CSS/JS with deferred GSAP) is actually optimal.
No framework overhead, no hydration delay, no build step bloat.
This is why static HTML + Tailwind can achieve perfect Lighthouse scores.

---

## 10. SEO — Be Findable

A beautiful portfolio is useless if no one can find it when they search your name.

### Technical SEO Checklist

- [ ] Descriptive `<title>` with name + role
- [ ] Meta description (literal, not a slogan)
- [ ] Canonical URL
- [ ] Open Graph tags (title, description, image, type)
- [ ] Twitter Card tags
- [ ] JSON-LD structured data (Person, WebSite, ProfessionalService)
- [ ] `sitemap.xml`
- [ ] `robots.txt`
- [ ] Semantic HTML (proper heading hierarchy, alt text)
- [ ] `loading="lazy"` on below-fold images
- [ ] Mobile-responsive layout

### Content SEO

- Each project page should have its own URL and meta description
- Write project descriptions with relevant technology keywords in natural context
- A case study about a React project can rank for "React developer" if written well
- Blog posts about technical decisions build topical relevance

### The JSON-LD Advantage

Structured data helps search engines AND AI tools parse your page.
Your current `@graph` with Person, WebSite, and ProfessionalService schemas is excellent.

---

## 11. Technical Stack — What Works

### Recommended Stacks (by complexity)

| Stack | Best For | Performance | Maintainability |
|-------|----------|-------------|-----------------|
| HTML + CSS + JS (current) | Maximum performance, full control | 100/100 | Manual |
| Astro + Tailwind | Static sites with interactive islands | 95+ | High |
| Next.js + Tailwind | SSR needs, blog, dynamic content | 90+ | Medium |
| 11ty/Hugo + CMS | Content-heavy portfolios | 95+ | High |

### The dagm.dev Stack Analysis

**Strengths:**
- Zero framework overhead = maximum performance
- Custom CMS with GitHub OAuth = content without rebuilds
- GSAP for animations = industry standard, performant
- Browser-in-browser concept = unique visual identity
- Scrapbook about section = memorable design

**Considerations:**
- Vanilla JS = more maintenance for complex features
- No build step = no minification/bundling automation
- Manual deployment = no preview deployments

### When to Use a Framework

Use a framework when you need:
- Server-side rendering for SEO-heavy content
- Dynamic content that changes frequently
- A blog with MDX support
- Image optimization automation
- Preview deployments

Don't use a framework just because it's trendy.
The best stack is the one you can maintain and the one that serves the content.

---

## 12. Content Strategy — Two Audiences

Your portfolio has two audiences. They evaluate completely differently.

### The HR Screener (First Pass)

- Looks for: clear role fit, professional presentation, quantifiable results
- Doesn't open GitHub repos
- Can't evaluate code quality
- Evaluates: communication skills, experience match
- Scans for: company names, technology keywords, metrics

### The Technical Reviewer (Second Pass)

- Looks for: code quality, architecture decisions, problem-solving approach
- Will clone your repo and read commit messages
- Checks: README quality, TypeScript usage, edge case handling
- Evaluates: technical judgment, not just output

### The Dual-Layer Approach

One sentence can serve both audiences:
> "Built a real-time inventory sync service handling 50k SKUs — reduced stock discrepancies by 80%"

- HR sees: the impact number
- Engineers see: the technical challenge and want to know how you handled concurrency

### Writing for Both

| Section | HR Focus | Engineer Focus |
|---------|----------|----------------|
| Hero | Role + what you build | Stack + specialization |
| Projects | Impact numbers + outcomes | Architecture decisions + tradeoffs |
| About | Communication style | Technical depth signals |
| Skills | Technology keywords | Production-level experience |

---

## 13. Animation & Motion — Restraint Wins

> "Every navigation link uses a magnetic hover effect... The nav bar hides
> while you scroll down and returns when you scroll up, so the content
> keeps the focus."
> — Benjamin Looi's portfolio

Animation should serve the content, not compete with it.

### What Works

- **Scroll-triggered reveals** — elements fade in as you scroll (staggered)
- **Hover micro-interactions** — subtle scale, color shift, underline
- **Page transitions** — smooth between sections (if SPA)
- **Typing effect** — for hero role/title
- **Magnetic hover** — cursor attraction on CTAs
- **Nav hide/show** — on scroll direction

### What Doesn't Work

- 3-second loading animations (bounce risk)
- Parallax that breaks mobile
- Auto-playing anything without user consent
- Complex WebGL that tanks performance
- Animations that delay content access
- Effects that ignore `prefers-reduced-motion`

### The Reduced Motion Rule

Always respect `prefers-reduced-motion`:
```javascript
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) return; // skip animations
```

Replace animations with instant state changes for users who prefer reduced motion.

---

## 14. Accessibility — Not Optional

> "Accessibility and creativity are not mutually exclusive."
> — Arnaud Rocca's portfolio

Accessibility is a quality signal. If your site can't be used with a keyboard,
some reviewers will bounce immediately.

### Minimum Requirements

- [ ] Semantic HTML (nav, main, section, article, footer)
- [ ] Skip-to-content link
- [ ] Focus visible states on all interactive elements
- [ ] Alt text on all images
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Keyboard navigation works throughout
- [ ] Link text is descriptive (not "click here")
- [ ] Form labels are properly associated
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-hidden` on decorative elements

### Quick Wins

- Test with Tab key — can you reach everything?
- Test with a screen reader (VoiceOver on Mac, NVDA on Windows)
- Check contrast with a tool like WebAIM
- Ensure touch targets are at least 44x44px on mobile

---

## 15. Common Mistakes That Kill Portfolios

| Mistake | Why It Hurts | Fix |
|---------|-------------|-----|
| No live demos | Recruiters won't clone repos | Deploy everything, even staging |
| Broken links | Signals poor maintenance habits | Check monthly, set calendar reminder |
| Tutorial clones as projects | Signals "I followed along" | Build original projects, even small ones |
| No README or writeup | Code without context is useless | Write CASE studies for each project |
| Walls of text about passion | Nobody reads it | Show the work, skip the manifesto |
| Skills progress bars | Everyone knows they're meaningless | List skills with context instead |
| Overly complex animations | Tanks load time, delays content | Restraint wins |
| Stale content | Signals you've stopped building | Update at least quarterly |
| Desktop-only layout | Fails basic frontend competency test | Mobile-first, always |
| 20 half-finished projects | Decision fatigue | 3-5 polished projects max |
| No contact information | Can't hire you if they can't reach you | Email in header AND footer |
| Logo soup | 40 technology badges = noise | 10-15 max, grouped by category |

---

## 16. Portfolio Audit: dagm.dev

### Strengths (What's Working)

1. **Unique visual identity** — Browser-in-browser concept with folder tabs is memorable and differentiating
2. **Strong SEO foundation** — JSON-LD structured data, Open Graph, meta tags, sitemap, robots.txt all properly implemented
3. **Performance-conscious** — Critical CSS inlined, deferred scripts, no render-blocking resources
4. **Real projects** — 9 actual client projects (not tutorial clones)
5. **Custom CMS** — GitHub OAuth admin dashboard for content management
6. **Theme system** — Dark/light mode with system preference detection
7. **Accessibility basics** — Skip link, focus states, ARIA labels
8. **Scrapbook about section** — Creative design that stands out
9. **Status indicator** — "Available for freelance" with animated dot
10. **Strong positioning** — Clear WordPress/Elementor specialization

### Areas for Improvement

#### Content

1. **Add case studies** — Currently projects show title + status + stack but lack the Problem -> Approach -> Result narrative
2. **Shorten the About bio** — Current bio is keyword-stuffed for SEO; rewrite for humans, keep keywords in meta tags
3. **Add testimonials** — Social proof from past clients would strengthen credibility
4. **Add a "How I Work" section** — Process, communication style, response time

#### Technical

5. **Add performance monitoring** — Track Lighthouse scores over time
6. **Optimize project images** — Ensure all are WebP with proper dimensions
7. **Add RSS feed** — If you plan to blog
8. **Consider structured data for projects** — Individual project pages could have their own schemas

#### Design

9. **Mobile navigation** — Current sidebar hides on mobile; consider bottom nav or hamburger
10. **Project preview screenshots** — Auto-scrolling screenshots are great; ensure they're recent and crisp
11. **Contact form** — Consider adding one alongside email/phone (many clients prefer forms)

#### SEO

12. **Individual project pages** — Each project could have its own URL with detailed case study
13. **Blog section** — Even 2-3 technical articles would significantly boost SEO and demonstrate expertise
14. **Internal linking** — Link between projects and skills sections

### Quick Wins (Do This Week)

- [ ] Add a one-line case study to each project in `content.json`
- [ ] Rewrite About bio for humans (move keyword density to meta tags)
- [ ] Test all project links — ensure zero 404s
- [ ] Add a downloadable resume PDF
- [ ] Test mobile layout on a real device

### Medium-Term (This Month)

- [ ] Write 2-3 full CASE studies for strongest projects
- [ ] Add client testimonials (even 1-2 short quotes)
- [ ] Create individual project detail pages
- [ ] Add a simple contact form with rate limiting
- [ ] Set up Lighthouse CI in GitHub Actions

### Long-Term (This Quarter)

- [ ] Start a technical blog (1-2 posts/month)
- [ ] Add RSS feed
- [ ] Build an OG image generator for social sharing
- [ ] Add analytics (PostHog or Plausible)
- [ ] Create a "Uses" page (tools, setup, workflow)

---

## Sources

- Benjamin Looi's Portfolio (2026) — Next.js 15, Tailwind, GSAP, MDX
- Arnaud Rocca's Portfolio — Codrops, GSAP + WebGL fluid simulation
- Corentin Bernadou's Portfolio — Swiss-inspired, vanilla JS, Three.js
- Joffrey Spitzer's Portfolio — Astro + GSAP, minimalist brutalist
- "How Recruiters Read Developer Portfolios" — ShowProof (2026)
- "How to Build a Developer Portfolio That Actually Gets You Hired" — Path Blog (2026)
- "How to Create a Portfolio Website for a Software Developer" — Munix Studio (2026)
- "How to Build a Web Developer Portfolio" — Scrimba (2026)
- "Developer Portfolios That Get Interviews" — Solid Web (2026)
- "Building a Standout Portfolio Website for Tech Professionals" — CoreCV (2026)
- "Developer Portfolio 2026: Build One That Gets Interviews" — Popout (2026)
- "Build a Portfolio Website in 2026" — ByteVerse (2026)
- "Build a Developer Portfolio" — Portfolio Studio (2026)
- Ilir Ivezaj — Technical Portfolio Design
- Oles Didukh — Senior Front-End Engineer Portfolio

---

*Last updated: August 2026*
