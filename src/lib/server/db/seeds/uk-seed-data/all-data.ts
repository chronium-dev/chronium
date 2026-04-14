import { ObligationCategoryType } from '$lib/server/db/schema';

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
		category: ObligationCategoryType.Statutory
	},
	{
		key: 'confirmation_statement',
		name: 'File Confirmation Statement',
		description: 'Submit confirmation statement confirming company details.',
		category: ObligationCategoryType.Statutory
	},
	{
		key: 'corporation_tax_payment',
		name: 'Pay Corporation Tax',
		description: 'Pay corporation tax due to HMRC.',
		category: ObligationCategoryType.Statutory
	},
	{
		key: 'corporation_tax_return',
		name: 'File Company Tax Return (CT600)',
		description: 'Submit corporation tax return to HMRC.',
		category: ObligationCategoryType.Statutory
	},
	{
		key: 'vat_return_and_payment',
		name: 'Submit VAT Return & Payment',
		description: 'Submit VAT return and payment to HMRC.',
		category: ObligationCategoryType.Statutory
	},
	{
		key: 'paye_payment',
		name: 'Pay PAYE',
		description: 'Pay PAYE and National Insurance contributions.',
		category: ObligationCategoryType.Statutory
	},
	{
		key: 'final_fps',
		name: 'Submit Final FPS',
		description: 'Final Full Payment Submission due.',
		category: ObligationCategoryType.Statutory
	},

	// --- OPERATIONAL ---
	{
		key: 'insurance_renewal',
		name: 'Renew Insurance Policy',
		description: 'Renew company insurance policy.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'insurance_review',
		name: 'Review Insurance Cover',
		description: 'Ensure insurance coverage remains adequate.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'pat_testing',
		name: 'PAT Testing',
		description: 'Portable appliance electrical safety testing.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'fire_safety_inspection',
		name: 'Fire Safety Inspection',
		description: 'Inspection of fire safety measures.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'vehicle_mot',
		name: 'Vehicle MOT Due',
		description: 'Annual vehicle MOT test.',
		category: ObligationCategoryType.Operational,
		isSystem: false
	},
	{
		key: 'domain_renewal',
		name: 'Renew Domain',
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
		name: 'Renew Software Subscription',
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
		name: 'Annual Staff Appraisal',
		description: 'Annual employee performance review.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'director_review',
		name: 'Director Performance Review',
		description: 'Formal review of director performance.',
		category: ObligationCategoryType.Governance,
		isSystem: false
	},
	{
		key: 'salary_review',
		name: 'Salary Review',
		description: 'Annual review of employee compensation.',
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
