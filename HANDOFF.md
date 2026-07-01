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
  - `/tools/liuyao` reusing the verified Liu Yao Na Jia chart calculator.
  - `/tools/meihua` Meihua Yishu number/time charting fields.
  - `/tools/daily` daily time-hexagram record tool.
  - `/tools/qimen` Qimen Dunjia first-version field overview.
  - `/tools/daliuren` Da Liu Ren first-version field overview.
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
- Structured tools currently output field overviews only. `qimen` and `daliuren` are explicitly first-version field overviews, not final professional judgement engines.
- Updated `xuanTools` / `xuanToolSuites` to cover all 19 online entries once; sitemap now includes the new routes through `xuanTools`.
- Added `tests/structured-tools.test.mjs` for structured tool catalogue, Meihua baseline, date-selection range clamp, and name five-grid calculations.
- Mobile QA checked `/tools`, `/tools/meihua`, `/tools/qimen`, `/tools/daliuren`, `/tools/date-selection`, `/tools/birth-time`, `/tools/name`, `/tools/records`, `/classics`, and `/knowledge`; no page-level horizontal overflow was observed at 390px.

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

1. Deepen professional accuracy for second-batch tools:
   - Replace the current `qimen` first-version overview with a verified library/table-driven full盘.
   - Replace the current `daliuren` first-version overview with verified四课三传/月将/贵人 rules.
   - Add regression examples before changing either engine.
2. Add richer history UX without membership:
   - Search/filter saved records.
   - Save records from BaZi, ZiWei, LiuYao, calendar and existing heavy tools, not only structured tools.
   - Export/import local records as JSON.
3. Add AI analysis packages only with explicit boundaries and copy/export tests.
4. If more tools are added, route them through `/tools`, `xuanToolSuites`, unique `xuanTools.title` values, and structured tests first.
