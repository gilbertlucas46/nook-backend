export namespace LoanRequest {
  export interface PreLoan {
    bankId?: string;
    property: {
      value: number;
      type: string;
      status: string;
      developer?: string;
    };
    employmentInfo: {
      type: string;
      rank: string;
      tenure: string;
      income: number;
    };
    other: {
      dob: string;
      age: number;
      nationality: string;
      localVisa: boolean;
      creditCard: {
        status: string;
        limit?: number;
        cancelled: boolean;
      };
      prevLoans: {
        status: boolean;
        monthlyTotal?: number;
        remainingTotal?: number;
      };
      otherIncome: {
        status: boolean;
        monthlyIncome?: number;
      };
      married: {
        status: boolean;
        spouseMonthlyIncome?: number;
      };
      coBorrower: {
        status: boolean;
        coBorrowerMonthlyIncome?: number;
      };
    };
    loan: {
      type: string;
      term: number;
      percent: number;
      amount: number;
      fixingPeriod: number;
    };
  }

  export interface AdminAddPreLoan {
    bankId?: string;
    preQualificationId?: string;
    property: {
      value: number;
      type: string;
      status: string;
      developer?: string;
    };
    employmentInfo: {
      type: string;
      rank: string;
      tenure: string;
      income: number;
    };
    other: {
      dob: string;
      age: number;
      nationality: string;
      localVisa: boolean;
      creditCard: {
        status: string;
        limit?: number;
        cancelled: boolean;
      };
      prevLoans: {
        status: boolean;
        monthlyTotal?: number;
        remainingTotal?: number;
      };
      otherIncome: {
        status: boolean;
        monthlyIncome?: number;
      };
      married: {
        status: boolean;
        spouseMonthlyIncome?: number;
      };
      coBorrower: {
        status: boolean;
        coBorrowerMonthlyIncome?: number;
      };
    };
    loan: {
      type: string;
      term: number;
      percent: number;
      amount: number;
      fixingPeriod: number;
    };
  }

  export interface PropertyInfo {
    value: number;
    type: string;
    status: string;
    developer?: string;
  }

  export interface PersonalInfo {
    firstName: string;
    lastName?: string;
    middleName: string;
    gender: string;
    nationality: string;
    educationBackground: string;
    civilStatus: string;
    birthDate: any;
    motherMaidenName?: string;
    monthlyIncome: number;
    otherIncome: number;
    creditCard?: {
      status: string;
      limit: number;
      cancelled: boolean;
    };
    spouseInfo?: {
      firstName?: string;
      lastName?: string;
      middleName?: string;
      birthDate?: any;
      monthlyIncome?: number;
      isCoborrower?: boolean;
    };
    coBorrowerInfo?: {
      firstName?: string;
      lastName?: string;
      middleName?: string;
      birthDate?: any;
      monthlyIncome?: number;
      isCoborrower?: boolean;
      relationship?: string;
    };
  }

  export interface BankInfo {
    iconUrl: string;
    bankId: string;
    path:   string;
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
    propertyClassification?: string;
  }
  export interface EmploymentInfo {
    tin: string;
    companyName: string;
    sss: string;
    officePhone: string;
    officeEmail: string;
    officeAddress: string;
    companyIndustry: string;
    rank: string;
    type: string;
    coBorrowerInfo?: {
      employmentType: string;
      tin: string;
      companyName: string;
      sss: string;
      employmentRank: string;
      employmentTenure: string;
      companyIndustry: string;
      officePhone: number;
      officeEmail: string;
      officeAddress: string;
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
  export interface LoanAttorneyInfo {
    name: string;
    contactNumber: number;
    address: string;
    relationship?: string;
  }
  export interface AddLoan {
    assignedTo?: string;
    userId: string; // in case of admin assign loan-application
    ipAddress: string;
    loanId?: string;
    saveAsDraft?: boolean;
    personalInfo?: PersonalInfo;
    propertyInfo: PropertyInfo;
    bankInfo?: BankInfo;
    contactInfo?: ContactInfo;
    loanDetails?: LoanDetails;
    loanAttorneyInfo?: LoanAttorneyInfo;
    employmentInfo?: EmploymentInfo;
    dependentsInfo?: DependentsInfo[];
    propertyDocuments?: PropertyDocuments;
    applicationStatus?: string;
    notificationType: string;
    // saveHistory:boolean;
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
    partnerId?: string;
  }

  export interface IGetAdminLoanList {
    limit: number;
    page: number;
    sortType?: number;
    sortBy?: string;
    fromDate?: number;
    toDate?: number;
    status?: string;
    amountFrom?: number;
    amountTo?: number;
    searchTerm?: string;
    staffId?: string;
    partnerId?: string;
    // applicationStatus: string;
  }

  export interface IAdminPrequalificationList {
    page: number;
    limit: number;
    fromDate: number;
    toDate: number;
    sortType: number;
    propertyValue: number;
    propertyType: number;
    searchTerm: number;
  }
}
