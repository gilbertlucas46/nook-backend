export namespace UserRequest {
	export interface UserData {
		_id?: string;
		userName: string;
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		middleName: string;
		phoneNumber?: string;
		type?: string;
		// roleType:{
		title?: string;
		license?: string;
		taxnumber?: string;
		faxNumber?: string;
		fullPhoneNumber?: string;
		language?: string;
		companyName?: string;
		address?: string;
		aboutMe?: string;
		profilePicUrl?: string;
		isEmailVerified?: boolean;
		isPhoneVerified?: boolean;
		session?: boolean;
		isProfileComplete: boolean;
		backGroundImageUrl?: string;
		isFeaturedProfile?: boolean;
		specializingIn_property_type ?: number[];
	    specializingIn_property_category?: string[];
	    serviceAreas?: string[];
	}

	export interface Register {
		_id?: string;
		userName: string;
		email: string;
		password: string;
		type: string;
	}

	export interface Login1 {
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
		type?: string;
		title?: string;
		license?: string;
		taxnumber?: string;
		faxNumber?: string;
		fullPhoneNumber?: string;
		language?: string;
		companyName?: string;
		address?: string;
		aboutMe?: string;
		profilePicUrl?: string;
		isProfileComplete?: boolean;
		backGroundImageUrl?: string;
		specializingIn_property_type ?: number[];
	    specializingIn_property_category?: string[];
	    serviceAreas?: string[];
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
}
