export namespace AdminRequest {
	export interface AdminData {
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
		password: string;
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

	export interface Login {
		email: string;
		password: string;
		deviceId?: string;
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
		backGroundImageUrl?: string;
		name?: string;
	}
	export interface TokenPayload {
		adminId: string;
		sessionId: string;
		type: string;
		permission: [string];
	}

	export interface Logout {
		email?: string;
		deviceId?: string;

	}
	// export interface VerifyLink {
	// 	link: string;
	// }

	export interface ResetPassword {
		token: string;
		password: string;
	}


	export interface IUpdateLoanRequest {
		loanId: string;
		status: string;
		staffId: string;
	}

	export interface Permisssion {
		moduleName: string;
		accessLevel: number;
	}
	export interface IaddSubAdmin {
		email: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
		permission: Permisssion;
	}

	export interface IadminUpdatePermission {
		id: string;
		permission?: [object];
		status?: string;
		firstName?: string;
		lastName?: string;
		phoneNumber?: string;
	}

	export interface IcreateUser {
		_id?: string;
		email: string;
		firstName?: string;
		lastName?: string;
		phoneNumber?: string;
		type?: string;
		userName: string;
	}

	export interface IAddUser {
		_id: string;
		email: string;
		userName: string;
		firstName: string;
		middleName: string;
		lastName: string;
		phoneNumber: string;
		type?: string;
		language?: string;
		// title?: string;
		// license?: string;
		companyName?: string;
		address?: string;
		aboutMe?: string;
	}

	export interface IGetUSerList {
		page: number;
		limit: number;
		sortBy: string;
		status: string;
		type: string;
		sortType: number;
		searchTerm: string;
		fromDate: number;
		toDate: number;
		userId?: string;
		isByAdmin?: boolean;
	}
	export interface IUpdateUser {
		userId: string;
		email: string;
		userName: string;
		firstName: string;
		middleName: string;
		lastName: string;
		phoneNumber: string;
		type?: string;
		language?: string;
		// title?: string;
		// license?: string;
		companyName?: string;
		address?: string;
		aboutMe?: string;
	}


}
