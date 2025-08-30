import * as m from './mock';

export const api = {
  approvals: async () => ({ ngos: m.pendingNGOs, donors: m.pendingDonors, drivers: m.pendingVolunteers }),
  donations: async () => m.donationOffers,
  drivers:   async () => m.drivers,
  batches:   async () => m.distributionBatches,
};
