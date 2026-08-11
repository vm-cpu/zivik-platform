<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design

Before changing anything visual, read `docs/DESIGN.md`. It is the contract for
colour, type, shape, layout and accessibility. Colour and type values live in
`src/app/globals.css` as `--brand-*` tokens — the single source of truth. Never
put a hex literal in a component or section stylesheet: literals do not follow
the light/dark theme.
