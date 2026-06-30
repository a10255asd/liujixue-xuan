import { cityCoordinateFallbacks } from './birth-place-options.js'

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'
const PHOTON_ENDPOINT = 'https://photon.komoot.io/api/'
const OPEN_METEO_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search'
const REQUEST_TIMEOUT_MS = 4500

const localGeocodePoints = cityCoordinateFallbacks.map(point => ({
  ...point,
  source: '本地城市坐标'
}))

export const normalizeGeocodeQuery = value => String(value || '').trim().replace(/\s+/g, ' ').slice(0, 120)
const compactQuery = value => normalizeGeocodeQuery(value).replace(/\s+/g, '').replace(/[，,。]/g, '')

const toCoordinate = (value, min, max) => {
  const number = Number(value)
  if (!Number.isFinite(number) || number < min || number > max) return null
  return Math.round(number * 1000000) / 1000000
}

export function parseNominatimPlace(place = {}) {
  const latitude = toCoordinate(place.lat, -90, 90)
  const longitude = toCoordinate(place.lon, -180, 180)

  if (latitude === null || longitude === null) return null

  return {
    address: String(place.display_name || '').slice(0, 160),
    latitude,
    longitude,
    source: 'OpenStreetMap Nominatim'
  }
}

export function parsePhotonFeature(feature = {}) {
  const [longitudeValue, latitudeValue] = feature.geometry?.coordinates || []
  const latitude = toCoordinate(latitudeValue, -90, 90)
  const longitude = toCoordinate(longitudeValue, -180, 180)

  if (latitude === null || longitude === null) return null

  const properties = feature.properties || {}
  const address = [
    properties.name,
    properties.city,
    properties.county,
    properties.state,
    properties.country
  ].filter(Boolean).join(', ')

  return {
    address: address.slice(0, 160),
    latitude,
    longitude,
    source: 'Photon'
  }
}

export function parseOpenMeteoPlace(place = {}) {
  const latitude = toCoordinate(place.latitude, -90, 90)
  const longitude = toCoordinate(place.longitude, -180, 180)

  if (latitude === null || longitude === null) return null

  const address = [
    place.name,
    place.admin2,
    place.admin1,
    place.country
  ].filter(Boolean).join(', ')

  return {
    address: address.slice(0, 160),
    latitude,
    longitude,
    source: 'Open-Meteo'
  }
}

const getSearchBlob = result => JSON.stringify(result || {}).replace(/\s+/g, '')

const scoreGeocodeResult = (result, query) => {
  const normalized = compactQuery(query)
  const blob = getSearchBlob(result)
  let score = 0

  for (const token of normalizeGeocodeQuery(query).split(/\s+/).filter(Boolean)) {
    if (blob.includes(token)) score += 8
  }

  if (normalized && blob.includes(normalized)) score += 12
  if (blob.includes('中国') || blob.includes('"countrycode":"CN"') || blob.includes('"country_code":"CN"')) score += 4
  if (blob.includes('"osm_value":"city"') || blob.includes('"feature_code":"PPLA')) score += 4
  if (blob.includes('"osm_value":"region"')) score += 1
  if (blob.includes('"type":"house"') || blob.includes('"type":"street"')) score -= 3

  return score
}

export function pickBestGeocodeResult(results = [], parser = parseNominatimPlace, query = '') {
  let best = null
  let bestScore = Number.NEGATIVE_INFINITY

  for (const result of results) {
    const parsed = parser(result)
    if (!parsed) continue

    const score = scoreGeocodeResult(result, query)
    if (score > bestScore) {
      best = parsed
      bestScore = score
    }
  }

  return best
}

export function findLocalGeocodeResult(query, exactOnly = true) {
  const compact = compactQuery(query)
  if (!compact) return null

  const point = localGeocodePoints.find(item => item.aliases.some(alias => (
    exactOnly ? compact === compactQuery(alias) : compact.includes(compactQuery(alias))
  )))

  if (!point) return null

  return {
    address: point.address,
    latitude: point.latitude,
    longitude: point.longitude,
    source: point.source
  }
}

export function buildNominatimSearchUrl(query) {
  const url = new URL(NOMINATIM_ENDPOINT)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '3')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', 'zh-CN,zh,en')
  return url
}

export function buildPhotonSearchUrl(query) {
  const url = new URL(PHOTON_ENDPOINT)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', '5')
  return url
}

export function buildOpenMeteoSearchUrl(query) {
  const url = new URL(OPEN_METEO_ENDPOINT)
  const normalized = normalizeGeocodeQuery(query)
  const terms = normalized.split(/\s+/).filter(Boolean)
  url.searchParams.set('name', terms.at(-1) || normalized)
  url.searchParams.set('count', '5')
  url.searchParams.set('language', 'zh')
  url.searchParams.set('format', 'json')
  return url
}

const fetchJson = async (url, fetchImpl, headers = {}) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetchImpl(url, {
      headers: {
        Accept: 'application/json',
        ...headers
      },
      signal: controller.signal
    })

    if (!response.ok) return null

    return response.json()
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export async function geocodeAddress(query, fetchImpl = fetch) {
  const normalizedQuery = normalizeGeocodeQuery(query)
  if (!normalizedQuery) {
    return { ok: false, status: 400, error: '请输入出生地址' }
  }

  const localExact = findLocalGeocodeResult(normalizedQuery, true)
  if (localExact) return { ok: true, status: 200, result: localExact }

  const photonData = await fetchJson(buildPhotonSearchUrl(normalizedQuery), fetchImpl)
  const photonResult = pickBestGeocodeResult(photonData?.features || [], parsePhotonFeature, normalizedQuery)
  if (photonResult) return { ok: true, status: 200, result: photonResult }

  const openMeteoData = await fetchJson(buildOpenMeteoSearchUrl(normalizedQuery), fetchImpl)
  const openMeteoResult = pickBestGeocodeResult(openMeteoData?.results || [], parseOpenMeteoPlace, normalizedQuery)
  if (openMeteoResult) return { ok: true, status: 200, result: openMeteoResult }

  const nominatimData = await fetchJson(buildNominatimSearchUrl(normalizedQuery), fetchImpl, {
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.6',
    'User-Agent': 'liujixue-main/1.0 (https://liujixue.cn)'
  })
  const nominatimResult = pickBestGeocodeResult(Array.isArray(nominatimData) ? nominatimData : [], parseNominatimPlace, normalizedQuery)
  if (nominatimResult) return { ok: true, status: 200, result: nominatimResult }

  const localFallback = findLocalGeocodeResult(normalizedQuery, false)
  if (localFallback) return { ok: true, status: 200, result: localFallback }

  return { ok: false, status: 404, error: '没有找到匹配地址，请补充城市或区县' }
}
