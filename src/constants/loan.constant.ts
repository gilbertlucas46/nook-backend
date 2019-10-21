export const LOAN_TYPES = {
    PURCHASE_OF_PROPERTY: {
        label: 'Purchase of Property',
        value: 'PURCHASE_OF_PROPERTY',
    },
    CONSTRUCTION: {
        label: 'Construction',
        value: 'CONSTRUCTION',
    },
    RENOVATION: {
        label: 'Renovation',
        value: 'RENOVATION',
    },
    REFINANCING: {
        label: 'Refinancing',
        value: 'REFINANCING',
    },
    LOAN_TAKE_OUT: {
        label: 'Loan Take-out',
        value: 'LOAN_TAKE_OUT',
    },
};
export const CREDIT_CARD_STATUS = {
    YES: {
        label: 'Yes, active credit card',
        value: 'YES',
    },
    NOT_NOW: {
        label: 'No, but I used to own one',
        value: 'NOT_NOW',
    },
    NO: {
        label: 'No, i"ve never had one',
        value: 'NO',
    },
};

export const LOAN_TERMS: number[] = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30];

export const LOAN_PROPERTY_TYPES = {
    APARTMENT: {
        label: 'Apartment',
        value: 'APARTMENT',
    },
    CONDOMINIUM: {
        label: 'Condominium',
        value: 'CONDOMINIUM',
    },
    HOUSE_LOT: {
        label: 'House & Lot',
        value: 'HOUSE_LOT',
    },
    TOWNHOUSE: {
        label: 'Townhouse',
        value: 'TOWNHOUSE',
    },
    VACANT_LOT: {
        label: 'Vacant Lot',
        value: 'VACANT_LOT',
    },
};

export const LOAN_PROPERTY_STATUS = {
    FORECLOSED: {
        label: 'Foreclosed',
        value: 'FORECLOSED',
    },
    PRE_SELLING: {
        label: 'Pre-Selling',
        value: 'PRE_SELLING',
    },
    READY_FOR_OCCUPANCY: {
        label: 'Ready for Occupancy',
        value: 'READY_FOR_OCCUPANCY',
    },
    RESELLING: {
        label: 'Reselling',
        value: 'RESELLING',
    },
    REFINANCING: {
        label: 'I Own It - Refinancing Loan',
        value: 'REFINANCING',
    },
};

export const EMPLOYMENT_TYPE = {
    PRIVATE: {
        label: 'Employed - Private Sector',
        value: 'PRIVATE',
    },
    GOVT: {
        label: 'Employed - Government',
        value: 'GOVT',
    },
    BPO: {
        label: 'Employed - BPO',
        value: 'BPO',
    },
    OFW: {
        label: 'Employed - OFW/Seafarer',
        value: 'OFW',
    },
    SELF: {
        label: 'Self - Employed',
        value: 'SELF',
    },
    PROFESSIONAL: {
        label: 'Professional',
        value: 'PROFESSIONAL',
    },
};

export const EMPLOYMENT_RANK = {
    ASSISTANT_MANAGER: {
        label: 'Assistant Manager',
        value: 'ASSISTANT_MANAGER',
    },
    ASSISSTANT_VICE_PRESIDENT: {
        label: 'Assistant Vice President',
        value: 'ASSISSTANT_VICE_PRESIDENT',
    },
    CHAIRMAN: {
        label: 'Chairman',
        value: 'CHAIRMAN',
    },
    CHIEF_EXECUTIVE_OFFICER: {
        label: 'Chief Executive Officer',
        value: 'CHIEF_EXECUTIVE_OFFICER',
    },
    CLERK: {
        label: 'Clerk',
        value: 'CLERK',
    },
    DIRECTOR: {
        label: 'Director',
        value: 'DIRECTOR',
    },
    EXECUTIVE_VICE_PRESIDENT: {
        label: 'Executive Vice President',
        value: 'EXECUTIVE_VICE_PRESIDENT',
    },
    FIRST_VICE_PRESIDENT: {
        label: 'First Vice President',
        value: 'FIRST_VICE_PRESIDENT',
    },
    GENERAL_EMPLOYEE: {
        label: 'General Employee',
        value: 'GENERAL_EMPLOYEE',
    },
    MANAGER: {
        label: 'Manager',
        value: 'MANAGER',
    },
    NON_PROFESIONNAL: {
        label: 'Non-profesionnal',
        value: 'NON_PROFESIONNAL',
    },
    OWNER: {
        label: 'Owner',
        value: 'OWNER',
    },
    PRESIDENT: {
        label: 'President',
        value: 'PRESIDENT',
    },
    PROFESSIONAL: {
        label: 'Professional',
        value: 'PROFESSIONAL',
    },
    RANK_FILE: {
        label: 'Rank & File',
        value: 'RANK_FILE',
    },
    SENIOR_ASSISTANT_MANAGER: {
        label: 'Senior Assistant Manager',
        value: 'SENIOR_ASSISTANT_MANAGER',
    },
    SENIOR_ASSISTANT_VICE_PRESIDENT: {
        label: 'Senior Assistant Vice President',
        value: 'SENIOR_ASSISTANT_VICE_PRESIDENT',
    },
    SENIOR_MANAGER: {
        label: 'Senior Manager',
        value: 'SENIOR_MANAGER',
    },
    SENIOR_VICE_PRESIDENT: {
        label: 'Senior Vice President',
        value: 'SENIOR_VICE_PRESIDENT',
    },
    SUPERVISOR: {
        label: 'Supervisor',
        value: 'SUPERVISOR',
    },
    VICE_PRESIDENT: {
        label: 'Vice President',
        value: 'VICE_PRESIDENT',
    },
};

export const EMPLOYMENT_TENURE = {
    '0_1': {
        label: 'less than a year',
        value: {
            min: 0,
            max: 1,
        },
    },
    '1_2': {
        label: '1 - 2 years',
        value: {
            min: 1,
            max: 2,
        },
    },
    '2_3': {
        label: '2 - 3 years',
        value: {
            min: 2,
            max: 3,
        },
    },
    '3_100': {
        label: 'more than 3 years',
        value: {
            min: 3,
            max: 100,
        },
    },
};

export const NATIONALITY = {
    FILIPINO: {
        label: 'Philipino',
        value: 'FILIPINO',
    },
    FOREIGNER: {
        label: 'Foreigner',
        value: 'FOREIGNER',
    },
};