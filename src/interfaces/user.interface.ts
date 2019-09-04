declare namespace UserRequest {


    export interface userData {
        _id?: string
        userName: String;
        email: string;
        password: string
        firstName: string;
        lastName: string;
        phoneNumber?: string
        type?: string
        // roleType:{
        title?: string
        license?: string;
        taxnumber?: string;
        faxNumber?: string;
        fullPhoneNumber?: string;
        language?: string;
        companyName?: string;
        address?: string;
        aboutMe?: string
        profilePicUrl?: string;
        isEmailVerified?: boolean;
        isPhoneVerified?: boolean;
        session?: boolean;
        isProfileComplete: boolean;
        backGroundImageUrl?: string
    }

    export interface Register {
        _id?: string
        userName: String;
        email: string;
        password: string;
    }

    export interface login1 {
        email: string;
        password: string;
    }
    export interface Session {
        userId?: string;
        validAttempt?: boolean;
        ipAddress: string;
        deviceToken?: string;
        source: string;
        appVersion?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }

    export interface ProfileUpdate {
        _id?: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        type: string;
        title: string;
        license: string;
        taxnumber: string;
        faxNumber: string;
        fullPhoneNumber: string;
        language: string;
        companyName: string;
        address: string;
        aboutMe: string;
        profilePicUrl: string;
        isProfileComplete: boolean;
        backGroundImageUrl: string

    }

    export interface Login extends Session, login1 { }

    export interface ForgetPassword {
        email: string;
    }
    export interface VerifyOtp {
        otp: string;
        email: string;
    }
    export interface ChangePassword {
        oldPassword: string;
        newPassword: string;
    }
    export interface PropertyStatus {

    }
}