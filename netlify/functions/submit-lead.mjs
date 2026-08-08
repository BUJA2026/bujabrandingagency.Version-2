import { getStore } from '@netlify/blobs'

const sanitize = (v, max = 200) => String(v ?? '').trim().slice(0, max)

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const name = sanitize(body.name, 120)
  const phone = sanitize(body.phone, 40)
  const email = sanitize(body.email, 160)
  const platform = sanitize(body.platform, 60)
  const serviceType = sanitize(body.serviceType, 40)
  const tier = sanitize(body.tier, 20)
  const price = Number(body.price) || 0

  if (!name || !phone || !email || !platform || !serviceType || !tier || !price) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (!['GOLD', 'DIAMOND'].includes(tier)) {
    return new Response(JSON.stringify({ error: 'Invalid tier' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const timestamp = new Date().toISOString()
  const id = `${timestamp.replace(/[:.]/g, '-')}_${Math.random().toString(36).slice(2, 8)}`

  const lead = {
    id,
    name,
    phone,
    email,
    platform,
    serviceType,
    tier,
    price,
    status: 'pending',
    timestamp
  }

  const store = getStore('buja-leads')
  await store.setJSON(id, lead)

  return new Response(JSON.stringify({ ok: true, id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const config = {
  path: '/.netlify/functions/submit-lead'
}
