import type { NewOrganisation } from '$lib/types/organisations';
import { DomainType, RecurrenceFrequencyType } from '../schema';

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

export const organisationUkLtd: NewOrganisation = {
	id: 'org_acme',
	name: 'Acme Widgets Ltd',
	jurisdictionId: jurisdictionUK.id,
	entityTypeId: entityTypeUkLtd.id,
	incorporationDate: '2025-02-12',
	financialYearEndMonth: 2,
	financialYearEndDay: 28,
	vatRegistered: true,
	payrollActive: true,
	businessPremises: true
};

export const eventTypeSeeds = [
	// ✅ Anchors (unchanged)
	{
		key: 'company_incorporated',
		name: 'Company Incorporated',
		description: 'The company was formally incorporated at Companies House.',
		domain: DomainType.Statutory
	},
	{
		key: 'insurance_policy_renewal',
		name: 'Insurance Policy Started',
		description: 'Start date of an insurance policy.',
		domain: DomainType.Operational
	},
	{
		key: 'domain_registered',
		name: 'Domain Registered',
		description: 'Internet domain name registered.',
		domain: DomainType.Operational
	},
	{
		key: 'ssl_certificate_issued',
		name: 'SSL Certificate Issued',
		description: 'SSL certificate issued for website security.',
		domain: DomainType.Operational
	},
	{
		key: 'software_subscription_started',
		name: 'Software Subscription Started',
		description: 'Start of SaaS or software subscription.',
		domain: DomainType.Operational
	},
	{
		key: 'employee_hired',
		name: 'Employee Hired',
		description: 'A new employee joined the company.',
		domain: DomainType.Operational
	},
	{
		key: 'supplier_contract_signed',
		name: 'Supplier Contract Signed',
		description: 'New supplier contract signed.',
		domain: DomainType.Operational
	},
	{
		key: 'office_lease_signed',
		name: 'Office Lease Signed',
		description: 'Company office lease agreement signed.',
		domain: DomainType.Operational
	},
	{
		key: 'professional_membership_started',
		name: 'Professional Membership Started',
		description: 'Professional body membership began.',
		domain: DomainType.Operational
	},

	// ✅ System-generated period ends (unchanged)
	{
		key: 'accounting_period_end',
		name: 'Accounting Period End',
		description: 'End of the company accounting period.',
		domain: DomainType.Statutory
	},
	{
		key: 'confirmation_statement_period_end',
		name: 'Confirmation Statement Period End',
		description: 'Anniversary of company incorporation.',
		domain: DomainType.Statutory
	},
	{
		key: 'corporation_tax_period_end',
		name: 'Corporation Tax Period End',
		description: 'End of a corporation tax accounting period.',
		domain: DomainType.Statutory
	},
	{
		key: 'vat_period_end',
		name: 'VAT Return Period End',
		description: 'End of a VAT reporting period.',
		domain: DomainType.Statutory
	},
	{
		key: 'payroll_month_end',
		name: 'Payroll Month End',
		description: 'End of payroll reporting period.',
		domain: DomainType.Statutory
	},
	{
		key: 'payroll_year_end',
		name: 'Payroll Year End',
		description: 'End of PAYE tax year.',
		domain: DomainType.Statutory
	},

	// ✅ Future “due” events (fixed)
	{
		key: 'pat_testing',
		name: 'PAT Testing Due',
		description: 'Portable appliance testing is due.',
		domain: DomainType.Operational
	},
	{
		key: 'fire_safety_inspection_due',
		name: 'Fire Safety Inspection Due',
		description: 'Fire safety inspection is due.',
		domain: DomainType.Operational
	},
	{
		key: 'equipment_service_due',
		name: 'Equipment Service Due',
		description: 'Routine servicing is due.',
		domain: DomainType.Operational
	},
	{
		key: 'vehicle_mot_due',
		name: 'Vehicle MOT Due',
		description: 'Vehicle MOT test is due.',
		domain: DomainType.Operational
	},
	{
		key: 'backup_restore_test_due',
		name: 'Backup Restore Test Due',
		description: 'Backup restore test is due.',
		domain: DomainType.Operational
	},
	{
		key: 'health_safety_audit_due',
		name: 'Health & Safety Audit Due',
		description: 'Workplace health and safety audit is due.',
		domain: DomainType.Governance
	},
	{
		key: 'fire_risk_assessment_due',
		name: 'Fire Risk Assessment Due',
		description: 'Fire risk assessment is due.',
		domain: DomainType.Governance
	},
	{
		key: 'cyber_security_review_due',
		name: 'Cyber Security Review Due',
		description: 'Cyber security review is due.',
		domain: DomainType.Governance
	},
	{
		key: 'disaster_recovery_test_due',
		name: 'Disaster Recovery Test Due',
		description: 'Disaster recovery test is due.',
		domain: DomainType.Governance
	},
	{
		key: 'business_continuity_review_due',
		name: 'Business Continuity Review Due',
		description: 'Business continuity review is due.',
		domain: DomainType.Governance
	},
	{
		key: 'director_review_due',
		name: 'Director Performance Review Due',
		description: 'Director review is due.',
		domain: DomainType.Governance
	},
	{
		key: 'salary_review_due',
		name: 'Salary Review Due',
		description: 'Salary review is due.',
		domain: DomainType.Governance
	},
	{
		key: 'staff_appraisal_due',
		name: 'Staff Appraisal Due',
		description: 'Staff appraisal is due.',
		domain: DomainType.Governance
	},

	// ⚠️ Governance recurring (kept as “occurring events”)
	{
		key: 'board_meeting',
		name: 'Board Meeting',
		description: 'Directors meet to review company affairs.',
		domain: DomainType.Governance
	},
	{
		key: 'shareholder_meeting',
		name: 'Shareholder Meeting',
		description: 'Shareholders meet.',
		domain: DomainType.Governance
	},
	{
		key: 'risk_assessment_review',
		name: 'Risk Assessment Review',
		description: 'Risk assessment review is due.',
		domain: DomainType.Governance
	},
	{
		key: 'policy_review',
		name: 'Policy Review',
		description: 'Company policies should be reviewed.',
		domain: DomainType.Governance
	}
];

export const obligationTypeSeeds = [
	{
		key: 'file_annual_accounts',
		name: 'File Annual Accounts',
		description: 'Submit statutory accounts to Companies House.',
		domain: DomainType.Statutory
	},

	{
		key: 'file_confirmation_statement',
		name: 'File Confirmation Statement',
		description: 'Submit confirmation statement confirming company details.',
		domain: DomainType.Statutory
	},

	{
		key: 'pay_corporation_tax',
		name: 'Pay Corporation Tax',
		description: 'Pay corporation tax due to HMRC.',
		domain: DomainType.Statutory
	},

	{
		key: 'file_ct600',
		name: 'File Corporation Tax Return (CT600)',
		description: 'Submit corporation tax return to HMRC.',
		domain: DomainType.Statutory
	},

	{
		key: 'submit_vat_return',
		name: 'Submit VAT Return',
		description: 'Submit VAT return to HMRC.',
		domain: DomainType.Statutory
	},

	{
		key: 'pay_vat',
		name: 'Pay VAT',
		description: 'Pay VAT liability to HMRC.',
		domain: DomainType.Statutory
	},

	{
		key: 'pay_paye',
		name: 'Pay PAYE',
		description: 'Pay PAYE and National Insurance contributions.',
		domain: DomainType.Statutory
	},

	{
		key: 'submit_final_fps',
		name: 'Submit Final FPS',
		description: 'Final Full Payment Submission due.',
		domain: DomainType.Statutory
	},

	{
		key: 'renew_insurance',
		name: 'Renew Insurance Policy',
		description: 'Renew company insurance policy.',
		domain: DomainType.Operational
	},

	{
		key: 'review_insurance_cover',
		name: 'Review Insurance Cover',
		description: 'Ensure insurance coverage remains adequate.',
		domain: DomainType.Operational
	},

	{
		key: 'pat_testing',
		name: 'PAT Testing',
		description: 'Portable appliance electrical safety testing.',
		domain: DomainType.Operational
	},

	{
		key: 'fire_safety_inspection_due',
		name: 'Fire Safety Inspection',
		description: 'Inspection of fire safety measures.',
		domain: DomainType.Operational
	},

	{
		key: 'vehicle_mot_due',
		name: 'Vehicle MOT Due',
		description: 'Annual vehicle MOT test.',
		domain: DomainType.Operational
	},

	{
		key: 'renew_domain',
		name: 'Renew Domain',
		description: 'Renew internet domain registration.',
		domain: DomainType.Operational
	},

	{
		key: 'renew_ssl_certificate',
		name: 'Renew SSL Certificate',
		description: 'Renew website SSL certificate.',
		domain: DomainType.Operational
	},

	{
		key: 'renew_software_subscription',
		name: 'Renew Software Subscription',
		description: 'Renew SaaS or software licence.',
		domain: DomainType.Operational
	},

	{
		key: 'backup_restore_test_due',
		name: 'Backup Restore Test',
		description: 'Verify company data backups can be restored.',
		domain: DomainType.Operational
	},

	{
		key: 'review_supplier_contract',
		name: 'Supplier Contract Review',
		description: 'Review supplier contract terms and renewal dates.',
		domain: DomainType.Operational
	},

	{
		key: 'office_lease_review',
		name: 'Office Lease Review',
		description: 'Review office lease terms and break clauses.',
		domain: DomainType.Operational
	},

	{
		key: 'professional_membership_renewal',
		name: 'Professional Membership Renewal',
		description: 'Renew professional organisation membership.',
		domain: DomainType.Operational
	},

	{
		key: 'website_terms_review',
		name: 'Website Terms Review',
		description: 'Review website legal pages and policies.',
		domain: DomainType.Operational
	},

	{
		key: 'staff_annual_appraisal',
		name: 'Annual Staff Appraisal',
		description: 'Annual employee performance review.',
		domain: DomainType.Governance
	},

	{
		key: 'director_performance_review',
		name: 'Director Performance Review',
		description: 'Formal review of director performance.',
		domain: DomainType.Governance
	},

	{
		key: 'salary_review',
		name: 'Salary Review',
		description: 'Annual review of employee compensation.',
		domain: DomainType.Governance
	},

	{
		key: 'cyber_security_review',
		name: 'Cyber Security Review',
		description: 'Review cyber security controls and policies.',
		domain: DomainType.Governance
	},

	{
		key: 'disaster_recovery_test',
		name: 'Disaster Recovery Test',
		description: 'Test the disaster recovery procedures.',
		domain: DomainType.Governance
	},

	{
		key: 'business_continuity_review',
		name: 'Business Continuity Review',
		description: 'Review business continuity plans.',
		domain: DomainType.Governance
	},

	{
		key: 'board_meeting',
		name: 'Board Meeting',
		description: 'Directors meet to review company affairs.',
		domain: DomainType.Governance
	},

	{
		key: 'shareholder_meeting',
		name: 'Shareholder Meeting',
		description: 'Shareholders meet to review company performance.',
		domain: DomainType.Governance
	},
	{
		key: 'policy_review',
		name: 'Policy Review',
		domain: DomainType.Governance,
		description: 'Review Company policies'
	},
	{
		key: 'iso_review',
		name: 'ISO Review',
		domain: DomainType.Governance,
		description: 'Review ISO Standards'
	}
];

export const obligationTemplateSeeds = [
	{
		name: 'File Annual Accounts',
		eventTypeKey: 'accounting_period_end',
		obligationTypeKey: 'file_annual_accounts',

		firstOccurrenceBase: 'incorporation_date',
		firstOccurrenceOperations: [
			{ type: 'add', unit: 'months', value: 21 },
			{ type: 'end_of_month' }
		],

		dueDateOperations: [
			{ type: 'add', unit: 'months', value: 9 },
			{ type: 'end_of_month' } // ensure it lands on month-end
		],

		defaultNotes:
			'Accounts must be filed 9 months after the accounting period end (first accounts: 21 months from incorporation).'
	},

	{
		name: 'File Confirmation Statement',
		eventTypeKey: 'confirmation_statement_period_end',
		obligationTypeKey: 'file_confirmation_statement',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 14 }],

		defaultNotes: 'Must be filed within 14 days of the confirmation date.'
	},

	{
		name: 'Pay Corporation Tax',
		eventTypeKey: 'corporation_tax_period_end',
		obligationTypeKey: 'pay_corporation_tax',

		firstOccurrenceStrategy: 'absolute',
		firstOccurrenceBase: 'incorporation_date',
		firstOccurrenceOperations: [
			{ type: 'add', unit: 'months', value: 12 },
			{ type: 'add', unit: 'days', value: 1 }
		],

		dueDateOperations: [
			{ type: 'add', unit: 'months', value: 9 },
			{ type: 'add', unit: 'days', value: 1 }
		],

		defaultNotes:
			'Corporation tax must normally be paid nine months and one day after the accounting period ends.'
	},

	{
		name: 'File CT600',
		eventTypeKey: 'corporation_tax_period_end',
		obligationTypeKey: 'file_ct600',

		dueDateOperations: [{ type: 'add', unit: 'months', value: 12 }],

		defaultNotes: 'CT600 must be filed 12 months after the end of the accounting period.'
	},

	{
		name: 'Submit VAT Return',
		eventTypeKey: 'vat_period_end',
		obligationTypeKey: 'submit_vat_return',

		dueDateOperations: [
			{ type: 'add', unit: 'months', value: 1 },
			{ type: 'add', unit: 'days', value: 7 }
		]
	},

	{
		name: 'Pay VAT',
		eventTypeKey: 'vat_period_end',
		obligationTypeKey: 'pay_vat',

		dueDateOperations: [
			{ type: 'add', unit: 'months', value: 1 },
			{ type: 'add', unit: 'days', value: 7 }
		]
	},
	{
		name: 'Pay PAYE',
		eventTypeKey: 'payroll_month_end',
		obligationTypeKey: 'pay_paye',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 22 }]
	},

	{
		name: 'Submit Final FPS',
		eventTypeKey: 'payroll_year_end',
		obligationTypeKey: 'submit_final_fps',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 19 }]
	},

	// ------------------------
	// Operational
	// ------------------------

	{
		name: 'Renew Domain',
		eventTypeKey: 'domain_registered',
		obligationTypeKey: 'renew_domain',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 365 }]
	},

	{
		name: 'Renew SSL Certificate',
		eventTypeKey: 'ssl_certificate_issued',
		obligationTypeKey: 'renew_ssl_certificate',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 365 }]
	},

	{
		name: 'Backup Restore Test',
		eventTypeKey: 'backup_restore_test_due',
		obligationTypeKey: 'backup_restore_test_due',

		dueDateOperations: [{ type: 'add', unit: 'months', value: 6 }]
	},

	{
		name: 'Insurance Renewal',
		eventTypeKey: 'insurance_policy_renewal',
		obligationTypeKey: 'renew_insurance',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 365 }]
	},

	{
		name: 'Supplier Contract Review',
		eventTypeKey: 'supplier_contract_signed',
		obligationTypeKey: 'review_supplier_contract',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 365 }]
	},

	{
		name: 'Office Lease Review',
		eventTypeKey: 'office_lease_signed',
		obligationTypeKey: 'office_lease_review',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 365 }]
	},

	{
		name: 'Annual Staff Appraisal',
		eventTypeKey: 'employee_hired',
		obligationTypeKey: 'staff_annual_appraisal',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 365 }]
	},

	// ------------------------
	// Governance (event-driven)
	// ------------------------

	{
		name: 'Cyber Security Review',
		eventTypeKey: 'cyber_security_review_due',
		obligationTypeKey: 'cyber_security_review',
		dueDateOperations: [{ type: 'add', unit: 'days', value: 0 }]
	},

	{
		name: 'Disaster Recovery Test',
		eventTypeKey: 'disaster_recovery_test_due',
		obligationTypeKey: 'disaster_recovery_test',
		dueDateOperations: [{ type: 'add', unit: 'days', value: 0 }]
	},

	{
		name: 'Website Terms Review',
		eventTypeKey: 'policy_review',
		obligationTypeKey: 'website_terms_review',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 365 }]
	},

	{
		name: 'Arrange and complete MOT',
		eventTypeKey: 'vehicle_mot_due',
		obligationTypeKey: 'vehicle_mot_due',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 335 }]
	},

	{
		name: 'Conduct annual fire safety inspection',
		eventTypeKey: 'fire_safety_inspection_due',
		obligationTypeKey: 'fire_safety_inspection_due',

		dueDateOperations: [{ type: 'add', unit: 'months', value: 12 }]
	},

	{
		name: 'PAT Testing',
		eventTypeKey: 'pat_testing',
		obligationTypeKey: 'pat_testing',

		dueDateOperations: [{ type: 'add', unit: 'days', value: 365 }]
	},

	{
		name: 'Board Meeting',
		eventTypeKey: 'board_meeting',
		obligationTypeKey: 'board_meeting',

		dueDateOperations: [{ type: 'add', unit: 'months', value: 3 }]
	}
];

export const defaultRecurrenceRules = [
	{
		eventTypeKey: 'board_meeting',
		organisationId: organisationUkLtd.id,
		name: 'Quarterly Board Meeting',
		frequency: RecurrenceFrequencyType.Monthly,
		interval: 3,
		startDate: new UTCDate()
	},
	{
		eventTypeKey: 'shareholder_meeting',
		organisationId: organisationUkLtd.id,
		name: 'Annual Shareholder Meeting',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new UTCDate()
	},
	{
		eventTypeKey: 'risk_assessment_review',
		organisationId: organisationUkLtd.id,
		name: 'Annual Risk Review',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new UTCDate()
	},
	{
		eventTypeKey: 'policy_review',
		organisationId: organisationUkLtd.id,
		name: 'Annual Policy Review',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new UTCDate()
	},
	{
		eventTypeKey: 'backup_restore_test_due',
		organisationId: organisationUkLtd.id,
		name: 'Annual Backup / Restore Test',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new UTCDate()
	},
	{
		eventTypeKey: 'cyber_security_review_due',
		organisationId: organisationUkLtd.id,
		name: 'Annual Cyber Security Review',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new UTCDate()
	}
];
