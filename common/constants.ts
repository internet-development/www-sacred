export const MAX_SIZE_BYTES = 15728640;

// NOTE(jimmylee):
// https://github.com/internet-development/apis
// export const API = `http://localhost:10001/api`;
export const API = `https://api.internet.dev/api`;

export const Users = {
  tiers: {
    UNVERIFIED: 0,
    VERIFIED: 10,
    PAYING: 20,
    GENERAL_CO_WORKING: 30,
    PARTNER: 40,
    ADMIN: 100,
  },
};

export const Tiers = {
  PAYING: 899,
  GENERAL_CO_WORKING: 32900,
  PARTNER: 279000,
};

export const Payments = {
  899: 'PAYING',
  32900: 'GENERAL_CO_WORKING',
  279000: 'PARTNER',
};

export const Payouts = {
  PAYING: 1500,
  GENERAL_CO_WORKING: 45000,
  PARTNER: 45000,
};
