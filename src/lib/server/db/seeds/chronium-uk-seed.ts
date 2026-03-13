import { ObligationDomainType } from '../schema';

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

export const organisationUkLtd = {
	id: 'org_acme',
	name: 'Acme Widgets Ltd',
	jurisdictionId: jurisdictionUK.id,
	entityTypeId: entityTypeUkLtd.id
};

export const eventTypeSeeds = [
	{
		key: 'company_incorporated',
		name: 'Company Incorporated',
		description: 'The company was formally incorporated at Companies House.'
	},

	{
		key: 'accounting_period_end',
		name: 'Accounting Period End',
		description:
			'End of the company accounting period used for statutory accounts and corporation tax.'
	},

	{
		key: 'confirmation_statement_date',
		name: 'Confirmation Statement Date',
		description: 'Anniversary of company incorporation used for filing confirmation statements.'
	},

	{
		key: 'vat_quarter_end',
		name: 'VAT Quarter End',
		description: 'End of a VAT reporting period.'
	},

	{
		key: 'payroll_month_end',
		name: 'Payroll Month End',
		description: 'End of payroll reporting period.'
	},

	{
		key: 'payroll_year_end',
		name: 'Payroll Year End',
		description: 'End of PAYE tax year reporting.'
	},

	{
		key: 'insurance_policy_started',
		name: 'Insurance Policy Started',
		description: 'Start date of an insurance policy.'
	},

	{
		key: 'pat_test_completed',
		name: 'PAT Test Completed',
		description: 'Portable appliance testing completed.'
	},

	{
		key: 'fire_safety_check_completed',
		name: 'Fire Safety Check Completed',
		description: 'Fire safety inspection or assessment completed.'
	},

	{
		key: 'equipment_service_completed',
		name: 'Equipment Service Completed',
		description: 'Routine servicing of company equipment completed.'
	},

	{
		key: 'vehicle_mot_completed',
		name: 'Vehicle MOT Completed',
		description: 'Company vehicle MOT completed.'
	},

	{
		key: 'domain_registered',
		name: 'Domain Registered',
		description: 'Internet domain name registered.'
	},

	{
		key: 'ssl_certificate_issued',
		name: 'SSL Certificate Issued',
		description: 'SSL certificate issued for website security.'
	},

	{
		key: 'software_subscription_started',
		name: 'Software Subscription Started',
		description: 'Start of SaaS or software subscription.'
	},

	{
		key: 'employee_hired',
		name: 'Employee Hired',
		description: 'A new employee joined the company.'
	},

	{
		key: 'staff_appraisal_completed',
		name: 'Staff Appraisal Completed',
		description: 'Employee performance appraisal completed.'
	},

	{
		key: 'risk_assessment_created',
		name: 'Risk Assessment Created',
		description: 'Formal business risk assessment created.'
	},

	{
		key: 'policy_created',
		name: 'Policy Created',
		description: 'Company policy created or updated.'
	},

	{
		key: 'board_meeting_held',
		name: 'Board Meeting Held',
		description: 'Directors held a formal board meeting.'
	},

	{
		key: 'shareholder_meeting_held',
		name: 'Shareholder Meeting Held',
		description: 'Formal shareholder meeting held.'
	},

	{
		key: 'supplier_contract_signed',
		name: 'Supplier Contract Signed',
		description: 'New supplier contract signed.'
	},

	{
		key: 'office_lease_signed',
		name: 'Office Lease Signed',
		description: 'Company office lease agreement signed.'
	},

	{
		key: 'professional_membership_started',
		name: 'Professional Membership Started',
		description: 'Professional body membership began.'
	},

	{
		key: 'backup_test_completed',
		name: 'Backup Restore Test Completed',
		description: 'IT backup restore test completed.'
	},

	{
		key: 'health_safety_audit_completed',
		name: 'Health & Safety Audit Completed',
		description: 'Workplace health and safety audit completed.'
	},

	{
		key: 'fire_risk_assessment_completed',
		name: 'Fire Risk Assessment Completed',
		description: 'Formal fire risk assessment completed.'
	},

	{
		key: 'cyber_security_review_completed',
		name: 'Cyber Security Review Completed',
		description: 'Cyber security policies and controls reviewed.'
	},

	{
		key: 'disaster_recovery_test_completed',
		name: 'Disaster Recovery Test Completed',
		description: 'Business disaster recovery procedures tested.'
	},

	{
		key: 'business_continuity_review_completed',
		name: 'Business Continuity Review Completed',
		description: 'Business continuity plan reviewed.'
	},

	{
		key: 'director_review_completed',
		name: 'Director Performance Review Completed',
		description: 'Director performance review completed.'
	},

	{
		key: 'salary_review_completed',
		name: 'Salary Review Completed',
		description: 'Salary review cycle completed.'
	}
];

export const obligationTypeSeeds = [
	{
		key: 'file_annual_accounts',
		name: 'File Annual Accounts',
		description: 'Submit statutory accounts to Companies House.',
		domain: ObligationDomainType.Statutory
	},

	{
		key: 'file_confirmation_statement',
		name: 'File Confirmation Statement',
		description: 'Submit confirmation statement confirming company details.',
		domain: ObligationDomainType.Statutory
	},

	{
		key: 'pay_corporation_tax',
		name: 'Pay Corporation Tax',
		description: 'Pay corporation tax due to HMRC.',
		domain: ObligationDomainType.Statutory
	},

	{
		key: 'file_ct600',
		name: 'File Corporation Tax Return (CT600)',
		description: 'Submit corporation tax return to HMRC.',
		domain: ObligationDomainType.Statutory
	},

	{
		key: 'submit_vat_return',
		name: 'Submit VAT Return',
		description: 'Submit VAT return to HMRC.',
		domain: ObligationDomainType.Statutory
	},

	{
		key: 'pay_vat',
		name: 'Pay VAT',
		description: 'Pay VAT liability to HMRC.',
		domain: ObligationDomainType.Statutory
	},

	{
		key: 'pay_paye',
		name: 'Pay PAYE',
		description: 'Pay PAYE and National Insurance contributions.',
		domain: ObligationDomainType.Statutory
	},

	{
		key: 'renew_insurance',
		name: 'Renew Insurance Policy',
		description: 'Renew company insurance policy.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'review_insurance_cover',
		name: 'Review Insurance Cover',
		description: 'Ensure insurance coverage remains adequate.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'perform_pat_testing',
		name: 'PAT Testing',
		description: 'Portable appliance electrical safety testing.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'fire_safety_inspection',
		name: 'Fire Safety Inspection',
		description: 'Inspection of fire safety measures.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'vehicle_mot',
		name: 'Vehicle MOT',
		description: 'Annual vehicle MOT test.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'renew_domain',
		name: 'Renew Domain',
		description: 'Renew internet domain registration.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'renew_ssl_certificate',
		name: 'Renew SSL Certificate',
		description: 'Renew website SSL certificate.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'renew_software_subscription',
		name: 'Renew Software Subscription',
		description: 'Renew SaaS or software licence.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'backup_restore_test',
		name: 'Backup Restore Test',
		description: 'Verify company data backups can be restored.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'review_supplier_contract',
		name: 'Supplier Contract Review',
		description: 'Review supplier contract terms and renewal dates.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'office_lease_review',
		name: 'Office Lease Review',
		description: 'Review office lease terms and break clauses.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'professional_membership_renewal',
		name: 'Professional Membership Renewal',
		description: 'Renew professional organisation membership.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'website_terms_review',
		name: 'Website Terms Review',
		description: 'Review website legal pages and policies.',
		domain: ObligationDomainType.Operational
	},

	{
		key: 'staff_annual_appraisal',
		name: 'Annual Staff Appraisal',
		description: 'Annual employee performance review.',
		domain: ObligationDomainType.Governance
	},

	{
		key: 'director_performance_review',
		name: 'Director Performance Review',
		description: 'Formal review of director performance.',
		domain: ObligationDomainType.Governance
	},

	{
		key: 'salary_review',
		name: 'Salary Review',
		description: 'Annual review of employee compensation.',
		domain: ObligationDomainType.Governance
	},

	{
		key: 'cyber_security_review',
		name: 'Cyber Security Review',
		description: 'Review cyber security controls and policies.',
		domain: ObligationDomainType.Governance
	},

	{
		key: 'disaster_recovery_test',
		name: 'Disaster Recovery Test',
		description: 'Test the disaster recovery procedures.',
		domain: ObligationDomainType.Governance
	},

	{
		key: 'business_continuity_review',
		name: 'Business Continuity Review',
		description: 'Review business continuity plans.',
		domain: ObligationDomainType.Governance
	},

	{
		key: 'board_meeting',
		name: 'Board Meeting',
		description: 'Directors meet to review company affairs.',
		domain: ObligationDomainType.Governance
	},

	{
		key: 'shareholder_meeting',
		name: 'Shareholder Meeting',
		description: 'Shareholders meet to review company performance.',
		domain: ObligationDomainType.Governance
	}
];

export const obligationTemplateSeeds = [
	{
		name: 'File Annual Accounts',
		triggerEventTypeKey: 'accounting_period_end',
		obligationTypeKey: 'file_annual_accounts',
		dueOffsetDays: 273,
		defaultNotes: 'Your accountant normally prepares and files these with Companies House.'
	},

	{
		name: 'Pay Corporation Tax',
		triggerEventTypeKey: 'accounting_period_end',
		obligationTypeKey: 'pay_corporation_tax',
		dueOffsetDays: 274,
		defaultNotes:
			'Corporation tax must normally be paid nine months and one day after the accounting period ends.'
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
		triggerEventTypeKey: 'backup_test_completed',
		obligationTypeKey: 'backup_restore_test',
		dueOffsetDays: 365,
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
		triggerEventTypeKey: 'cyber_security_review_completed',
		obligationTypeKey: 'cyber_security_review',
		dueOffsetDays: 365,
		defaultNotes: 'Review MFA usage, password policies, and system access controls.'
	},

	{
		name: 'Disaster Recovery Test',
		triggerEventTypeKey: 'disaster_recovery_test_completed',
		obligationTypeKey: 'disaster_recovery_test',
		dueOffsetDays: 365,
		defaultNotes: 'Test restoring systems from backup and verify recovery procedures.'
	},

	{
		name: 'Website Terms Review',
		triggerEventTypeKey: 'policy_created',
		obligationTypeKey: 'website_terms_review',
		dueOffsetDays: 365,
		defaultNotes: 'Ensure privacy policy, cookie policy and terms comply with current regulations.'
	}
];

export const defaultRecurrenceRules = [
	{
		eventTypeKey: 'board_meeting_held',
		organisationId: organisationUkLtd.id,
		name: 'Quarterly Board Meeting',
		frequency: 'monthly',
		interval: 3
	},

	{
		eventTypeKey: 'shareholder_meeting_held',
		organisationId: organisationUkLtd.id,
		name: 'Annual Shareholder Meeting',
		frequency: 'yearly',
		interval: 1
	},

	{
		eventTypeKey: 'risk_assessment_created',
		organisationId: organisationUkLtd.id,
		name: 'Annual Risk Review',
		frequency: 'yearly',
		interval: 1
	},

	{
		eventTypeKey: 'policy_created',
		organisationId: organisationUkLtd.id,
		name: 'Annual Policy Review',
		frequency: 'yearly',
		interval: 1
	},

	{
		eventTypeKey: 'backup_test_completed',
		organisationId: organisationUkLtd.id,
		name: 'Annual Backup Restore Test',
		frequency: 'yearly',
		interval: 1
	},

	{
		eventTypeKey: 'cyber_security_review_completed',
		organisationId: organisationUkLtd.id,
		name: 'Annual Cyber Security Review',
		frequency: 'yearly',
		interval: 1
	}
];
