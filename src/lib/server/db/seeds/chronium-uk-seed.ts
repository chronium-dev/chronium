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
		key: 'insurance_policy_started',
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
		key: 'confirmation_statement_date',
		name: 'Confirmation Statement Date',
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
		key: 'pat_test_due',
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
		key: 'backup_test_due',
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
		key: 'perform_pat_testing',
		name: 'PAT Testing',
		description: 'Portable appliance electrical safety testing.',
		domain: DomainType.Operational
	},

	{
		key: 'fire_safety_inspection',
		name: 'Fire Safety Inspection',
		description: 'Inspection of fire safety measures.',
		domain: DomainType.Operational
	},

	{
		key: 'vehicle_mot',
		name: 'Vehicle MOT',
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
		key: 'backup_restore_test',
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
	}
];

export const obligationTemplateSeeds = [
	{
		name: 'File Annual Accounts',
		triggerEventTypeKey: 'accounting_period_end',
		obligationTypeKey: 'file_annual_accounts',
		dueOffsetMonths: 9,
		dueOffsetDays: 0,
		defaultNotes: 'Your accountant normally prepares and files these with Companies House.'
	},

	{
		name: 'File Confirmation Statement',
		triggerEventTypeKey: 'confirmation_statement_date',
		obligationTypeKey: 'file_confirmation_statement',
		dueOffsetDays: 14,
		defaultNotes: 'Must be filed within 14 days of the confirmation date.'
	},

	{
		name: 'Pay Corporation Tax',
		triggerEventTypeKey: 'corporation_tax_period_end',
		obligationTypeKey: 'pay_corporation_tax',
		dueOffsetMonths: 9, // 9 months
		dueOffsetDays: 1, // ... + 1 day
		defaultNotes:
			'Corporation tax must normally be paid nine months and one day after the accounting period ends.'
	},
	{
		name: 'File CT600',
		triggerEventTypeKey: 'corporation_tax_period_end',
		obligationTypeKey: 'file_ct600',
		dueOffsetDays: 365,
		defaultNotes:
			'For most UK limited companies, a Company Tax Return (form CT600) must be filed with HM Revenue & Customs (HMRC) 12 months after the end of the accounting period it covers'
	},
	{
		name: 'Submit VAT Return',
		triggerEventTypeKey: 'vat_period_end',
		obligationTypeKey: 'submit_vat_return',
		dueOffsetMonths: 1,
		dueOffsetDays: 7,
		defaultNotes: 'VAT Return must be submitted quarterly, monthly or annually'
	},
	{
		name: 'Pay VAT',
		triggerEventTypeKey: 'vat_period_end',
		obligationTypeKey: 'pay_vat',
		dueOffsetMonths: 1,
		dueOffsetDays: 7,
		defaultNotes: 'VAT due must be paid quarterly, monthly or annually'
	},

	{
		name: 'Pay PAYE',
		triggerEventTypeKey: 'payroll_month_end',
		obligationTypeKey: 'pay_paye',
		dueOffsetDays: 22,
		defaultNotes: 'PAYE must be paid by the 22nd of the following month (electronic payment).'
	},

	{
		name: 'Submit Final FPS',
		triggerEventTypeKey: 'payroll_year_end',
		obligationTypeKey: 'pay_paye',
		dueOffsetDays: 19,
		defaultNotes: 'Final Full Payment Submission must be sent by 19 April.'
	},

	{
		name: 'Renew Domain',
		triggerEventTypeKey: 'domain_registered',
		obligationTypeKey: 'renew_domain',
		dueOffsetDays: 365,
		defaultNotes: 'Ensure domain auto-renew is enabled to prevent website or email disruption.'
	},

	{
		name: 'Renew SSL Certificate',
		triggerEventTypeKey: 'ssl_certificate_issued',
		obligationTypeKey: 'renew_ssl_certificate',
		dueOffsetDays: 365,
		defaultNotes: 'Expired SSL certificates will cause browsers to mark your website as insecure.'
	},

	{
		name: 'Backup Restore Test',
		triggerEventTypeKey: 'backup_test_due', // ✅ FIXED
		obligationTypeKey: 'backup_restore_test',
		dueOffsetDays: 0,
		defaultNotes: 'Regularly test backup restoration to ensure data recovery is possible.'
	},

	{
		name: 'Insurance Renewal',
		triggerEventTypeKey: 'insurance_policy_started',
		obligationTypeKey: 'renew_insurance',
		dueOffsetDays: 365,
		defaultNotes: 'Check renewal quotes and ensure cover reflects current business risks.'
	},

	{
		name: 'Supplier Contract Review',
		triggerEventTypeKey: 'supplier_contract_signed',
		obligationTypeKey: 'review_supplier_contract',
		dueOffsetDays: 365,
		defaultNotes: 'Check pricing, termination notice periods, and renewal clauses.'
	},

	{
		name: 'Office Lease Review',
		triggerEventTypeKey: 'office_lease_signed',
		obligationTypeKey: 'office_lease_review',
		dueOffsetDays: 365,
		defaultNotes: 'Review break clauses and lease renewal timelines well in advance.'
	},

	{
		name: 'Annual Staff Appraisal',
		triggerEventTypeKey: 'employee_hired',
		obligationTypeKey: 'staff_annual_appraisal',
		dueOffsetDays: 365,
		defaultNotes: 'Annual performance review discussing development goals and feedback.'
	},

	{
		name: 'Cyber Security Review',
		triggerEventTypeKey: 'cyber_security_review_due', // ✅ FIXED
		obligationTypeKey: 'cyber_security_review',
		dueOffsetDays: 0,
		defaultNotes: 'Review MFA usage, password policies, and system access controls.'
	},

	{
		name: 'Disaster Recovery Test',
		triggerEventTypeKey: 'disaster_recovery_test_due', // ✅ FIXED
		obligationTypeKey: 'disaster_recovery_test',
		dueOffsetDays: 0,
		defaultNotes: 'Test restoring systems from backup and verify recovery procedures.'
	},

	{
		name: 'Website Terms Review',
		triggerEventTypeKey: 'policy_review',
		obligationTypeKey: 'website_terms_review',
		dueOffsetDays: 365,
		defaultNotes: 'Ensure privacy policy, cookie policy and terms comply with current regulations.'
	}
];

export const defaultRecurrenceRules = [
	{
		eventTypeKey: 'board_meeting',
		organisationId: organisationUkLtd.id,
		name: 'Quarterly Board Meeting',
		frequency: RecurrenceFrequencyType.Monthly,
		interval: 3,
		startDate: new Date()
	},
	{
		eventTypeKey: 'shareholder_meeting',
		organisationId: organisationUkLtd.id,
		name: 'Annual Shareholder Meeting',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new Date()
	},
	{
		eventTypeKey: 'risk_assessment_review',
		organisationId: organisationUkLtd.id,
		name: 'Annual Risk Review',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new Date()
	},
	{
		eventTypeKey: 'policy_review',
		organisationId: organisationUkLtd.id,
		name: 'Annual Policy Review',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new Date()
	},
	{
		eventTypeKey: 'backup_test_due', // ✅ FIXED
		organisationId: organisationUkLtd.id,
		name: 'Annual Backup Test',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new Date()
	},
	{
		eventTypeKey: 'cyber_security_review_due', // ✅ FIXED
		organisationId: organisationUkLtd.id,
		name: 'Annual Cyber Security Review',
		frequency: RecurrenceFrequencyType.Yearly,
		interval: 1,
		startDate: new Date()
	}
];
