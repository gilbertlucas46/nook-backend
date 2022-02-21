export namespace UserRequest {
	export interface UserData {
		_id?: string;
		// userName: string;
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		middleName?: string;
		phoneNumber?: string;
		type?: string;
		// roleType:{
		// title?: string;
		// license?: string;
		// taxnumber?: string;
		// faxNumber?: string;
		fullPhoneNumber?: string;
		language?: string;
		companyName?: string;
		// address?: string;
		aboutMe?: string;
		bankName?:string;
		accountHolderName?:string;
		accountNumber?:string;
		profilePicUrl?: string;
		// isEmailVerified?: boolean;
		// isPhoneVerified?: boolean;
		session?: boolean;
		isProfileComplete: boolean;
		backGroundImageUrl?: string;

	}

	export interface Register {
		_id?: string;
		// userName: string;
		email: string;
		password: string;
		type: string;
	}

	export interface Login1 {
		email: string;
		password: string;
		partnerId?: string;
		partnerName?: string;
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
		middleName?: string;
		lastName: string;
		phoneNumber?: string;
		type?: string;
		countryCode?: string;
		// title?: string;
		// license?: string;
		// taxnumber?: string;
		// faxNumber?: string;
		// fullPhoneNumber?: string;
		language?: string;
		companyName?: string;
		// address?: string;
		aboutMe?: string;
		bankName?:string;
		accountHolderName?:string;
		accountNumber?:string;
		// profilePicUrl?: string;
		// isProfileComplete?: boolean;
		backGroundImageUrl?: string;
	}

	export interface Login extends Session, Login1 { }

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

	export interface UpdateAccount {
		userType: string;
	}


	export interface CompleteRegister {
		_id?: string;
		// userName: string;
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
		ipAddress: string;
		countryCode: string;
		partnerName: string;
		partnerId: string;

	}
}
