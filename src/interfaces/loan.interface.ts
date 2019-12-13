export namespace LoanRequest {

    export interface PreLoan {
        bankId?: string;
        property: {
            value: number;
            type: string;
            status: string;
            developer?: string;
        };
        work: {
            type: string;
            rank: string;
            tenure: string;
            income: number;
        };
        other: {
            age: number;
            nationality: string;
            localVisa: boolean,
            creditCard: {
                status: string;
                limit?: number,
                cancelled: boolean;
            },
            prevLoans: {
                status: boolean;
                monthlyTotal?: number;
                remainingTotal?: number;
            },
            otherIncome: {
                status: boolean;
                monthlyIncome?: number;
            },
            married: {
                status: boolean;
                spouseMonthlyIncome?: number;
            },
            coBorrower: {
                status: boolean;
                coBorrowerMonthlyIncome?: number;
            },
        };
        loan: {
            type: string;
            term: number;
            percent: number;
            amount: number;
            fixingPeriod: number;
        };
    }

    export interface PersonalInfo {
        firstName: string;
        lastName?: string;
        middleName: string;
        gender: string;
        educationBackground: string;
        civilStatus: string;
        spouseFirstName: string;
        spouseMiddleName: string;
        spouseLastName: string;
        motherMaidenName: string;
        birthDate: number;
        coBorrowerFirstName: string;
        coBorrowerMiddleName: string;
        coBorrowerLastName: string;
        relationship?: string;
    }
    export interface BankInfo {
        iconUrl: string;
        bankId: string;
        bankName: string;
        abbrevation: string;
    }
    export interface CurrentAddress {
        address: string;
        homeOwnership: string;
    }

    export interface ContactInfo {
        phoneNumber: string;
        email: string;
        mobileNumber: string;
        currentAddress: CurrentAddress;
    }
    export interface LoanDetails {
        fixedPeriod: number;
        loanTerm: number;
        rate: number;
        monthlyRepayment: number;
        loanType: string;
        loanPercent: number;
        loanAmount: number;
        propertyValue: number;
    }
    export interface EmploymentInfo {
        tin: string;
        companyName: string;
        sss: string;
        officePhone: string;
        officeEmail: string;
        officeAddress: string;
        companyIndustry: string;
        coBorrowerInfo: {
            employmentType: string;
            tin: string;
            companyName: string;
            sss: string,
            employmentRank: string;
            // employmentTenure: Joi.string().valid(Object.keys(EMPLOYMENT_TENURE)),
            employmentTenure: string;
            companyIndustry: string;
            officePhone: number,
            officeEmail: string,
            officeAddress: string,
        };
    }
    export interface DependentsInfo {
        name?: string;
        age?: number;
        relationship?: string;
    }
    export interface PurchasePropertyInfo {
        address: string;
        contactPerson: string;
        contactNumber: number;
        collateralDocStatus: boolean;
        collateralDocList: string[];
        docUrl: string;
    }
    export interface PropertyDocuments extends PurchasePropertyInfo {
        borrowerValidDocIds: string[];
        coBorrowerValidId: string[];
        latestITR: string;
        employmentCert: string;
        purchasePropertyInfo: PurchasePropertyInfo;
        nookAgent: string;
    }
    export interface AddLoan extends PropertyDocuments, EmploymentInfo, DependentsInfo, LoanDetails, PersonalInfo, ContactInfo, BankInfo {
        loanId?: string;
        saveAsDraft?: boolean;
        personalInfo?: PersonalInfo;
        bankInfo?: BankInfo;
        contactInfo?: ContactInfo;
        loanDetails?: LoanDetails;
        employmentInfo?: EmploymentInfo;
        dependentsInfo?: DependentsInfo[];
        propertyDocuments?: PropertyDocuments;
    }
    export interface LoanById {
        loanId: string;
    }

    export interface LoanForEmploymentType {
        employmentType?: string;
        employmentRank?: string;
        minEmploymentTenure?: number;
    }
    export interface PropertySpecification {
        allowedPropertyType: string;
        allowedPropertyStatus: string;
        maxLoanDurationAllowed: number;
        maxLoanPercent?: number;
        debtIncomeRatio: number;

    }
    export interface IAddLoanRequirement {
        abbrevation: string;
        bankName: string;
        headquarterLocation: string;
        propertySpecification: [PropertySpecification];
        interestRateDetails: object;
        bankFeePercent?: number;
        bankFeeAmount?: number;
        debtIncomeRatio?: number;
        loanApplicationFeePercent?: number;
        loanMinAmount: number;
        loanMaxAmount: number;
        minLoanDuration?: number;
        maxLoanDuration?: number;
        loanForForeigner?: boolean;
        loanForForeignerMarriedLocal?: boolean;
        loanForNonCreditCardHolder?: boolean;
        loanForCreditCardHolder?: boolean;
        loanForNotNowCreditCardHolder?: boolean;
        loanForCancelledCreditCard?: boolean;
        minAgeRequiredForLoan?: number;
        maxAgeRequiredForLoan?: number;
        loanAlreadyExistDiffBank?: boolean;
        loanAlreadyExistSameBank?: boolean;
        minMonthlyIncomeLoan?: number;
        minMonthlyIncomeRequired?: number;
        missedLoanPaymentAllowance?: boolean;
        bankImageLogoUrl?: string;
        loanForEmploymentType: [LoanForEmploymentType];
    }

    export interface IGetUserLoanList {
        limit: number;
        page: number;
        sortType?: number;
        sortBy?: string;
        fromDate?: number;
        toDate?: number;
        status?: string;
    }
}
