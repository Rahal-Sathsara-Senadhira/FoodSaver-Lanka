import { http, HttpResponse } from 'msw'

const donors = [
  { id: 10, name: 'ABC Bakery', approved: true },
  { id: 11, name: 'Fresh Farm', approved: true },
  { id: 12, name: 'Ocean View Hotel', approved: true },
  { id: 13, name: 'Green Leaf Restaurant', approved: false }, // not listed when approved=true
]

export const donorHandlers = [
  // GET /donors?approved=true&q=
  http.get('*/donors', ({ request }) => {
    const url = new URL(request.url)
    const approved = url.searchParams.get('approved')
    const q = (url.searchParams.get('q') || '').toLowerCase()
    let data = donors
    if (approved === 'true') data = data.filter(d => d.approved)
    if (q) data = data.filter(d => d.name.toLowerCase().includes(q))
    return HttpResponse.json({ data, total: data.length })
  }),
]
