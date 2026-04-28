/**
 * MyPortFolio frontend → Figma wireframe (code-derived structure)
 *
 * How to use (Cursor + Figma MCP, official `figma` server):
 * 1. Open or create a Figma design file; ensure Cursor is signed into Figma MCP.
 * 2. In chat, run `use_figma` with the script body below (no wrapper IIFE; top-level await + return per figma-use skill).
 * 3. Pass skillNames: "figma-generate-design" (and figma-use rules) if your client supports it.
 *
 * Maps: Layout (MainHeader 64px, main, Footer), routes from App.tsx, HomePage sections, theme (Inter, slate, blue-500).
 */

// --- start: paste everything below into use_figma `script` field ---

const T = {
  pageBg: { r: 0.02, g: 0.024, b: 0.063 },
  background: { r: 0.059, g: 0.09, b: 0.165 },
  surface: { r: 0.122, g: 0.161, b: 0.216 },
  text: { r: 0.973, g: 0.98, b: 0.988 },
  textMuted: { r: 0.58, g: 0.64, b: 0.72 },
  primary: { r: 0.231, g: 0.51, b: 0.965 },
  border: { r: 0.2, g: 0.255, b: 0.333 }
};

async function loadInter() {
  for (const style of ["Regular", "Medium", "Bold"]) {
    await figma.loadFontAsync({ family: "Inter", style });
  }
}

function placeRightOfAll() {
  let r = 0;
  for (const c of figma.currentPage.children) {
    if ("x" in c && "width" in c) {
      r = Math.max(r, c.x + c.width);
    }
  }
  return r + 80;
}

/**
 * @param {string} label
 * @param {{r:number,g:number,b:number}} [fill]
 */
function band(parent, w, h, name, label, fill = T.background) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = "HORIZONTAL";
  f.primaryAxisAlignItems = "MIN";
  f.counterAxisAlignItems = "CENTER";
  f.paddingLeft = 20;
  f.paddingRight = 20;
  f.fills = [{ type: "SOLID", color: fill }];
  f.strokes = [{ type: "SOLID", color: T.border }];
  f.strokeWeight = 1;
  f.cornerRadius = 4;
  f.resize(w, h);
  const t = figma.createText();
  t.fontName = { family: "Inter", style: "Medium" };
  t.characters = label;
  t.fontSize = 12;
  t.fills = [{ type: "SOLID", color: T.textMuted }];
  f.appendChild(t);
  f.layoutSizingVertical = "FIXED";
  parent.appendChild(f);
  return f;
}

/**
 * @param {string} title
 * @param {Array<{h:number, name:string, label:string, fill?:object}>} blocks
 */
function makeScreen(x, y, w, title, blocks) {
  const screen = figma.createFrame();
  screen.name = title;
  screen.layoutMode = "VERTICAL";
  screen.primaryAxisAlignItems = "MIN";
  screen.itemSpacing = 0;
  screen.fills = [{ type: "SOLID", color: T.pageBg }];
  screen.strokes = [{ type: "SOLID", color: T.border }];
  screen.strokeWeight = 1;
  screen.cornerRadius = 8;
  screen.clipsContent = true;
  figma.currentPage.appendChild(screen);
  screen.x = x;
  screen.y = y;
  band(screen, w, 64, "Header (sticky, 64px)", "Logo · Nav: Projects, Academics, About · Language · Theme · Google login", T.surface);
  for (const b of blocks) {
    band(screen, w, b.h, b.name, b.label, b.fill || T.background);
  }
  const totalH = 64 + blocks.reduce((s, b) => s + b.h, 0);
  screen.resize(w, totalH);
  return screen;
}

await loadInter();

const startX = placeRightOfAll();
const y0 = 0;
const W = 360;

// Routes from App.tsx (public / Layout)
const screens = [
  {
    key: "home",
    title: "Screen: Home /",
    blocks: [
      { h: 180, name: "Hero", label: "InteractiveBackground · story / CLI · CTA · social · ScrollIndicator" },
      { h: 72, name: "SectionPurpose", label: "SectionPurpose + SectionBridge" },
      { h: 100, name: "Journey", label: "JourneyMilestoneSection" },
      { h: 200, name: "Featured", label: "HeroProjectCard (full) + FeaturedProjectCard grid (asymmetric)" },
      { h: 120, name: "Testimonials", label: "TestimonialCard list" },
      { h: 100, name: "Footer (desktop)", label: "Branding, Nav, Social, Legal, FooterCTA" }
    ]
  },
  {
    key: "projects",
    title: "Screen: Projects /projects",
    blocks: [
      { h: 100, name: "Page header", label: "Title + filters (filters store)" },
      { h: 200, name: "Grid", label: "ProjectCard; outlet: ProjectDetailOverlay on :id" }
    ]
  },
  {
    key: "academics",
    title: "Screen: Academics /academics",
    blocks: [{ h: 260, name: "Content", label: "Academics timeline / cards" }]
  },
  {
    key: "about",
    title: "Screen: About /about",
    blocks: [
      { h: 100, name: "Personal header", label: "PersonalInfoHeader" },
      { h: 160, name: "Body", label: "Narrative + StatCard + CareerSummaryDashboard" }
    ]
  },
  {
    key: "login",
    title: "Screen: Login /login",
    blocks: [{ h: 200, name: "Auth", label: "LoginPage (GitHub, etc.)" }]
  }
];

const created = [];
let cx = startX;
for (const s of screens) {
  const node = makeScreen(cx, y0, W, s.title, s.blocks);
  created.push(node);
  cx += W + 48;
}

// Token strip (theme.ts — DevOps palette)
const tok = figma.createFrame();
tok.name = "Tokens: theme (excerpt)";
tok.layoutMode = "HORIZONTAL";
tok.itemSpacing = 8;
tok.paddingLeft = tok.paddingRight = tok.paddingTop = tok.paddingBottom = 12;
tok.fills = [{ type: "SOLID", color: T.surface }];
tok.strokes = [{ type: "SOLID", color: T.border }];
tok.x = startX;
tok.y = 720;
figma.currentPage.appendChild(tok);
const sw = (name, color) => {
  const r = figma.createFrame();
  r.name = name;
  r.layoutMode = "VERTICAL";
  r.itemSpacing = 4;
  const sq = figma.createRectangle();
  sq.resize(32, 32);
  sq.cornerRadius = 4;
  sq.fills = [{ type: "SOLID", color }];
  r.appendChild(sq);
  const t = figma.createText();
  t.fontName = { family: "Inter", style: "Regular" };
  t.characters = name;
  t.fontSize = 10;
  t.fills = [{ type: "SOLID", color: T.textMuted }];
  r.appendChild(t);
  tok.appendChild(r);
  return r;
};
sw("neutral.900", T.background);
sw("primary.500", T.primary);
sw("text", T.text);
tok.resize(3 * 50 + 64, 56);

return {
  page: figma.currentPage.name,
  message: "MyPortFolio wireframes from Layout + App routes; theme tokens row",
  createdNodeIds: [tok.id, ...created.map((n) => n.id)]
};

// --- end ---
