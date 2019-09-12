declare namespace AdminRequest {
    export interface adminData {
        _id: string;
        name: string;
        otp?: string;
        securityKey?: string;
        fpotp?: string;
        fpotpGeneratedTime?: Date;
        fpotpExpiryTime?: Date;
        isLogin?: boolean;
        // isDeleted?: boolean,
        email: string;
        password: string
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        countryCode?: string;
        fullPhoneNumber?: string;
        profilePicUrl?: string;
        backGroundImageUrl?: string;
        passwordResetToken?: string;
        passwordResetTokenExpirationTime?: Date;
    }

    export interface Session {
        adminId?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }

    export interface login {
        email: string;
        password: string;
    }

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

    export interface Register {
        _id?: string;
        email: string;
        password: string;
    }

    export interface ProfileUpdate {
        _id?: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        fullPhoneNumber?: string;
        profilePicUrl?: string;
        backGroundImageUrl?: string
    }

    export interface TokenPayload {
        adminId:string;
        sessionId : string;
    }
}