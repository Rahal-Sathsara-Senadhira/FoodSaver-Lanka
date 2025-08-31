import { http, HttpResponse } from 'msw'

const drivers = [
  { id: 201, firstName: 'Ishan', lastName: 'Perera', vehicleType: 'Bike',  vehicleNumber: 'WP-BIK-1234', phone: '077-111-2222', available: true },
  { id: 202, firstName: 'Ayesha', lastName: 'Jayasuriya', vehicleType: 'Car',  vehicleNumber: 'WP-CAR-4567', phone: '077-333-4444', available: true },
  { id: 203, firstName: 'Ruwan', lastName: 'Silva', vehicleType: 'Van',  vehicleNumber: 'WP-VAN-8910', phone: '077-555-6666', available: false }, // won't show by default
  { id: 204, firstName: 'Nadeesha', lastName: 'Fernando', vehicleType: 'Tuk',  vehicleNumber: 'WP-TUK-1111', phone: '077-777-8888', available: true },
]

export const driverHandlers = [
  // GET /drivers/available?q=
  http.get('*/drivers/available', ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') || '').toLowerCase()
    let data = drivers.filter(d => d.available)
    if (q) {
      data = data.filter(d =>
        `${d.firstName} ${d.lastName} ${d.vehicleType} ${d.vehicleNumber}`
          .toLowerCase()
          .includes(q)
      )
    }
    return HttpResponse.json({ data })
  }),
]
