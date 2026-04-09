import type { obligationDefinitions, obligations, recurrenceRules } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type GeneratedObligation = {
	key: string;
	dueDate: Date;
};

export type ObligationInsert = InferInsertModel<typeof obligations>;
export type ObligationInsertSet = ObligationInsert[];

export type Obligation = InferSelectModel<typeof obligations>;
export type ObligationSet = Obligation[];

export type ObligationDefinition = InferSelectModel<typeof obligationDefinitions>;
export type ObligationDefinitionSet = ObligationDefinition[];

export type RecurrenceRule = InferSelectModel<typeof recurrenceRules>;
export type ObligationDefinitionWithRecurrenceRule = ObligationDefinition & {
	recurrenceRule: RecurrenceRule | null;
};
export type ObligationDefinitionWithRecurrenceRuleSet = ObligationDefinitionWithRecurrenceRule[];
