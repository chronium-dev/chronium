import { ObligationCategoryType, RecurrenceFrequencyType } from '$lib/server/db/schema';

export const jurisdictionUK = {
	id: 'jur_uk',
	key: 'uk',
	name: 'United Kingdom'
};

export const entityTypeUkLtd = {
	id: 'ent_uk_ltd',
	key: 'uk_ltd',
	name: 'UK Limited Company'
};

// export const organisationUkLtd: NewOrganisation = {
//   id: 'org_acme',
//   name: 'Acme Widgets Ltd',
//   jurisdictionId: jurisdictionUK.id,
//   entityTypeId: entityTypeUkLtd.id,
//   incorporationDate: '2025-02-12',
//   financialYearEndMonth: 2,
//   financialYearEndDay: 28,
//   vatRegistered: true,
//   payrollActive: true,
//   businessPremises: true
// };

export const obligationTemplatesSeeds = [
	// --- STATUTORY ---
	{
		key: 'annual_accounts',
		name: 'File Annual Accounts',
		description: 'Submit statutory accounts to Companies House.',
		penalties: `For late filing: £150 - £3,000`,
		category: ObligationCategoryType.Statutory,
		eventLabel: 'For accounting period ending {{eventDate}}'
	},
	{
		key: 'confirmation_statement',
		name: 'File Confirmation Statement',
		description: 'Submit confirmation statement confirming company details.',
		penalties: `Late or failed filing: Criminal offence plus large fines up to £5,000 per offence.`,
		category: ObligationCategoryType.Statutory,
		eventLabel: 'Annual requirement for period ending {{eventDate}}'
	},
	{
		key: 'corporation_tax_return',
		name: 'File Company Tax Return (CT600)',
		description: 'Submit corporation tax return to HMRC.',
		penalties: `For late filing: £200 - £Large`,
		category: ObligationCategoryType.Statutory,
		eventLabel: 'For accounting period ending {{eventDate}}'
	},
	{
		key: 'corporation_tax_payment',
		name: 'Pay Corporation Tax',
		description: 'Pay corporation tax due to HMRC.',
		penalties: `For late payment: £200 - £Huge!`,
		category: ObligationCategoryType.Statutory,
		eventLabel: 'For accounting period ending {{eventDate}}'
	},
	{
		key: 'vat_return_and_payment',
		name: 'Submit VAT Return & Payment',
		description: 'Submit VAT return and payment to HMRC.',
		penalties: `For late filing or late payment: £200 - 6% of VAT owed plus a daily penalty of 10% owed until paid.`,
		category: ObligationCategoryType.Statutory,
		eventLabel: 'For period ending {{eventDate}}'
	},
	{
		key: 'paye_payment',
		name: 'Pay PAYE',
		description: 'Pay PAYE and National Insurance contributions.',
		penalties: `For late filing: £100 per month plus additional surcharges on amount unpaid.`,
		category: ObligationCategoryType.Statutory,
		eventLabel: 'For period ending {{eventDate}}'
	},
	{
		key: 'final_fps',
		name: 'Submit Final FPS',
		description: 'Final Full Payment Submission due.',
		penalties: `For late filing: £100, with escalating and aggressive surcharges based on outstanding amounts.`,
		category: ObligationCategoryType.Statutory,
		eventLabel: 'For tax year ending {{eventDate}}'
	},

	// --- OPERATIONAL ---
	{
		key: 'employers_libability_insurance_renewal',
		name: "Renew Employers' Liability Insurance",
		description:
			"Employers' Liability (EL) Insurance: Mandatory if you employ at least one person, including part-time, temporary, or casual staff.",
		penalties: `Legal Minimum: You must have at least £5 million in cover.
	Penalties: You can be fined £2,500 for every day you are not properly insured.
	Exemptions: Generally not required for family-run businesses where all employees are close family members, or for limited companies with only one employee who owns more than 50% of the shares.`,
		category: ObligationCategoryType.Operational,
		isSystem: false,
		defaultFrequency: RecurrenceFrequencyType.Yearly,
		defaultValue: 1
	},

	{
		key: 'premises_insurance_policies',
		name: 'Review / Renew Premises Insurance Policies',
		description: `Review / renew insurance policies:
	Commercial Buildings, Business Contents, Stock, Business Interruption`,
		category: ObligationCategoryType.Operational,
		isSystem: false,
		defaultFrequency: RecurrenceFrequencyType.Yearly,
		defaultValue: 1
	},

	{
		key: 'liability_insurance_policies',
		name: 'Review / Renew Liability & Professional Insurance Policies',
		description: `Review / renew insurance policies:
	Public Liability, Professional Indemnity, Product Liability, Directors' and Officers' (D&O) Liability`,
		category: ObligationCategoryType.Operational,
		isSystem: false,
		defaultFrequency: RecurrenceFrequencyType.Yearly,
		defaultValue: 1
	},

	{
		key: 'specialised_risk_insurance_policies',
		name: 'Review / Renew Specialised Risk Insurance Policies',
		description: `Review / renew insurance policies:
	Cyber Insurance, Legal Expenses, Personal Accident`,
		category: ObligationCategoryType.Operational,
		isSystem: false,
		defaultFrequency: RecurrenceFrequencyType.Yearly,
		defaultValue: 1
	},

	{
		key: 'insurance_review',
		name: 'Review Insurance Cover',
		description: 'Ensure insurance coverage remains adequate.',
		category: ObligationCategoryType.Operational,
		isSystem: false,
		defaultFrequency: RecurrenceFrequencyType.Yearly,
		defaultValue: 1
	},
	{
		key: 'pat_testing',
		name: 'PAT Testing',
		description: 'Portable appliance electrical safety testing.',
		penalties: `Fines are issued for failing to maintain safe equipment, not specifically for missing a PAT test. However, without PAT records, it is very difficult to prove you have met your legal duty of care.
	Fines of up to £5,000 and/or 6 month imprisonment for standard breaches, but for serious neglect, longer prison sentence and fines up to £10 million.`,
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'fire_safety_inspection',
		name: 'Fire Safety Inspection',
		description: 'Inspection of fire safety measures. Best Practice: Every 12 months.',
		penalties: `Minor breaches up to £5,000, for major breaches unlimited fines and up to 2 years in prison.`,
		category: ObligationCategoryType.Operational,
		isSystem: false,
		defaultFrequency: RecurrenceFrequencyType.Yearly,
		defaultValue: 1
	},
	{
		key: 'domain_renewal',
		name: 'Renew Domain Name(s)',
		description: 'Renew internet domain registration.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'ssl_certificate_renewal',
		name: 'Renew SSL Certificate',
		description: 'Renew website SSL certificate.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'software_subscription_renewal',
		name: 'Renew Software Subscriptions',
		description: 'Renew SaaS or software licence.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'backup_restore_test',
		name: 'Backup Restore Test',
		description: 'Verify company data backups can be restored.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'supplier_contract_review',
		name: 'Supplier Contract Review',
		description: 'Review supplier contract terms and renewal dates.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'office_lease_review',
		name: 'Office Lease Review',
		description: 'Review office lease terms and break clauses.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'professional_membership_renewal',
		name: 'Professional Membership Renewal',
		description: 'Renew professional organisation membership.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'website_terms_review',
		name: 'Website Terms Review',
		description: 'Review website legal pages and policies.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},

	// --- GOVERNANCE ---
	{
		key: 'staff_appraisal',
		name: 'Annual Staff Appraisals',
		description: 'Annual employee performance reviews.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'director_review',
		name: 'Director Performance Review',
		description: "Formal review of directors' performances.",
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'salary_review',
		name: 'Salary Reviews',
		description: 'Annual reviews of employee compensation.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'cyber_security_review',
		name: 'Cyber Security Review',
		description: 'Review cyber security controls and policies.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'disaster_recovery_test',
		name: 'Disaster Recovery Test',
		description: 'Test the disaster recovery procedures.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'business_continuity_review',
		name: 'Business Continuity Review',
		description: 'Review business continuity plans.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'board_meeting',
		name: 'Board Meeting',
		description: 'Directors meet to review company affairs.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'shareholder_meeting',
		name: 'Shareholder Meeting',
		description: 'Shareholders meet to review company performance.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'policy_review',
		name: 'Policy Review',
		description: 'Review company policies.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'iso_review',
		name: 'ISO Review',
		description: 'Review ISO standards and compliance.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	}
];
