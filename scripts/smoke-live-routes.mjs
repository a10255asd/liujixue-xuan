const DEFAULT_BASE_URL = "https://xuan.liujixue.cn";

const routes = [
  { path: "/", expects: ["鸡血玄策"] },
  { path: "/tools", expects: ["工具"] },
  { path: "/tools/bazi", expects: ["八字"] },
  { path: "/tools/ziwei", expects: ["紫微"] },
  { path: "/tools/liuyao", expects: ["六爻"] },
  { path: "/tools/tarot", expects: ["塔罗"] },
  { path: "/tools/dream", expects: ["梦境"] },
  { path: "/tools/records", expects: ["记录"] },
  { path: "/tools/ai-prompt", expects: ["AI"] },
  { path: "/tools/synthesis", expects: ["合参"] },
  { path: "/tools/compatibility", expects: ["合盘"] },
];

const baseUrl = (process.env.SMOKE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 12000);

function withTimeout() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return { controller, timeout };
}

async function checkRoute(route) {
  const url = `${baseUrl}${route.path}`;
  const { controller, timeout } = withTimeout();

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "liujixue-xuan-smoke/1.0",
      },
      signal: controller.signal,
    });
    const body = await response.text();
    const missingText = route.expects.filter((text) => !body.includes(text));

    return {
      url,
      ok: response.ok && missingText.length === 0,
      status: response.status,
      missingText,
    };
  } finally {
    clearTimeout(timeout);
  }
}

const results = await Promise.all(routes.map((route) => checkRoute(route)));
const failed = results.filter((result) => !result.ok);

for (const result of results) {
  const status = result.ok ? "OK" : "FAIL";
  const detail = result.missingText.length
    ? ` missing text: ${result.missingText.join(", ")}`
    : "";

  console.log(`${status} ${result.status} ${result.url}${detail}`);
}

if (failed.length > 0) {
  console.error(`Smoke test failed for ${failed.length} route(s).`);
  process.exitCode = 1;
}
