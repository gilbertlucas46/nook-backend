export const documentRequired = {
    LeagalDocument: {
        valid_Id1: {
            description: 'Valid government issued IDs.',
            value: 'Borrower + Spouse and/or Co-borrower if applicable',
        },
        valid_Id2: {
            description: 'Valid government issued IDs.',
            value: 'Borrower + Spouse and/or Co-borrower if applicable',
        },
        contractCertificate: {
            description: 'Philippine registered marriage',
            value: 'contractCertificate',
        },
        NoMarriage: {
            description: 'If co-borrower is common-law partner',
            value: 'CENOMAR (Certificate of No Marriage)',
        },
        ACR_SRRV_SIRV: {
            description: 'Foreign Nationals living, residing, working in Phils. ACR (Alien Certificacate of Registration); SRRV (Special Resident Retiree Visa); SIRV (Special Investor Resident Visa)',
            value: 'CENOMAR (Certificate of No Marriage)',
        },
        SPA_Loan_Admin: {
            description: 'If borrower is not in Philippines (2 Valid IDs, Name, Address, Contact Details, Relationship to Borrower)	',
            value: 'SPA / Loan Admin',
        },
        Dully_filled_out_and_signed: {
            description: 'Dully filled-out and signed',
            value: 'Application Form'
        }

    }
};