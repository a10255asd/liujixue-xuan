# Jixue Xuan Handoff

## Current State

- Project path: `/Users/LIU/Documents/workTable/liujixue-xuan`
- Planned domain: `https://xuan.liujixue.cn`
- Vercel project: `a10255asds-projects/liujixue-xuan`
- Production URL: `https://liujixue-xuan.vercel.app`
- Custom domain status: added to Vercel, waiting for DNS.
- Required DNS record: `CNAME xuan d9b8b7be22d9773b.vercel-dns-017.com.`
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

1. Add the DNS record above at the current nameserver provider, then run `vercel domains verify xuan.liujixue.cn`.
2. Verify `https://xuan.liujixue.cn` after DNS propagation.
3. Add a simple `/tools` index if the homepage grows too long.
4. Add daily one-hexagram or Huangli as a lightweight non-login feature.
5. Consider login/history/favorites only after the first public version has usage.
