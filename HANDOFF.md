# Jixue Xuan Handoff

## Current State

- Project path: `/Users/LIU/Documents/workTable/liujixue-xuan`
- Planned domain: `https://xuan.liujixue.cn`
- Vercel project: `a10255asds-projects/liujixue-xuan`
- Production URL: `https://liujixue-xuan.vercel.app`
- Custom domain status: live at `https://xuan.liujixue.cn`.
- Required DNS record: `CNAME xuan d9b8b7be22d9773b.vercel-dns-017.com.`
- Purpose: standalone metaphysics charting site split away from `liujixue-main`.
- First version includes:
  - `/` homepage with tool matrix, daily inspiration block, knowledge blocks, and future membership/history placeholders.
  - `/tools/bazi` reusing the verified BaZi chart calculator.
  - `/tools/ziwei` reusing the verified Zi Wei Dou Shu calculator.
  - `/tools/compatibility` paired chart field comparison and AI handoff material builder.
  - `/tools/liuyao` reusing the verified Liu Yao Na Jia chart calculator.
  - `/tools/meihua` Meihua Yishu number/time charting fields.
  - `/tools/tarot` deterministic Tarot draw with 78-card deck, spreads, upright/reversed fields, and AI handoff.
  - `/tools/dream` dream journal material organizer with emotion, scene, symbol, context, and AI handoff prompt fields.
  - `/tools/daily` daily time-hexagram record tool.
  - `/tools/qimen` Qimen Dunjia Chai-Bu method chart using `qimen-dunjia`.
  - `/tools/daliuren` Da Liu Ren four lessons / three transmissions chart using `daliuren-lib`.
  - `/tools/calendar` Huangli / Jieqi field lookup tool.
  - `/tools/date-selection` date-range Huangli selection overview.
  - `/tools/daily-fortune` daily fields overview.
  - `/tools/wuxing` stems, branches, hidden stems, five-elements and relation lookup.
  - `/tools/name` name five-grid / five-elements field calculator.
  - `/tools/hexagrams` sixty-four hexagram matrix lookup.
  - `/tools/shichen` twelve double-hour time branch lookup.
  - `/tools/birth-time` birth-time correction comparison table.
  - `/tools/find-time` twelve-hour candidate chart table.
  - `/tools/records` local favorites and saved chart records.
  - `/tools/ai-prompt` AI handoff prompt builder with explicit analysis boundaries.
  - `/tools/synthesis` multi-tool synthesis workspace for birth charts, question charts, Tarot, calendar fields, records, and AI handoff.
  - `/classics` classics/source index.
  - `/knowledge` knowledge map / flow explanation page.
  - `/tools` standalone tool index.
  - `/api/geocode` for birthplace coordinate lookup.

## 2026-07-01 Update

- Expanded the homepage from a 3-tool charting site into a larger metaphysics toolbox structure.
- Added actual routes for `每日一卦`, `黄历节气`, `干支五行速查`, `六十四卦速查`, `十二时辰速查`, and `/tools` index.
- Added reusable use-case navigation via `xuanToolSuites`: `出生盘排盘`, `问事起卦`, `日课时间`, and `基础资料库`.
- Homepage and `/tools` now show the same use-case suite grid before the flat tool list, so visitors can pick by intent first.
- Individual tool pages now use `ToolPageFrame` to derive the current tool and suite, then show a focused status/tags/related-tools panel instead of a flat all-tools switcher.
- Heavy tool input panels were visually upgraded inside `xuan-tool-workspace`: dark panel headers, stronger form controls, clearer active segmented controls, wider vertical birthplace selectors, and cleaner Liu Yao line buttons.
- Heavy tool result panels now share the same premium surface language: dark section headers, refined export buttons, upgraded BaZi fine table and luck cards, stronger Zi Wei palace grid, improved Liu Yao table styling, and lighter tool-card CTAs.
- Removed the Liu Yao visible boundary note card so the chart page focuses on field output.
- Added planned feature cards for name five-elements lookup, compatibility comparison, question records, and AI analysis packages.
- Keep these two new tools field-only: no auspicious/inauspicious conclusions, no scare copy, no deterministic predictions.

## 2026-07-02 Update

- Ran production/mobile visual QA for BaZi, ZiWei, and LiuYao after the result-panel polish.
- Fixed BaZi mobile luck cards: `大运` / `流年` now force a two-column grid under 640px so cards no longer clip on the right edge.
- Added mobile wrapping protection for chart export action buttons inside heavy tool result headers.
- Verified ZiWei and LiuYao mobile long screenshots: wide palace/table sections stay inside internal horizontal scroll containers, with no page-level layout break observed.
- Added LiuYao alternate起卦 modes after tests: `手动指定`, `三数起卦`, and `时间起卦`.
- LiuYao engine now stores stable method keys (`manual`, `numbers`, `time`) while UI/export text shows Chinese method labels and a `起卦推导` field.
- Added unit tests for three-number and time-based LiuYao derivation, including expected本卦、变卦、动爻 and time-method lunar fields.
- Added the first two parity batches versus `suanlemeai.cn` while intentionally skipping membership/payment:
  - New tool pages: `/tools/meihua`, `/tools/name`, `/tools/daily-fortune`, `/tools/qimen`, `/tools/daliuren`, `/tools/birth-time`, `/tools/find-time`, `/tools/date-selection`.
  - New product loop page: `/tools/records`, backed by browser `localStorage` for favorites and saved records.
  - New content layer pages: `/classics` and `/knowledge`.
- Added `lib/structured-tools.js` and `components/structured-tool.jsx` so lightweight tools share one input/result/copy/save/favorite pattern.
- Structured tools currently output field overviews only. `qimen` now uses the `qimen-dunjia` Chai-Bu method library for chart fields; `daliuren` now uses `daliuren-lib` for month-general, four-lessons, three-transmissions and heavenly-general fields. Neither page outputs final judgement copy.
- Updated `xuanTools` / `xuanToolSuites` to cover all 19 online entries once; sitemap now includes the new routes through `xuanTools`.
- Added `tests/structured-tools.test.mjs` for structured tool catalogue, Meihua baseline, date-selection range clamp, and name five-grid calculations.
- Mobile QA checked `/tools`, `/tools/meihua`, `/tools/qimen`, `/tools/daliuren`, `/tools/date-selection`, `/tools/birth-time`, `/tools/name`, `/tools/records`, `/classics`, and `/knowledge`; no page-level horizontal overflow was observed at 390px.
- Added shared local-memory helpers in `lib/local-memory.js`.
- BaZi, ZiWei and LiuYao heavy chart export actions now include `保存记录`, so their AI/export text can be stored into `/tools/records`.
- `/tools/calendar` and `/tools/daily` direct-copy actions now also include `保存记录`, so lightweight日课/起卦 records can enter the same local record center.
- `/tools/records` now supports:
  - favorite tool strip,
  - record search,
  - record tool filter,
  - favorite-only filter,
  - JSON export,
  - JSON import / merge.
- Added `tests/local-memory.test.mjs` for record/favorite merge behavior.
- Mobile QA checked `/tools/records` and `/tools/bazi` at 390px after record enhancements; no page-level horizontal overflow was observed, and BaZi export actions include `保存记录`.
- Mobile QA checked `/tools/calendar` and `/tools/daily` at 390px after direct-save enhancements; no page-level horizontal overflow was observed, action buttons stack cleanly, and `保存记录` changes to `已保存` after click.
- Upgraded `/tools/qimen` from a local placeholder rotation into a `qimen-dunjia@2.1.0` based Chai-Bu method chart.
- `/tools/qimen` now exports节气三元、阴阳遁局、旬首符首、值符值使、天盘地盘、八门九星八神、九宫综合盘 and分层盘面.
- Added structured matrix rendering in `StructuredTool` for nine-palace charts, with compact mobile stacking at 390px.
- Added a Qimen regression test; unit coverage is now 28 passing tests.
- Mobile QA checked `/tools/qimen` at 390px after the Qimen upgrade; no page-level horizontal overflow was observed, nine palace cells render, simplified text is consistent, and `保存记录` changes to `已保存`.
- Upgraded `/tools/daliuren` from a local field overview into a `daliuren-lib@0.2.1` based chart.
- `/tools/daliuren` now derives month general from the previous中气, then outputs天地盘十二宫、四课、三传、课型、干上 and twelve heavenly generals.
- Added Liuren matrix rendering using the shared `StructuredTool` palace-grid layout, with 12 + 4 + 3 cells stacking cleanly on mobile.
- Added a Daliuren regression test; unit coverage is now 29 passing tests.
- Mobile QA checked `/tools/daliuren` at 390px after the Liuren upgrade; no page-level horizontal overflow was observed, all 19 matrix cells render, and `保存记录` changes to `已保存`.
- Added `/tools/ai-prompt` as the first AI handoff package. It accepts chart type, analysis goal, output format, user question, background context and pasted chart fields, then exports only a boundary-safe prompt.
- `StructuredTool` now supports `output.copyText`, so tools can customize what the copy/save actions export without changing the visible result sections.
- `/tools/ai-prompt` is grouped under `资料记录`; `xuanTools` / `xuanToolSuites` now cover all 20 online entries once.
- Added an AI prompt regression test for boundary wording and copied chart fields; unit coverage is now 30 passing tests.
- Added `/tools/compatibility` as `合盘对照`. It accepts two pasted BaZi/ZiWei/mixed chart texts, shows field completeness and side-by-side summaries, then exports a boundary-safe AI handoff prompt.
- `合盘对照` is grouped under `出生盘排盘`; `xuanTools` / `xuanToolSuites` now cover all 21 online entries once.
- Added a compatibility regression test that checks paired fields and relationship-judgement boundaries; unit coverage is now 31 passing tests.
- Added record-to-tool shortcuts in `/tools/records`: each saved record can be sent to `/tools/ai-prompt`, or inserted as `合盘 A` / `合盘 B` into `/tools/compatibility`.
- Added localStorage handoff helpers in `lib/local-memory.js`; `StructuredTool` consumes and clears a pending handoff on page load.
- Added tests for handoff payloads and tool-side handoff application; unit coverage is now 33 passing tests.
- Added a lightweight worksheet inside `/tools/compatibility`: the left input panel now lists recent saved records and can fill them into `对象 A` or `对象 B` without returning to `/tools/records`.
- Added `recordSlots` / `applyRecordSlot` support to shared `StructuredTool`, currently used by `合盘对照`; unit coverage is now 34 passing tests.
- Added a compact “最近填入” indicator to `StructuredTool` record receivers. It shows the target slot and source record after `/tools/records` handoff or in-page record insertion, and clears the affected slot indicator once that field is manually edited.
- Mobile QA checked `/tools/compatibility` at 390px for record insertion indicators; `对象 A` / `对象 B` chips render without page overflow and manual edit removes only the edited slot.
- Added direct tool handoff actions:
  - BaZi and ZiWei professional export panels now show `送去 AI`, `合盘 A`, and `合盘 B`.
  - LiuYao, Huangli, Daily Hexagram, and structured tools such as Meihua/Qimen/Daliuren/Name/Date Selection can go directly to `/tools/ai-prompt`.
  - The target tool consumes the same localStorage handoff payload as `/tools/records`, so direct handoff and saved-record handoff share one flow.
- Mobile QA checked direct handoff at 390px: `/tools/bazi` → `合盘 A` fills `/tools/compatibility`; `/tools/meihua` → `送去 AI` fills `/tools/ai-prompt`; both paths have no page-level horizontal overflow.
- Added a compact workflow strip at the top of `/tools/records`: `生成排盘` → `直接接力` → `再做留档`, clarifying that records are for retention/export while most fresh charts can go straight to AI/合盘.
- Mobile QA checked `/tools/records` at 390px after the workflow strip; the three steps stack vertically and no page-level horizontal overflow was observed.
- Dependency hygiene pass:
  - Added `npm run audit:official` because the local `npmmirror` registry returns `NOT_IMPLEMENTED` for npm audit endpoints.
  - `npm_config_registry=https://registry.npmjs.org npm audit --json` reports 5 vulnerabilities: Next.js/PostCSS runtime chain and eslint-config-next/@next/eslint-plugin-next/glob dev chain.
  - npm's available fixes require semver-major upgrades (`next@15.5.20` and `eslint-config-next@16.2.10`); no low-risk patch/minor upgrade was applied.
  - `npm outdated --json` currently lists major-only upgrades for Next/React/eslint/Vercel analytics, so chart-output-safe dependency changes were intentionally deferred.
- Live smoke test pass:
  - Added `npm run smoke:live` for production route checks against `https://xuan.liujixue.cn` by default.
  - Override with `SMOKE_BASE_URL=http://localhost:3000 npm run smoke:live` for local checks or preview deployments.
  - Current route set covers `/`, `/tools`, `/tools/bazi`, `/tools/ziwei`, `/tools/liuyao`, `/tools/tarot`, `/tools/dream`, `/tools/records`, `/tools/ai-prompt`, `/tools/synthesis`, and `/tools/compatibility`.
- Added `/tools/tarot` as a lightweight parity feature:
  - Uses a complete 78-card Rider-Waite-style deck model with major/minor arcana names and keywords.
  - Supports single-card, three-card, relationship, and two-choice spreads.
  - Uses deterministic shuffling from question + spread + time + seed so records can be reproduced.
  - Exports card positions, upright/reversed fields, keywords, and AI handoff text only; no direct prediction copy.
- Added `/tools/synthesis` as a multi-tool合参 workspace:
  - Accepts birth-chart fields, question-chart fields, Tarot fields, calendar/date fields, and extra notes.
  - Direct handoff actions now include `合参`; the synthesis tool auto-routes incoming records by source tool into the closest input slot.
  - `/tools/records` record cards now expose `合参` alongside `送去 AI`, `合盘 A`, and `合盘 B`.
  - The output is a boundary-safe synthesis prompt and completeness summary only; it does not output final predictions.
- Added `/tools/dream` as a lightweight dream journal / AI handoff feature:
  - Captures title, date, wake time, focus, mood, intensity, scene, people, symbols, real-world context, and dream text.
  - Exports a boundary-safe AI prompt for dream material sorting only, with no omen, prediction, or deterministic interpretation copy.
  - The tool participates in favorites, records, AI handoff, and synthesis handoff through the shared structured tool layer.
- Product direction corrected after quality feedback:
  - Stop treating tool count as the main goal. The site is now in quality-first mode.
  - Added `xuanCoreTools`, `xuanSecondaryTools`, and `xuanPrimaryWorkflows` in `lib/site.js` so homepage and `/tools` can stay curated.
  - Homepage now exposes only three primary workflows: `出生排盘`, `问事起卦`, and `记录接力`.
  - `/tools` now shows core tools first and moves weaker/experimental/reference tools into a compact lab section.
  - Footer links now show only core tools plus `全部工具`, instead of listing the entire catalogue.

## 2026-07-04 Quality Pass

- Continued the quality-first correction. Do not resume adding new tools until the core workflows feel useful and stable.
- BaZi workflow polish completed in commit `bc0d3c8`:
  - Added `baZiExampleInputs` in `lib/bazi-chart.js` with two reusable sample charts.
  - `/tools/bazi` now includes quick sample loading, an input audit block, and a three-step post-chart workflow block.
  - Added unit baselines for the BaZi samples; unit coverage increased to 41 tests at that point.
  - Verified desktop/mobile layout locally and deployed to `https://xuan.liujixue.cn`.
- ZiWei workflow polish completed after the BaZi pass:
  - Added `ziWeiExampleInputs` in `lib/ziwei-chart.js` using the same two sample birth datasets.
  - `/tools/ziwei` now includes quick sample loading, an input audit block, and a three-step post-chart workflow block.
  - Generalized chart example/audit/workflow CSS classes so LiuYao and other core tools can reuse the pattern.
  - Added ZiWei sample baselines for `chineseDate`, true-solar chart time, `fiveElementsClass`, time branch and palace presence.
  - `npm run test:unit` now covers 42 passing tests.
- LiuYao workflow polish completed after ZiWei:
  - Added `liuYaoExampleInputs` in `lib/liuyao-chart.js` covering manual, three-number, and time-based起卦.
  - `/tools/liuyao` now includes quick sample loading, an input audit block, and a three-step post-chart workflow block.
  - Added LiuYao sample baselines for method coverage, 本卦/变卦, and moving-line output.
  - `npm run test:unit` now covers 43 passing tests.
- Records utility loop polish is now underway after the three core chart pages:
  - Added record preview and workflow inference helpers in `lib/local-memory.js`.
  - `/tools/records` now shows each saved record as an action card with category, recommended next step, key-field preview, direct AI/合参/合盘 handoff, and collapsed full text.
  - Structured tool record pickers reuse the same preview logic, so `/tools/synthesis` and `/tools/compatibility` show more useful saved-record summaries.
  - Added regression tests for record preview priority and workflow routing.
- AI / Synthesis / Compatibility workspace polish followed the Records pass:
  - `StructuredTool` fields now support concise placeholders and helper copy for production handoff fields.
  - `/tools/ai-prompt`, `/tools/synthesis`, and `/tools/compatibility` now start result output with a `交接摘要` before exposing the full prompt.
  - AI handoff now infers question-oriented mode for 六爻、梅花、奇门、六壬 style records, while birth-chart records stay structural.
  - 合盘 and 合参 handoffs now accumulate record sources in context instead of overwriting the previous source when multiple records are inserted.
  - Added regression coverage for material-status badges, handoff mode inference, and compatibility source accumulation.
- Records-to-workspace handoff polish followed the AI workspace pass:
  - Added `getMemoryRecordSlotSuggestion` in `lib/local-memory.js` so record cards and structured workspaces share one routing rule.
  - `/tools/records` now shows a dedicated `推荐下一步` block before the secondary actions; it explains whether the record should go to AI, 合参, or 合盘 A/B.
  - `/tools/synthesis` and `/tools/compatibility` record pickers now display a recommended target slot for each saved record, with the suggested slot highlighted.
  - Direct handoff buttons can now show short helper copy in roomy structured-tool panels while staying compact in chart export toolbars.
  - Added regression coverage for record-to-slot suggestion routing; unit coverage is now 46 passing tests.
- Browser/mobile handoff QA completed after the records routing pass:
  - Mobile viewport 390px was used in the in-app browser against local dev.
  - Saved one BaZi sample and one LiuYao sample through the actual UI.
  - Found and fixed a storage edge case: when `localStorage` is unavailable, `lib/local-memory.js` now falls back to page-session memory instead of silently showing a false saved state.
  - Verified `/tools/records` shows correct recommendation routing: BaZi -> 合参, LiuYao -> AI.
  - Verified `立即接力` fills `/tools/synthesis` birth-chart fields and `/tools/ai-prompt` LiuYao question mode.
  - Verified `/tools/compatibility` accepts birth-chart records into 对象 A and does not recommend LiuYao/question records for compatibility.
  - No page-level horizontal overflow was observed at 390px across the tested records, synthesis, AI prompt, and compatibility flow.
  - Added fallback-storage regression coverage; unit coverage is now 47 passing tests.
- Record de-duplication polish completed after browser QA:
  - `saveMemoryRecord` now uses a stable record fingerprint based on tool, href, and title.
  - Re-saving the same named record updates the existing card instead of adding duplicates.
  - Historical duplicate cards with the same fingerprint are collapsed the next time that record is saved.
  - Save buttons now distinguish `已保存` from `已更新` across chart export panels, structured tools, calendar, and daily hexagram.
  - Mobile browser QA at 390px verified duplicate BaZi saves show `已更新`, collapse existing duplicate 1996 cards to one, and do not create horizontal overflow.
  - Added regression coverage for repeated saves and historical duplicate collapse; unit coverage is now 49 passing tests.

## Source Boundaries

- Reference site reviewed: `https://suanlemeai.cn/`.
- Borrowed only broad product structure: tool matrix, daily practice idea, knowledge section, membership/history/favorites expansion slots.
- Do not copy its brand, visual assets, code, copywriting, pricing, or exact UI.

## Important Rules

- Keep the site focused on charting fields first.
- Do not add auspicious/inauspicious judgments, scare copy, medical/financial advice, or deterministic life predictions.
- If AI interpretation is added later, require an explicit analysis boundary, user-provided question context, and a separate regression/acceptance plan.
- If a future AI changes chart logic, preserve or expand the existing tests first.

## Verification

Run before committing:

```bash
npm run lint
npm run test:unit
npm run build
```

## Next Recommended Work

1. Do not add new tools by default. First improve core tool quality: BaZi, ZiWei, LiuYao, Records, AI Prompt, Synthesis, and Compatibility.
2. BaZi, ZiWei, LiuYao, Records, AI Prompt, Synthesis, and Compatibility now have the first quality-workflow pass and a completed mobile handoff QA pass. Next best work:
   - Add a compact record picker filter in `/tools/synthesis` and `/tools/compatibility` now that records can accumulate without accidental duplicates.
   - Consider clearer save feedback for fallback/session-only storage if desired.
   - Then do a visual pass on the record card density; do not change chart logic without tests.
3. Before adding any new metaphysics tool, run browser QA on the relevant core workflow and add sample baselines when chart logic is involved.
