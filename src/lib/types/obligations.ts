import type { obligations, obligationTemplates } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type GeneratedObligation = {
	key: string;
	dueDate: Date;
};

export type ObligationInsert = InferInsertModel<typeof obligations>;
export type ObligationInsertSet = ObligationInsert[];

export type Obligation = InferSelectModel<typeof obligations>;
export type ObligationSet = Obligation[];

export type ObligationTemplate = InferSelectModel<typeof obligationTemplates>;
export type ObligationTemplateSet = ObligationTemplate[];

export type ObligationRuntimeContext = {
	enabledKeys: Set<string>;
	definitionMap: Record<string, { id: string; key: string }>;
};
