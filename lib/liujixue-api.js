const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export function hasLiujixueApi() {
  return Boolean(apiBaseUrl)
}

async function postJson(path, payload) {
  if (!apiBaseUrl) {
    return {
      skipped: true,
      reason: 'missing_api_base_url'
    }
  }

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const data = await response.json().catch(() => null)

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || `request_failed_${response.status}`)
  }

  return data
}

export function recordToolEvent(payload) {
  return postJson('/api/tool-events', payload)
}

export function saveChartShare(payload) {
  return postJson('/api/xuan/chart-shares', payload)
}
