# Meta-PRD — Snowflake Insights Frontend Demo (React SaaS, Multi-Page)

## Project Vision & Goals

The goal of this phase is to **build a high-fidelity, multi-page frontend demo**
of the **Snowflake Insights** feature, focusing on a **proactive,
dashboard-first experience**. There should be **no backend logic**, only **mock
data and UI**.

### Primary Outcomes

- A clean, modern SaaS frontend shell with multiple routes.
- Insights dashboard (`/insights`) that lists available insights.
- Query insight detail pages (`/insights/QUERY/:id`) showing diagnosis,
  recommendations, and query plan visualization.
- Support for Insight → Recommendation → Optimization data contract.
- High-polish visual language (gradients, animations, responsive layouts).

### Target Users & Personas

- **Data Engineer (pipelines)** – monitors queries and cost drivers.
- **Analytics Engineer** – diagnoses and speeds up exploratory queries.
- **FinOps Lead** – reviews cost insights and projected savings.

### Non-Goals (Meta Scope)

- No backend integration with Snowflake.
- No live SQL execution.
- No authentication or multi-user collaboration.

## Phasing Overview (Chain of Authority → Phased PRDs)

- **PRD1 — Foundations (this cycle)**: Multi-page frontend demo with routing,
  mock insights (QUERY only), dashboard and detail views, plan visualization,
  and schema contract.
- **PRD2 — Optimization Engine**: Add rule-based engine, estimated what-if
  scenarios, and support for `TABLE` insights.
- **PRD3 — Collaboration & Governance**: Comments, shareable links, saved
  comparisons, RCA insights.
- **PRD4 — Production Integrations**: Live Snowflake connector, scheduled
  analyses, auth, alerting.

**Naming & Replacement Rules (Global)**

- Stable component names across phases: `FlowCanvas`, `QuerySummaryBar`,
  `BottleneckList`, `InsightCard`, `NodeDetailsPanel`, `PlanParser`,
  `CostModel`, `LatencyModel`, `OptimizationEngine`, `DataConnectorSnowflake`.
- Placeholders flagged for deprecation must be replaced in later phases.

## Core Concepts & Glossary

- **Insight (the “What”)**: The complete finding (diagnosis). Categories:
  `QUERY` | `TABLE` | `RCA`. (PRD1 implements only `QUERY`).
- **Recommendation (the “How”)**: Actionable advice within an Insight. An
  Insight may contain multiple Recommendations.
- **Optimization (the “Goal”)**: The positive outcome targeted by an Insight
  (`PERFORMANCE`, `COST`, or both).
- **Relationship**: An **Insight** contains one or more **Recommendations**
  which drive towards an **Optimization**.

## Success Metrics (Meta)

- Frontend fidelity: UI matches Figma spec / design system.
- Navigation polish: route changes feel smooth and animated.
- Schema fidelity: Insight JSON renders correctly across dashboard and detail.
- UX satisfaction: ≥ 80% testers rate UI as modern and easy to use.

---

# PRD1 — Foundations: Insights Dashboard + Query Detail (Mock Data)

## a. Purpose

Deliver a multi-page frontend demo for **Snowflake Insights** with:

- `/insights` dashboard page (list of Insights).
- `/insights/QUERY/:id` detail page (mock QUERY Insight).
- Query plan visualization with React Flow + elkjs.
- Insight schema contract rendered into UI (mock only).

### Explicitly Excluded in PRD1

- TABLE and RCA insight categories.
- Live Snowflake backend.
- Executing SQL or tuning queries.
- Authentication or team features.

## b. In-Scope Features

1. **Routing (React Router v5.2.0)**

   - `/insights` → dashboard list.
   - `/insights/QUERY/:id` → detail page.
   - Only `QUERY` supported in PRD1.

2. **Insights Dashboard**

   - Render mock insights from JSON fixtures.
   - Each Insight shows title, type, and optimization tags.
   - Click → navigate to detail.

3. **Query Insight Detail Page**

   - Render title, optimization tags.
   - Show original vs optimized SQL queries.
   - Render recommendations list.
   - Query plan visualization using **React Flow + elkjs**.

4. **Insight JSON Schema Contract**

   - Implement PRD1 schema for `QUERY` (see below).
   - Map schema → UI components (InsightCard, RecommendationList,
     PlanVisualization).

5. **Visualization (React Flow + elkjs)**

   - `FlowCanvas`: renders mock plan with auto-layout.
   - Highlight edges/nodes linked to recommendations.

6. **SaaS UI & Visual Language**

   - Tailwind theme (v3.4.17) + tailwind-merge v2.5.2.
   - If you want to overwrite default styles, make sure to import Tailwinds
     entry point after React Flows base styles.
   - Gradient accents, CSS/Tailwind animations (Framer Motion optional).
   - Responsive AppShell with sidebar and topbar.

7. **State Management**

   - Begin with `useState`.
   - Escalation guidelines: Context → Jotai → jotai-zustand (only if necessary).
   - **Functional approach**: keep UI components presentational/dumb; place
     business logic in hooks (`use*`) and pass state/actions via props.

## c. Out-of-Scope (PRD1)

- Non-QUERY insights (TABLE, RCA).
- Backend calls or Snowflake API.
- Cost/latency scoring models.

## d. Placeholders (with Deprecation Comments)

- `DataConnectorSnowflake` — _placeholder_.
- `OptimizationEngine` — _placeholder_.
- `CostModel` / `LatencyModel` — _placeholder_.

## e. User Flow

1. User visits `/insights` → dashboard loads mock QUERY insight.
2. Click insight → navigates to `/insights/QUERY/:id`.
3. Detail view shows insight title, tags, SQL before/after.
4. Recommendations listed below.
5. React Flow visualization displays plan and highlights relevant nodes.

## f. Deliverables

- **React app (Vite + TypeScript)**.
- **Routing**: React Router v5.2.0 with `/insights` and `/insights/QUERY/:id`.
- **Dashboard components**: InsightCard, InsightList.
- **Detail components**: InsightDetail, RecommendationList, FlowCanvas.
- **Hooks (business logic)**: `useInsightsList` (loads/filters mock data),
  `useInsightDetail` (selects one insight), `useHighlightRecommendations` (maps
  `recommendation_id` to nodes/edges).
- **Utils**: `planGraphAdapter` (adapts schema to React Flow).
- **UI Kit** with Tailwind v3.4.17, tailwind-merge v2.5.2, gradient presets.
- **Fixtures**: mock QUERY insights in schema format.
- **Schema Types (TS)** for Insight, Recommendation, Optimization.

### Insight JSON Schema (PRD1 — QUERY only)

```json
{
	"insight": {
		"id": "mock123",
		"type": "QUERY",
		"title": "Top Cost Driver: Daily Reporting Query",
		"optimization_type": ["COST", "PERFORMANCE"],
		"original_query": "SELECT users.name, COUNT(orders.id) FROM users JOIN orders ON users.id = orders.user_id GROUP BY 1;",
		"optimized_query": "SELECT u.name, COUNT(o.id) FROM users u JOIN orders o ON u.id = o.user_id WHERE o.order_date > '2025-01-01' GROUP BY 1;",
		"recommendations": [
			{
				"id": "rec_001",
				"title": "Add a Date Filter",
				"description": "Add a WHERE clause to filter the 'orders' table by `order_date`. This is a recommended best practice for large, time-series datasets.",
				"evidence_source": "SNOWFLAKE_BEST_PRACTICE",
				"expected_outcome": {
					"metric": "Rows Scanned",
					"improvement": "-99.7%",
					"notes": "Reduces rows scanned from ~1.58B to ~5M, leading to significant cost and performance gains."
				}
			}
		],
		"query_plan_visualization": {
			"nodes": [
				{
					"id": "table_users",
					"type": "tableNode",
					"data": { "label": "Users" }
				},
				{
					"id": "table_orders",
					"type": "tableNode",
					"data": { "label": "Orders" }
				},
				{
					"id": "op_filter",
					"type": "operationNode",
					"data": { "label": "FILTER", "recommendation_id": "rec_001" }
				},
				{
					"id": "op_join",
					"type": "operationNode",
					"data": { "label": "JOIN" }
				},
				{
					"id": "result",
					"type": "resultNode",
					"data": { "label": "Final Result" }
				}
			],
			"edges": [
				{
					"id": "edge1",
					"source": "table_users",
					"target": "op_join",
					"label": "18M Rows"
				},
				{
					"id": "edge2",
					"source": "table_orders",
					"target": "op_filter",
					"label": "1.58B Rows → 5M Rows",
					"recommendation_id": "rec_001"
				},
				{ "id": "edge3", "source": "op_filter", "target": "op_join" },
				{ "id": "edge4", "source": "op_join", "target": "result" }
			]
		}
	}
}
```

## g. Handoff Contract (→ PRD2)

- Extend support to `TABLE` insights.
- Replace placeholder logic with real rules engine.
- Add what-if optimization projections.

## h. Contextual Notes (Transcript Fidelity)

- **Routing**: strictly React Router v5.2.0.
- **Schema-first** contract ensures forward compatibility.
- **UI**: optimized queries and recommendations are always visible in detail
  page.
- **Performance**: animations should respect prefers-reduced-motion.
- **Security**: demo is local-only, no backend.

## i. User Verification Steps (PRD1)

1. Visit `/insights` → mock QUERY insight visible.
2. Click insight → navigates to detail page.
3. Verify insight schema fields render: title, SQL, recommendations.
4. Graph visualization appears with React Flow + elkjs.
5. Recommendation highlights are linked to nodes/edges.

---

## Appendix — Initial UI Wireframe Notes

- **Visual Direction**: UI must feel modern and SaaS-polished. Panels and cards
  should use subtle gradients, soft shadows, and may incorporate frosted glass
  or glossy surface effects. The look should evoke _high-end dashboards_ rather
  than utilitarian admin tools. This polish is a key differentiator.

- **Routes**: `/insights` (list), `/insights/QUERY/:id` (detail).

- **AppShell**: gradient header, sidebar, theme toggle.

- **Dashboard**: Insight list cards.

- **Detail**: SQL code blocks, recommendations, query plan.

## Appendix — Tech Stack & Quality Bar

- **Build**: Vite + React + TypeScript.
- **UI**: Tailwind CSS v3.4.17, tailwind-merge v2.5.2, shadcn/ui, lucide-react.
- **Graph**: React Flow + elkjs.
- **Routing**: React Router v5.2.0.
- **State**: useState → Context → Jotai → jotai-zustand.
- **Animation**: CSS/Tailwind-first (transform/opacity transitions, keyframes);
  Framer Motion optional for complex sequences.
- **Architecture**: **favor functional programming**; business logic lives in
  **hooks** (`use*`) and is passed into presentational/dumb components via
  props; prefer pure functions and composition; side effects isolated in hooks
  (`useEffect`).
- **Testing**: Vitest + Playwright.
- **Performance**: maintain smooth navigation and 60fps visualization; respect
  `prefers-reduced-motion`.

## Appendix — Design Inspiration Kit (for the Implementing LLM)

**Goal:** Provide unambiguous visual/motion references so the implementation
matches the desired React Flow look-and-feel.

**Artifacts to include (repo path **`/inspiration`** in repo):**

- `App.tsx` — main React Flow entrypoint from showcase.
- `FunctionIcon.tsx` — icon component used in custom nodes.
- `TurboNode.tsx` — custom node implementation.
- `TurboEdge.tsx` — custom edge implementation.
- `Screenshot.png` — reference screenshot for visual style.

**Layout rules:**

- `elkjs` layered, `rankdir=LR`, rank spacing `64px`, node spacing `40px`.
- Edge labels positioned at \~60% along path; avoid center.

**Motion rules (CSS-first):**

- Get inspiration from the animations in the inspiration folder.
- Respect `prefers-reduced-motion`.

**Acceptance criteria:**

- Using the showcase files (`App.tsx`, `FunctionIcon.tsx`, `TurboNode.tsx`,
  `TurboEdge.tsx`) renders without runtime errors in the demo.
- The visual output of the graph (nodes, edges, labels, selection/hover states)
  does not have to match the exact colors of the provided screenshot, but it
  should leverage the same gradient percentages and animations.
- Elk layout produces LR flow with specified spacings; manual drag persists
  until explicit “Reflow Layout”.
- Always iterate on the design by leveraging the browsermcp tools.
- Always use ref mcp tools for up to date docs. The docs for react flow are at:
  https://reactflow.dev/learn and https://reactflow.dev/api-reference

**Showcase Reference:** A screenshot of a React Flow example project structure
has been provided as part of the inspiration kit. The associated code is fully
licensed and may be copied directly. File references include: `App.tsx`,
`FunctionIcon.tsx`, `TurboNode.tsx`, `TurboEdge.tsx`, and `Screenshot.png`. The
Implementing LLM should use this as both a **code reference** and
**organizational pattern**: clean separation of components (custom nodes, custom
edges, icons) should be preserved, and the provided code can be fully adapted.
