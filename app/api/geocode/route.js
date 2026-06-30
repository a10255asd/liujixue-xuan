import { geocodeAddress, normalizeGeocodeQuery } from '@/lib/geocode'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const address = normalizeGeocodeQuery(searchParams.get('address'))
  const geocode = await geocodeAddress(address)

  if (!geocode.ok) {
    return Response.json(
      { error: geocode.error },
      { status: geocode.status }
    )
  }

  return Response.json({
    address: geocode.result.address,
    latitude: geocode.result.latitude,
    longitude: geocode.result.longitude,
    source: geocode.result.source
  })
}
