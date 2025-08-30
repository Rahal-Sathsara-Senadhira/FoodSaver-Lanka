// Placeholder layer to swap to real API later.
export const api = {
  approve: async (kind, payload) => ({ ok: true, kind, payload }),
  assignDriver: async (payload) => ({ ok: true, payload }),
};
