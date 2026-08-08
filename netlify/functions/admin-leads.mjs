import { getStore } from '@netlify/blobs'

export default async (req) => {
  const url = new URL(req.url)
  const providedKey = url.searchParams.get('key') || req.headers.get('x-admin-key') || ''
  const requiredKey = Netlify.env.get('BUJA_ADMIN_KEY')

  if (!requiredKey) {
    return new Response(JSON.stringify({
      error: 'Admin access is not configured. Set BUJA_ADMIN_KEY in Netlify environment variables.'
    }), { status: 503, headers: { 'Content-Type': 'application/json' } })
  }

  if (providedKey !== requiredKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const store = getStore('buja-leads')
  const { blobs } = await store.list()

  const leads = await Promise.all(
    blobs.map((b) => store.get(b.key, { type: 'json' }))
  )

  leads.sort((a, b) => (b?.timestamp || '').localeCompare(a?.timestamp || ''))

  return new Response(JSON.stringify({ count: leads.length, leads }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const config = {
  path: '/.netlify/functions/admin-leads'
}
