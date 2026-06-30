# Jixue Xuan

独立玄学排盘工具站，计划部署到 `https://xuan.liujixue.cn`。

当前 Vercel 生产地址：`https://liujixue-xuan.vercel.app`。

自定义域名已添加到 Vercel，DNS 需要添加：

```text
CNAME xuan d9b8b7be22d9773b.vercel-dns-017.com.
```

第一版目标：

- 首页展示东方命理工具矩阵。
- 复用已验证的八字、紫微斗数、六爻排盘逻辑。
- 支持排盘文本复制、文本下载和图片导出。
- 只输出排盘字段和机械规则标记，不输出吉凶断语、建议或人生判断。

## Scripts

```bash
npm run dev
npm run lint
npm run test:unit
npm run build
```

## Routes

- `/`
- `/tools/bazi`
- `/tools/ziwei`
- `/tools/liuyao`
- `/api/geocode`
- `/sitemap.xml`
- `/robots.txt`
