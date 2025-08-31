import { setupWorker } from 'msw/browser'
import { donationHandlers } from './handlers/donations'
import { donorHandlers } from './handlers/donors'
import { pickupHandlers } from './handlers/pickups'
import { driverHandlers } from './handlers/drivers'   // <-- add

export const worker = setupWorker(
  ...donationHandlers,
  ...donorHandlers,
  ...pickupHandlers,
  ...driverHandlers,   // <-- add
)
