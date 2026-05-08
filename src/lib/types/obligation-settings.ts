export type RecurrenceFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// export type ObligationSettingUI = {
// 	id: string;
// 	templateId: string;

// 	key: string;
// 	name: string;
// 	category: 'operational' | 'governance';

// 	enabled: boolean;
// 	configured: boolean;

// 	frequency: RecurrenceFrequency | null;
// 	interval: number;

// 	anchorDate: string | null;

// 	dayOfWeek: number | null;
// 	dayOfMonth: number | null;
// 	monthOfYear: number | null;

// 	endOfMonth: boolean;
// };

export type ObligationSettingForm = {
	id: string;

	key: string;
	name: string;

	category: 'operational' | 'governance';

	enabled: boolean;
	configured: boolean;

	frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null;

	interval: number;

	anchorDate: string | null;

	dayOfWeek: number | null;

	dayOfMonth: number | null;

	monthOfYear: number | null;

	recurrenceType: 'day_of_month' | 'last_day_of_month' | null;
};