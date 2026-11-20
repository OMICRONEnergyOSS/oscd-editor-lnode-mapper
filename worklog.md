# LNode Mapper migration worklog

## Goal and scope

- Migrate the LNode Mapping editor in `process-icd-creator` into a standalone,
  modern OpenSCD plugin, then replace its old SLD implementation with the
  published SLD module and evaluate communication mapper viewport improvements.
- Preserve diagram selection, LNode-to-LN linking, filtering and
  type-difference reporting. Remove template import per DP-5. Do not expand
  the prototype's unfinished CDC mapping.
- Workspace and proposed implementation destination:
  `/home/steren00/code/OmicronEnergyOSS/oscd-editor-lnode-mapper`. This is an
  empty non-Git directory; the user will initialize Git.
- This file records the approved plan and implementation progress.
- Source, scaffold and reference checkouts are read-only; implementation writes
  are restricted to the destination after approval.

## Resources

| Resource | Location / revision | Role / evidence |
|---|---|---|
| Legacy source | `/home/steren00/code/JakobVogelsang/process-icd-creator`, `d2f81011b41a750ab4b74a58f5bcdce6ce23a033`, clean | `process-icd-creator.ts` is the Rollup entry; `demo/index.html` calls it LNode Mapping. Prototype README says untested. |
| Other legacy editor | Same checkout, `scl-bay-template.ts` | Separate, non-entry editor; the current build does not include it. Its unfinished function/CDC workflows are not presumed to be in scope. |
| Legacy SLD | `sld-viewer.ts`, `foundation/sldSvg.ts`, `foundation/sldUtil.ts` | Local renderer; direct namespaced layout attributes, plus `Transpower-SLD-Vertices` connectivity Private. |
| Required scaffold | `/home/steren00/code/OmicronEnergyOSS/oscd-plugin-scafold`, `bf88432be7fdf3ad950d5af2f7205e7ef5d2b4e0`, clean | Editor-only basis; remove menu source/spec, export, bundle entry, demo and docs references. Uses `@omicronenergy/oscd-tooling` and thin multi-entry Rollup config. |
| Communication mapper | `/home/steren00/code/danyill/oscd-editor-map-communication`, `9a0c81c1dc8a98166cdcf0a7862c718ba788d5fd`, clean | SLD viewer integration, viewport controls and tests: `src/oscd-editor-map-communication.ts`, `src/components/map-toolbar.ts`, `src/foundation/legacy.ts`. |
| Bay Template Editor | `/home/steren00/code/com-pas/oscd-bay-template-editor`, `13f63e98cd8ed17287ce69792fd2c03d33ce5c3a`, clean | `bay-template-editor.ts` uses scoped `SldEditor`, selection events, highlighting and edit-mode controls. This checkout is not itself a model of current shared tooling. |
| SLD package source | `/home/steren00/code/stee-re/oscd-editor-sld`, `908b70867a4e09dbb020d1ef9f495bfcb296b907`, clean, package version 1.0.0 | Package exports `sld-editor.js`, `sld-substation-viewer.js`, `foundations.js`; `src/converter.ts` is not a package export. Local package version is not proof of latest published version; verify at implementation. |
| Skills | `plugin-migration`, `openscd-plugin-dev`, `oscd-api`, `oscd-ui`, `scl-lib`, `iec-61850`, `plugin-to-oscd-tooling`, `architecture-design` | Migration, tooling, APIs and SCL constraints. Load specific conversion skills when their phases begin. |
| Tests / fixtures | Legacy checkout has no `*.spec.ts` or SCL/XML fixture files found | New focused tests and representative fixtures are needed; baseline behavior cannot be treated as tested. Scaffold demo has `demo/sample.scd`. |
| Existing output | Destination | Editor-only scaffold, mapper UI, EditV2 linking, published SLD viewer, viewport controls and tests. The importer was removed per DP-5. |

## Technical analysis

### Current behavior and architecture

`process-icd-creator.ts` queries the first IED and first Substation, shows
LNodes, permits linking unlinked `iedName="None"` LNodes to LNs of matching
class, and displays a JSON alert for type differences. When no substation is
present, it offers an uploaded bay template and imports the Substation and
referenced LNodeTypes. The local `sld-viewer` emits `select-equipment` for
diagram elements, selecting the LNode list scope. The DO resolution controls
are commented out and the CDC selection callback is empty.

The host supplies `doc` and `editCount`; edits use legacy
`@openscd/open-scd-core` `newEditEvent` (insert and attribute update). The UI
uses MWC dialogs and `@openenergytools/filterable-lists` action lists. Legacy
foundation code contains direct DOM queries and type comparison. No wizard
event appears in the actual entry's dependency graph; the separate bay
prototype uses one but is not part of this entry.

### Migration inventory

| Area | Evidence | Target / risks |
|---|---|---|
| Package/tooling | Legacy package metadata points to unrelated `scl-communication-editor.js`, though Rollup entry and demo use `process-icd-creator.js`. | Scaffold editor-only output, correct LNode Mapper metadata, shared `oscd` scripts, demo with Source Editor, remove unused menu completely. |
| Host | `doc`, `editCount` | Standalone plugin contract, `docVersion`, scoped components; verify update after host edits. |
| Edits | `linkLNode`, `loadSubstationFromTemplate` emit EditV1 | EditV2; check insertion order, duplicate type dependencies, transaction/undo behavior and errors using fixtures. Do not mutate host document directly. |
| Helpers | `@openenergytools/scl-lib`, `foundation/diffing.ts`; local renderer helpers | Evaluate v2 helper signatures and dependency handling; retain necessary comparison logic and migrate only live dependencies. Test missing and conflicting type cases. |
| UI | MWC dialog and filterable action list; globally defined SLD viewer | Scoped oscd-ui components; preserve search and accessible selection/actions. Source-locale text via `@lit/localize`. |
| SLD | Old direct attributes; current SLD package uses `Private type="OpenSCD-SLD-Layout"` and namespace `https://openscd.org/SCL/SSD/SLD/v0` | Replace local renderer with published package; preserve selected element behavior and highlighting. Read-only viewer versus editor selectable mode requires an interaction proof. Legacy conversion is external (DP-1). |
| SCL correctness | Imported template, referenced types, old layout namespace and Private data | Confirm ordering, namespace and Edition/schema constraints rather than assuming them. Test namespaced fixtures including decoy attributes, undo/redo and host refresh. |
| Tests and demo | Prototype explicitly untested; no source specs/fixtures found | Add focused behavior and browser interaction tests; test both new and legacy layouts, template import and missing substation. |

### SLD integration and viewport lessons

- Communication mapper uses scoped `SldSubstationViewer` with `doc`,
  `substation`, `docVersion`, `gridSize`, labels and highlight; it supplies its
  own scrollable viewport, not a feature automatically provided by the module.
  Bay Template Editor instead uses `SldEditor` and
  `oscd-sld-selected` (`detail.element`); the lower-level viewer has locked
  interaction by default. Prove a safe selectable/read-only setup before
  choosing: embedding an editing controller may expose unwanted diagram edits,
  whereas a viewer may require additional interaction plumbing.
- Its `zoomAt` rescales `gridSize` and adjusts scroll after Lit rendering to
  preserve the point under the mouse, or viewport center for controls. Wheel
  deltas are normalized by mode, clamped and exponentially scaled; grid size is
  bounded 4–128 with 1.25 button factor.
- Drag pan supports left and middle buttons, starts after a 4px threshold,
  captures the pointer and suppresses the click after a drag so selection
  remains distinct. Verify cancellation, child controls and actual equipment
  selection, not just synthetic viewport events.
- Fit-to-view uses diagram dimensions and margins, initially fits, and refits
  on resize only until the user pans/zooms. There are accessible zoom controls
  and keyboard shortcuts, excluding text entry. Avoid overriding host shortcuts.
- Minimal approach: implement these behaviors locally in the mapper's viewport
  for its single SLD; little cross-plugin coupling but some duplication. Scalable
  approach: extract a shared viewport component only after a stable shared API
  and ownership are agreed; adds a dependency/release coupling and should not
  delay the migration. Both need large-diagram performance tests; avoid
  recalculating LNode diffs and traversing the entire document on each wheel
  event. Persisting preferences is optional, not assumed.

### Risks and preserved defects

- SLD conversion is one-way for old SLD tooling according to
  `src/sld-migration-notice.ts`; the converter exists in SLD source but is not a
  declared public package export. Do not deep-import it or promise conversion
  without a supported API. Map communication's legacy detection is tied to IED
  placements and cannot automatically be reused for this mapper's diagrams.
- `loadSubstationFromTemplate` dereferences `substation` after checking it only
  for the first edit; no Substation can throw. The imported node and its type
  inserts are dispatched separately, with deduplication by ID only. Existing
  collisions, missing DataTypeTemplates, XML parser errors and references
  require explicit testing and a domain-safe design, not silent success.
- `compareDataTypeChild` recursively compares the same matching child twice;
  repeated full-document queries and render-time comparison pose scale risks.
  The current diff is directional; don't silently change its semantics.
- The legacy viewer receives a potentially absent `substation` despite its
  non-null assertion. Empty documents and transitions need explicit coverage.
- Selecting only the first IED/Substation is existing behavior; changing the
  model or adding a multi-IED workflow needs an agreed scope.
- Dependency version compatibility and exact published SLD API remain unverified;
  published versions checked 2026-11-19: SLD 1.0.0, oscd-ui 0.1.3.
- The installed `@openscd/scl-lib` `importLNodeType` can return inserts with an
  already-used type ID when definitions differ; when DataTypeTemplates is
  absent, separate calls can also produce separate detached container inserts.
  This no longer affects the mapper because DP-5 removed the importer.
- `oscd install-hooks` writes `git config --local core.hooksPath` and creates
  hooks. Since the workspace is not a Git repository and Git configuration is
  reserved to the user, dependency installation was run with
  `npm install --ignore-scripts`. Hook setup remains for after user Git init.
- `@openscd/scl-lib` documents `getReference` ordering only for Edition 2.1 /
  2007B4. This was an importer concern; DP-5 removed the insertion path.
  Linking updates attributes on an existing LNode and does not insert nodes.
- `npm install --ignore-scripts` reported 20 audit findings (1 low, 7 moderate,
  12 high). The bundle reports circular dependencies inside `oscd-editor-sld`.

## Questions and decisions

| ID | Question / options | Answer / rationale / affected phases | Status |
|---|---|---|---|
| DP-1 | How should legacy SLD layouts be handled? | Require external conversion and show a clear message for opened documents. The no-Substation notice is separate and does not name another plugin. | Decided |
| DP-2 | What npm package name should the new standalone editor use? | User chose `@omicronenergy/oscd-editor-lnode-mapper`; use consistently for metadata and exports. | Decided |
| DP-3 | How should import handle conflicting type IDs? | User originally chose to reject the whole import. | Superseded by DP-5 |
| DP-4 | Which Editions should template import support? | No Edition policy was adopted before the importer was removed. | Superseded by DP-5 |
| DP-5 | Should the mapper retain template import? | Remove the importer and its associated code; replace it with a neutral no-Substation notice. Keep existing linking behavior; defer unbinding, Function/LNode creation, tree fallback and UX redesign. | Approved and implemented 2026-11-20 |

### Scope revision

- Remove the file input, importer implementation and importer-only tests; keep
  LNode linking and SLD legacy-layout detection for opened documents.
- Replace the no-Substation empty state with a notice styled like the SLD
  editor's migration notice, without reference to templates or external
  plugins. The user's suggested wording describes adding Functions and LNodes,
  but the mapper links existing LNodes without creating either. Approved notice:
  "No Substation detected. Add a Substation to view and map its LNodes."
- User suggested a possible tree fallback if coordinates are absent. Treat as
  future design work rather than silently expanding this change. Without SLD
  layout the viewer defaults positions to (0,0) and dimensions to (1,1); the
  existing unscoped LNode list can still display and link LNodes, although
  diagram selection may be unusable. Partial layouts need separate analysis.
- User initially considered a broader workflow: edit Functions / EqFunctions
  under Substation elements and add or remove LNodes, choosing definitions
  from DataTypeTemplates or existing IED logical nodes. An IED logical node can
  belong to an IED specification/template; do not assume it describes a
  physically instantiated IED. Tree fallback is deferred.
- Investigation: `process-icd-creator.ts` is the Rollup entry and links existing
  LNodes; it does not create Functions or LNodes. The separate, non-entry
  `scl-bay-template.ts` contains Function/EqFunction and SubFunction operations
  and creation/removal of `iedName="None"` LNodes from LNodeTypes, but its
  prototype code is not tested and includes incomplete paths. It is evidence
  for the broader workflow, not proof it is complete or schema-correct.
- User clarified Function editing belongs to the Bay Template Editor and wants
  LNode Mapper parity first. Its current scope is linking existing Substation
  LNodes, not creating Functions or LNodes; unbinding is not implemented in the
  legacy entry. The screenshot shows four LNodes in one Function with paths
  truncated in list items; UX improvements are deferred. The requested
  importer removal remains an intentional exception to legacy parity.
- User approved the revised scope on 2026-11-20 in response to "Shall I proceed
  with that scope, including the neutral no-Substation notice in place of the
  importer?" Only linking parity and importer removal are approved; the
  proposed broader Function/LNode editing scope is withdrawn.

## Migration plan

| Step | Goal / changes | Prerequisites / decisions | Verification / exit criteria |
|---|---|---|---|
| 1 | Complete analysis, answer blockers and finalize this plan. | DP-1 and DP-2 decided. | Worklog populated; approval explicitly requested. |
| 2 | Adapt canonical scaffold for editor-only LNode Mapper; migrate live entry and required helpers, keep prototype behavior; modern host contract and localization. | Explicit plan approval and agreed package name; no overwrites of this worklog. | `npm install`, `npx tsc --noEmit`, `npm run build`, demo render, package/export and unused-scaffold checks. |
| 3 | Convert existing LNode links to EditV2; omit template import per DP-5. | Step 2. | Focused tests for event payloads and no direct host mutations; undo/redo in the shell. |
| 4 | Replace legacy MWC/action-list UI with scoped oscd-ui; preserve filtering and interaction. | Step 2; load relevant UI and list recipes. | Browser tests for filtering, keyboard, dialog, linking and disabled/empty states. |
| 5 | Replace local SLD renderer with the published viewer; detect legacy layouts in opened documents and direct users to convert them, per DP-1. | Phase 3; confirm published viewer and its selection API. | Fixtures for equipment selection, Private layout and namespace decoys; no automatic conversion or diagram editing. |
| 6 | Add agreed pan/zoom/fit interactions, adapted from communication mapper, and complete demo and regression checks. | Phase 5, interaction model confirmed. | Wheel anchoring, bounds, pan/click separation, resize, keyboard/text inputs, actual selection and scale tests; build, lint, test, bundle and demo. |

No separate wizard/dialog embedding phase is planned unless live dependency
analysis reveals one. Phase boundaries may need adjustment to keep each state
buildable; material scope changes need approval.

### Verification strategy

- Baseline: read-only file and Git inspection only; no tests/builds run.
- Implementation: install only after manifests change, then type-check and
  build after structural changes; focused Web Test Runner/browser tests, lint
  and bundle using scaffold tooling. User runs formatting-only tooling; do not
  invoke formatters.
- Validate current and legacy SLD data, namespace decoys, real diagram
  selection, link edits, undo/redo, and no-document/no-Substation flows.
- Inspect built exports/package contents for stale scaffold artifacts and use
  the demo host with Source Editor. Verify runtime interactions and large
  documents; absence of representative legacy fixtures is a gap to resolve.

## Plan approval

- Revision: 2026-11-20 (DP-5).
- Status: approved.
- DP-5 supersedes the earlier template-import decisions. Git-hook setup
  remains deferred until the user initializes Git.
- User approval evidence and scope: after reviewing the plan and confirming the
  prototype's mapping workflow, user said "ok, just checking - please proceed"
  on 2026-11-19; approved the documented migration and viewport phases.
- Revised scope approval: see DP-5 and the recorded response above.

## Step Status

| Step | Status | Evidence / next action |
|---|---|---|
| 1 - Planning | done | Inventory, risks, decisions and approvals recorded. |
| 2 - Standalone scaffold | in progress | Mapper, tests and demo render; normal install/hook setup deferred until user Git init. |
| 3 - Edit actions | done | Linking uses EditV2; browser event and earlier shell undo/redo verified. Import removed. |
| 4 - UI | in progress | Scoped oscd-ui list/dialog, filtering and click selection tested; complete final accessibility verification. |
| 5 - SLD | in progress | Published viewer, real equipment selection and legacy rejection tested; final phase verification pending. |
| 6 - Viewport and regression | in progress | Fit, cursor-centered wheel, keyboard zoom and drag/click separation tested; large-document and final checks remain. |
| 7 - Demo smoke-test fixes | done | All-IED picker, tree dialog and mapper-specific demo verified in Chromium. |
| 8 - Comparison dialog footer | done | Outlined Close action, right alignment and footer spacing verified in the bundled demo. |

## Step 1 Completion Summary

### Files created

- `worklog.md` — migration inventory, technical findings, decisions, phased
  implementation plan and verification strategy; no source files copied.

### Decision points applied

- DP-1 — require legacy layout conversion in the standalone SLD editor, and
  clearly handle both opened documents and uploaded templates.
- DP-2 — package name is `@omicronenergy/oscd-editor-lnode-mapper`.

### Known legacy bugs preserved (flagged for review)

- Template import may dereference a missing Substation and dispatches separate
  edits; verify and address errors and edit consistency within the migration.
- Diffing repeats recursive work; its directional semantics remain unchanged
  unless explicitly agreed. Unfinished CDC mapping is not expanded.

### Verification

- Read-only `git ... rev-parse HEAD` and `git ... status --short` checks passed
  for legacy source, scaffold, communication mapper, Bay Template Editor and
  SLD checkout; all were clean at inspection. Their revisions are recorded above.
- No tests, installs, builds, formatting or source modifications were run
  during planning.

## Step 3 Completion Summary

### Changes

- `src/foundation/lnode-mapping.ts` and `src/oscd-editor-lnode-mapper.ts` —
  update LNode reference attributes via EditV2 for matching LN/LN0 candidates
  in the first IED, preserving legacy behavior.
- `src/foundation/template-import.ts` and `src/foundation/template-import.spec.ts`
  — removed per DP-5. The mapper now shows a localized no-Substation notice
  with no upload action. Its component spec and `README.md` reflect this.

### Verification

- `npx tsc --noEmit`, `npm run build`, `npm test` (8 Chromium tests),
  `npm run lint`, `npm run bundle` and `npm pack --dry-run --ignore-scripts`
  passed after importer removal. Bundling still warns about circular
  dependencies in the SLD dependency. The package excludes the importer,
  demo and tests. No Git state changed.

## Step 7 Completion Summary

### Changes

- `src/foundation/lnode-mapping.ts` and `src/oscd-editor-lnode-mapper.ts` —
  offer same-class LN/LN0 targets from every IED in document order, labeled
  by IED and logical device. The picker explains when no target is found.
  EditV2 payloads are unchanged.
- `src/oscd-editor-lnode-mapper.ts` — replaced the JSON alert with an oscd-ui
  tree dialog and separate explanations for unresolved references and missing
  type definitions. Existing directional comparison semantics are unchanged.
- `demo/sample.scd` — replaced the communication fixture with a small
  illustrative 2007C5 document. Its second IED provides the only candidate
  for XCBR1, whose type comparison after binding shows a missing `OpCnt`.
  The workshop file remains an external regression file, not a demo asset.
- Initial zoom, diagram selection and rebinding stay outside this fix.

### Verification

- `npx tsc --noEmit`, `npm run build`, `npm test` (10 Chromium tests),
  `npm run lint`, `npm run bundle` and `npm pack --dry-run --ignore-scripts`
  passed. The SLD dependency still reports circular imports.
- `xmllint --noout --schema <local SCL 2007C5 schema>/SCL.xsd` accepted the new
  demo and its SCL after binding XCBR1 to `Switchgear`.
- In the bundled shell served only on localhost, Playwright clicked both
  XCBR1 targets and verified that the shell bound them to `Switchgear` in the
  demo and `SPEC_SCU` in the workshop file. It also checked that the demo
  comparison tree reported the missing `OpCnt`. No page errors; browser and
  server stopped after the check.

## Step 8 Completion Summary

- `src/oscd-editor-lnode-mapper.ts` — use an outlined Close button inside the
  dialog's actions wrapper so oscd-ui pads and end-aligns the footer without
  stretching the button. The existing dismiss behavior is unchanged.
- `npx tsc --noEmit`, `npm test` (10 Chromium tests), `npm run lint`, and
  `npm run bundle` passed. A bundled Chromium check measured 24 px of right
  and bottom padding and confirmed that Enter dismisses the dialog.
- SLD sample layout and zoom behavior intentionally unchanged.

## Resume and remaining work

- Source and reference revisions were read on 2026-11-19; destination had no
  files before creating this worklog. Recheck before implementation.
- Implemented editor, indexed LNode matching and EditV2 linking. Legacy type
  comparison remains directional. Scoped oscd-ui
  replaces the old list/dialog, and the published SLD viewer replaces the
  legacy renderer. The reference communication mapper demo sample was copied
  to `demo/sample.scd`.
- Before importer removal: `npm install --ignore-scripts`, `npx tsc --noEmit`, `npm run build`,
  `npm test` (14 tests), `npm run lint`, `npm run bundle` and
  `npm pack --dry-run --ignore-scripts` passed. A temporary localhost-only
  Playwright smoke check verified the bundled shell, SLD and 24 LNodes, linked a
  logical node through the actual shell, undid/redid the edit, and measured
  0.018 grid units of horizontal cursor-anchor deviation. The temporary server
  and browser were stopped. Bundle warnings and npm audit findings are above.
- Broader keyboard/accessibility and large-document verification remain open.
  Normal Git hooks are still deferred to the user's Git initialization.

## Demo smoke-test follow-up (2026-11-20)

- Highest priority: the workshop file's `XCBR1` is unbound. The first IED,
  `SPEC_BPCU`, has no matching `XCBR`; the match is in the third IED,
  `SPEC_SCU`. Both the migrated code and the inspected legacy checkout pick
  only the first IED. The reported difference with the previous version is
  not reproduced from that source and file order.
- The bundled communication demo has 24 named IED references, no unbound
  LNodes, 18 references without matching LN/LN0 targets and six resolving
  references. It has no DataTypeTemplates section. Named references are not
  offered the bind action, and missing reference or type data currently leads
  to `alert(undefined)`. These paths do not depend on SLD coordinates.
- Fit uses the declared Substation canvas (50 x 25 grid units in the workshop
  file), not the occupied area (voltage level width 17). Defer changes to fit,
  outline and selection UX as lower priority.

### Fix scope (approved and completed 2026-11-20)

The user approved this scope in response to the smoke-test fix prompt,
including candidates from all IEDs in the existing picker.

1. Offer matching LN/LN0 candidates from all IEDs in the existing searchable
   link picker, identify each target by IED and logical device, and show a
   clear no-match state. Preserve the existing EditV2 payload and selection.
2. Replace the native alert with an oscd-ui dialog and tree for type comparison.
   Distinguish an unresolved named reference from a resolved reference with
   unavailable type definitions; explain each rather than showing an empty
   tree. Do not silently rebind or unbind named references.
3. Use a mapper-specific demo sample with current-format SLD layout, at least
   one unbound LNode with a matching target, and one bound LNode with comparable
   types. Check a multi-IED match and both missing-data states in Chromium;
   verify actual linking and the details dialog in the demo shell, then run
   type-check, build, tests, lint and bundle.
