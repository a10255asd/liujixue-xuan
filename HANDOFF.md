# Jixue Xuan Handoff

## Current State

- Project path: `/Users/LIU/Documents/workTable/liujixue-xuan`
- Planned domain: `https://xuan.liujixue.cn`
- Purpose: standalone metaphysics charting site split away from `liujixue-main`.
- First version includes:
  - `/` homepage with tool matrix, daily inspiration block, knowledge blocks, and future membership/history placeholders.
  - `/tools/bazi` reusing the verified BaZi chart calculator.
  - `/tools/ziwei` reusing the verified Zi Wei Dou Shu calculator.
  - `/tools/liuyao` reusing the verified Liu Yao Na Jia chart calculator.
  - `/api/geocode` for birthplace coordinate lookup.

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

1. Deploy to Vercel as a separate project, likely `liujixue-xuan`.
2. Bind `xuan.liujixue.cn`.
3. Add a simple `/tools` index if the homepage grows too long.
4. Add daily one-hexagram or Huangli as a lightweight non-login feature.
5. Consider login/history/favorites only after the first public version has usage.
