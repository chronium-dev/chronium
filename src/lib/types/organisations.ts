import type { organisation, organisationObligationSettings } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Organisation = InferSelectModel<typeof organisation>;
export type NewOrganisation = InferInsertModel<typeof organisation>;
export type UpdateOrganisation = Partial<NewOrganisation>;

export type OrganisationObligationSetting = InferSelectModel<typeof organisationObligationSettings>;
