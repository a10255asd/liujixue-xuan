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

- 2026-07-18 视觉系统批次「玄墨 · 香槟金 · 朱砂」：
  - 全站去青绿（#0d6f61/#13746a 等），统一为金 `#a98336` / 深金 `#7c5f22` / 朱砂 `#a7392d` / 玄墨 `#16130e` / 宣纸 `#f6f1e7`；globals.css 变量已改，历史轮次里的硬编码色值已批量替换。
  - 展示字体改为本地子集化思源宋体：`app/fonts/NotoSerifSC-VF.subset.woff2`（可变字重 200-900，约 419KB），经 `next/font/local` 暴露 `--font-display`；全站 h1/h2/h3 走 `--display` 字体栈。不要改回系统字体栈。
  - 字体再生成方法：从 gh 镜像下载 `NotoSerifSC[wght].ttf`，按 `app/fonts/charset.txt` 用 `pyftsubset --flavor=woff2 --text-file=charset.txt` 子集化（需 fontTools + brotli）。新增页面文案后如缺字，重跑提取脚本重建 charset.txt。
  - 首页 Hero 重做：右侧换成 `components/xuan-compass.jsx` 罗盘 SVG（地支/天干/八卦三环慢转 + 太极），旧 `xuan-hero-scene` 和 `xuan-hero-console` 结构已移除，底部新增 `xuan-hero-strip` 核心工具条。
  - 新增 `components/tool-mark.jsx`：六大主工具的卦爻/宫位线条符号（八字四柱、紫微十二宫、六爻、梅花、奇门九宫、六壬三传），替换卡片序号。
  - kicker 全部中文化（用途/成果/主盘/典籍/路径/续读/用法等），卡片序号 `01/02/03` 改天干 `甲乙丙`，`lib/site.js` 的 eyebrow 已中文化；页脚标语「只排盘 · 不断事」。
  - 圆角收敛：卡片/按钮 3px、tag 2px，彩色阴影换中性浅影；新增纸张噪点 `body::before`、入场动效（`xuan-rise` + `animation-timeline: view()`），均带 `prefers-reduced-motion` 兜底。
  - OG 图 `app/opengraph-image.jsx` 同步朱砂印章 + 墨金体系；`layout.jsx` themeColor 改 `#12100b`。
  - 环境注意：本机 Kimi 托管 Node 跑 `npm run build`（webpack worker）会卡在 compile 阶段 0% CPU，用 `npx next build --turbopack` 可通过；用户自己终端的 webpack 构建不受影响时按原流程即可。
- Refined homepage visual system on 2026-07-12: tightened hero typography, removed awkward desktop heading wrap, unified primary buttons as smoke-graphite with restrained champagne edges, and fixed mobile horizontal overflow in the hero/console area.
- Removed public routes for the old analysis-oriented workspaces.
- Removed the old local records route, dashboard, copy helpers, and local-record storage utilities from the product surface.
- Removed visible cross-tool action buttons from chart export panels, daily tools, calendar tools, and structured tools.
- Changed BaZi, ZiWei, LiuYao, daily, calendar, and structured tool action areas to image-download only.
- Upgraded LiuYao image export from the generic text card to a dedicated professional chart image with meta rows, hexagram summary, six lines, six gods, na-jia, moving/change marks, world/response, hidden/flying spirits, and relation tags.
- Added `lib/liujixue-api.js` for the shared backend at `NEXT_PUBLIC_API_BASE_URL`.
- Connected the single visible chart-image download action to `POST /api/tool-events` after a successful local image download.
- Added `lib/tool-event-tracking.js` so chart download analytics are built in one place with visitor/session IDs, source path, tool code, image kind, and structural counts.
- Chart download event metadata must not include birth-date subtitles, birthplace strings, generated filenames, or other unnecessary personal chart details.
- Kept the visible product surface unchanged: chart tools still only show image download, with no send-to-analysis, record center, or extra share button.
- Added `toolCode` to BaZi, ZiWei, LiuYao, daily, calendar, and structured-tool image payloads so backend events can distinguish tools.
- Upgraded Next.js and `eslint-config-next` from 14.2.35 to 15.5.20 and added a PostCSS override to 8.5.17; official npm audit currently reports 0 vulnerabilities.
- Updated homepage, tool index, site catalogue, sitemap source, and smoke routes to match the chart/download direction.
- Simplified `StructuredTool` so it no longer consumes pending cross-page payloads or copy/save actions.

## Verification

Run from `/Users/LIU/Documents/workTable/liujixue-xuan`:

```bash
npm run test:unit
npm run build
npm run audit:official -- --json
```

Expected result: unit tests, production build, and official npm audit pass.

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

Frontend API env. Use the official API domain after it is ready; until then the mall-domain prefix is the verified production backend path:

```bash
NEXT_PUBLIC_API_BASE_URL=https://mall.liujixue.cn/_liujixue-api
```
