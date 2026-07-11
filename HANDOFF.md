# Jixue Xuan Handoff

## Current State

- Project path: `/Users/LIU/Documents/workTable/liujixue-xuan`
- Production domain: `https://xuan.liujixue.cn`
- Vercel project: `a10255asds-projects/liujixue-xuan`
- Production fallback URL: `https://liujixue-xuan.vercel.app`
- Purpose: standalone metaphysics charting site split from `liujixue-main`.

## Product Direction

- Keep the site focused on charting, structured fields, and chart image download.
- Core chart tools should not output fortune claims, deterministic judgement, scare copy, medical/legal/investment advice, or final life decisions.
- Tool action areas should keep only chart/image download as the visible export action.
- Do not reintroduce cross-tool analysis workspaces, local record centers, or send-to-analysis flows unless the user explicitly asks for them again.

## Live Routes

- `/` homepage
- `/tools` tool index
- `/tools/bazi` BaZi professional fine chart
- `/tools/ziwei` Zi Wei Dou Shu chart
- `/tools/liuyao` Liu Yao Na Jia chart
- `/tools/meihua` Meihua Yishu chart
- `/tools/qimen` Qimen Dunjia chart
- `/tools/daliuren` Da Liu Ren chart
- `/tools/calendar` Huangli / Jieqi lookup
- `/tools/date-selection` date range selection overview
- `/tools/daily-fortune` daily field overview
- `/tools/daily` daily time hexagram
- `/tools/tarot` Tarot draw field output
- `/tools/dream` dream journal field record
- `/tools/name` name five-grid / five-elements fields
- `/tools/wuxing` stems, branches, hidden stems, five-elements lookup
- `/tools/hexagrams` sixty-four hexagram lookup
- `/tools/shichen` twelve double-hour lookup
- `/tools/birth-time` birth-time correction comparison
- `/tools/find-time` twelve-hour candidate table
- `/classics` source/classics index
- `/knowledge` knowledge map
- `/api/geocode` birthplace coordinate lookup

## Recent Change

- Removed public routes for the old analysis-oriented workspaces.
- Removed the old local records route, dashboard, copy helpers, and local-record storage utilities from the product surface.
- Removed visible cross-tool action buttons from chart export panels, daily tools, calendar tools, and structured tools.
- Changed BaZi, ZiWei, LiuYao, daily, calendar, and structured tool action areas to image-download only.
- Upgraded LiuYao image export from the generic text card to a dedicated professional chart image with meta rows, hexagram summary, six lines, six gods, na-jia, moving/change marks, world/response, hidden/flying spirits, and relation tags.
- Updated homepage, tool index, site catalogue, sitemap source, and smoke routes to match the chart/download direction.
- Simplified `StructuredTool` so it no longer consumes pending cross-page payloads or copy/save actions.

## Verification

Run from `/Users/LIU/Documents/workTable/liujixue-xuan`:

```bash
npm run test:unit
npm run build
```

Expected result: unit tests and production build pass.

After deployment:

```bash
npm run smoke:live
```

The smoke script checks `/`, `/tools`, BaZi, ZiWei, LiuYao, Meihua, Qimen, Da Liu Ren, Tarot, and Dream.

## Deployment

The usual deploy flow is:

```bash
git push origin main
vercel --prod --token "$VERCEL_TOKEN"
```

Never paste or commit secret tokens. Keep environment-specific values in the shell or Vercel project settings.
