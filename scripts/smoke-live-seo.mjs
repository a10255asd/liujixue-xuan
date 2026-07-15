const DEFAULT_BASE_URL = 'https://xuan.liujixue.cn'
const CANONICAL_BASE_URL = 'https://xuan.liujixue.cn'

const baseUrl = (process.env.SMOKE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 12000)

const checks = [
  {
    path: '/',
    label: 'home metadata',
    expects: [
      'theme-color" content="#f4efe6"',
      'color-scheme" content="light"',
      `<link rel="canonical" href="${CANONICAL_BASE_URL}"`
    ]
  },
  {
    path: '/robots.txt',
    label: 'robots policy',
    expects: [
      'Disallow: /api/',
      `Sitemap: ${CANONICAL_BASE_URL}/sitemap.xml`
    ]
  },
  {
    path: '/sitemap.xml',
    label: 'sitemap catalogue',
    expects: [
      `<loc>${CANONICAL_BASE_URL}/tools/bazi</loc>`,
      `<loc>${CANONICAL_BASE_URL}/classics</loc>`,
      `<loc>${CANONICAL_BASE_URL}/knowledge</loc>`,
      `<loc>${CANONICAL_BASE_URL}/llms.txt</loc>`
    ]
  },
  {
    path: '/llms.txt',
    label: 'llms summary',
    expects: [
      '# Jixue Xuan',
      `${CANONICAL_BASE_URL}/tools/bazi`,
      `${CANONICAL_BASE_URL}/tools/liuyao`,
      `${CANONICAL_BASE_URL}/classics`
    ]
  }
]

function withTimeout() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  return { controller, timeout }
}

async function checkPath(check) {
  const { controller, timeout } = withTimeout()

  try {
    const response = await fetch(`${baseUrl}${check.path}`, {
      headers: {
        'user-agent': 'liujixue-xuan-seo-smoke/1.0'
      },
      signal: controller.signal
    })
    const body = await response.text()
    const missingText = check.expects.filter(text => !body.includes(text))

    return {
      label: check.label,
      path: check.path,
      status: response.status,
      ok: response.ok && missingText.length === 0,
      missingText
    }
  } finally {
    clearTimeout(timeout)
  }
}

const results = await Promise.all(checks.map(checkPath))
const failed = results.filter(result => !result.ok)

for (const result of results) {
  const status = result.ok ? 'OK' : 'FAIL'
  const detail = result.missingText.length ? ` missing: ${result.missingText.join(', ')}` : ''

  console.log(`${status} ${result.status} ${baseUrl}${result.path} ${result.label}${detail}`)
}

if (failed.length > 0) {
  console.error(`SEO smoke failed for ${failed.length} check(s).`)
  process.exitCode = 1
}
