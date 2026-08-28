/**
 * Fine-grained permission level within a single restaurant's admin
 * accounts. Only meaningful for AdminRole.RESTAURANT_ADMIN accounts -
 * SUPER_ADMIN accounts never carry a meaningful staffRole and bypass this
 * dimension entirely (their tenant-scoped actions always go through
 * impersonation, which mints a staffRole: OWNER token).
 *
 * - OWNER: full access to everything for their restaurant, including
 *   branding/settings and managing other staff accounts.
 * - EDITOR: day-to-day operations - menu, orders, tables/locations - but
 *   cannot touch restaurant settings/branding or staff accounts.
 * - VIEWER: read-only across everything.
 */
export enum StaffRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}
