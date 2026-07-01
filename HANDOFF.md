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
  - `/tools/daily` daily time-hexagram record tool.
  - `/tools/calendar` Huangli / Jieqi field lookup tool.
  - `/tools/wuxing` stems, branches, hidden stems, five-elements and relation lookup.
  - `/tools/hexagrams` sixty-four hexagram matrix lookup.
  - `/tools/shichen` twelve double-hour time branch lookup.
  - `/tools` standalone tool index.
  - `/api/geocode` for birthplace coordinate lookup.

## 2026-07-01 Update

- Expanded the homepage from a 3-tool charting site into a larger metaphysics toolbox structure.
- Added actual routes for `每日一卦`, `黄历节气`, `干支五行速查`, `六十四卦速查`, `十二时辰速查`, and `/tools` index.
- Added reusable use-case navigation via `xuanToolSuites`: `出生盘排盘`, `问事起卦`, `日课时间`, and `基础资料库`.
- Homepage and `/tools` now show the same use-case suite grid before the flat tool list, so visitors can pick by intent first.
- Added planned feature cards for name five-elements lookup, compatibility comparison, question records, and AI analysis packages.
- Keep these two new tools field-only: no auspicious/inauspicious conclusions, no scare copy, no deterministic predictions.

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

1. Improve the individual tool pages visually so each page feels like the same product family.
2. Improve Liu Yao with alternate起卦 modes only after adding unit tests for each mode.
3. Add saved records / question notebook after public usage appears.
4. Add AI analysis packages only with explicit boundaries and copy/export tests.
5. If more tools are added, route them through `/tools` and `xuanToolSuites` first.
