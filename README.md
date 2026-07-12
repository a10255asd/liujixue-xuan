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
- 支持排盘图片导出。
- 只输出排盘字段和机械规则标记，不输出吉凶断语、建议或人生判断。
- 工具下载事件可通过统一后端记录，但页面不增加额外分析或发送动作。

## Scripts

```bash
npm run dev
npm run lint
npm run test:unit
npm run build
```

## API 对接

配置后会在成功下载排盘图片后写入工具事件：

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.liujixue.cn
```

## Routes

- `/`
- `/tools/bazi`
- `/tools/ziwei`
- `/tools/liuyao`
- `/api/geocode`
- `/sitemap.xml`
- `/robots.txt`
