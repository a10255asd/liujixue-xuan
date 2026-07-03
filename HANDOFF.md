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

1. Add a small onboarding strip on `/tools/records` explaining the preferred loop: generate chart → direct handoff to AI/合盘 → save/export only when needed.
2. If more tools are added, route them through `/tools`, `xuanToolSuites`, unique `xuanTools.title` values, and structured tests first.
3. Consider dependency hygiene separately: `daliuren-lib` currently requires subpath import because its package `main` points to a missing bundled entry.
