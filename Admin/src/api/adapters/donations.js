// UI <-> API mappers for donations with BOTH kinds

export function toDonationUI(dto) {
  return {
    id: dto.id,
    donorId: dto.donorId,
    donorName: dto.donorName ?? '',
    packsFood: dto.packsFood ?? 0,
    packsSoup: dto.packsSoup ?? 0,
    pickupAt: dto.pickupAt,          // ISO string
    status: dto.status,
    assignedDriverId: dto.assignedDriverId ?? null,
    notes: dto.notes ?? '',
    createdAt: dto.createdAt,
  }
}

export function fromDonationCreate(payload) {
  // payload: { donorId, packsFood, packsSoup, pickupAt, notes }
  return {
    donorId: Number(payload.donorId),
    packsFood: Number(payload.packsFood || 0),
    packsSoup: Number(payload.packsSoup || 0),
    pickupAt: payload.pickupAt,
    notes: payload.notes ?? '',
  }
}
