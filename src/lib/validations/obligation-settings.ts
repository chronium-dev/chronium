import { z } from 'zod';

export const obligationSettingSchema = z.object({
	id: z.string(),
	key: z.string(),
	enabled: z.boolean(),
	configured: z.boolean(),
	frequency: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']).nullable(),
	interval: z.number().min(1),
	anchorDate: z.string().nullable(),
	dayOfWeek: z.number().nullable(),
	dayOfMonth: z.number().nullable(),
	monthOfYear: z.number().nullable(),
	recurrenceType: z.enum(['day_of_month', 'last_day_of_month']).nullable(),
	obligationTemplateName: z.string(),
	obligationTemplateDescription: z.string().nullable(),
	category: z.enum(['statutory', 'operational', 'governance'])
});

export const obligationSettingsFormSchema = z.object({
	settings: z.array(obligationSettingSchema)
});

export type ObligationSettingsForm = z.infer<typeof obligationSettingsFormSchema>;

export type ObligationSetting = z.infer<typeof obligationSettingSchema>;
