declare namespace UserRequest {


    export interface userData {
        _id?: string
        userName: String;
        email: string;
        password: string
        firstName: string;
        lastName: string;
        phoneNumber?: string
        // type: Array<string>
        // roleType:{

        title?: string
        license?: string;
        taxnumber?: string;
        faxNumber?: string;
        fullMobileNumber?: string;
        language?: string;
        companyName?: string;
        address?: string;
        aboutMe?: string
        profilePicUrl?: string;
        isEmailVerified?: boolean;
        isPhoneVerified?: boolean;
        session?: boolean
    }

    export interface Register {
        _id?: string
        userName: String;
        email: string;
        password: string
        firstName: string;
        lastName: string;
        phoneNumber?: string,
        countryCode?: string
    }



    export interface login {
        email: string;
        password: string;
        deviceId; string;
        deviceToken: string
    }
    export interface Session {
        userId?: string,
        validAttempt?: boolean,
        ipAddress: string,
        deviceId: string,
        deviceToken: string,
        deviceType: string,
        source: string,
        appVersion?: string,
        createdAt?: Date,
        updatedAt?: Date,
        loginStatus: Boolean
    }
}