export const NoFlags = 0b0000000
export const Placement = 0b0000001
export const Update = 0b0000010
export const ChildDeletion = 0b0000100

export const MutationMask = Placement | Update | ChildDeletion
