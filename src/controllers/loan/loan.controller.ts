import * as ENTITY from '@src/entity';
import { Types } from 'mongoose';
import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanEntity } from '@src/entity/loan/loan.entity';
import * as Contsant from '@src/constants/app.constant';
import { LoanRequest } from '@src/interfaces/loan.interface';

class LoanControllers extends BaseEntity {

    async addLoanRequirements(payload: any) {
        try {
            const bankData = await ENTITY.LoanEntity.createOneEntity(payload);
            if (bankData) {
                payload.bankId = Types.ObjectId(bankData._id);
                await ENTITY.EligibilityEntity.createOneEntity(payload);
            }
            return;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async addLoanApplication(payload, userData) {
        try {
            const criteria = {
                saveAsDraft: { $ne: true },
            };
            payload['userId'] = userData._id;
            const referenceNumber = await ENTITY.LoanApplicationEntity.getReferenceId(criteria);
            if (!referenceNumber) {
                const year = new Date(new Date().getTime()).getFullYear().toString().substr(-2);
                const month = ('0' + (new Date(new Date().getTime()).getMonth() + 1)).slice(-2);
                // const date = new Date(new Date(new Date()).getTime()).getDate();
                const date = ('0' + (new Date(new Date().getTime()).getDate() + 1)).slice(-2);

                const referenceId = 1;
                const formattedTime = Contsant.SERVER.HLA + '-' + year + month + date + '-' + Contsant.SERVER.LOAN_PRE__ZEOS + referenceId;
                payload['referenceId'] = formattedTime;
            } else {
                const year = new Date(referenceNumber.createdAt).getFullYear().toString().substr(-2);
                const month = new Date(referenceNumber.createdAt).getMonth().toString().substr(-2);
                const date = new Date(referenceNumber.createdAt).getDate().toString().substr(-2);
                const id = referenceNumber['referenceId'].split('-')[2];

                referenceNumber['referenceId']++;
                let num = (parseInt(id) + 1).toString();
                console.log('numnumnumnumnumnum', num);
                const remainingChars = 4 - num.length;
                for (let i = 0; i < remainingChars; i++) {
                    num = '0' + num;
                }
                const formattedTime = Contsant.SERVER.HLA + '-' + year + month + date + '-' + num;
                console.log('formattedTimeformattedTimeformattedTimeformattedTime', formattedTime);
                payload['referenceId'] = formattedTime;
            }

            const data = await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);
            return data['referenceId'];

        } catch (error) {
            console.log('Error ', error);
            return Promise.reject(error);
        }
    }

    async updateLoanApplication(payload) {
        try {
            const data = await ENTITY.LoanApplicationEntity.updateLoanApplication(payload);
            return data['referenceId'];
        } catch (error) {
            console.log('Error ', error);
            return Promise.reject(error);
        }
    }

    async checkPreloanApplication(payload) {
        try {
            const bankList = await LoanEntity.preloan(payload);
            return bankList;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async userLoansList(payload, userData) {
        try {
            const data = await ENTITY.LoanApplicationEntity.getUserLoanList(payload, userData);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async loanById(payload: LoanRequest.LoanById, userData) {
        try {
            const criteria = {
                _id: payload.loanId,
            };
            const data = await ENTITY.LoanApplicationEntity.getOneEntity(criteria, {});

            if (!data) {
                return Promise.reject(Contsant.STATUS_MSG.ERROR.E400.INVALID_ID);
            } else {
                return data;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async adminUpdateLoanStatus(payload, adminData) {
        try {
            const criteria = {
                _id: payload.loanId,
            };
            const dataToUpdate: any = {};
            dataToUpdate.$set = {
                applicationStatus: payload.status,
            };

            dataToUpdate.$push = {
                approvedBy: {
                    adminId: adminData._id,
                    adminName: adminData ? adminData.name : '',
                    approvedAt: new Date().getTime(),
                },
            };

            const data = await ENTITY.LoanApplicationEntity.updateOneEntity(criteria, dataToUpdate);
            if (!data) {
                return Promise.reject(Contsant.STATUS_MSG.ERROR.E400.INVALID_ID);
            } else {
                return data;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async loanShuffle() {
        try {
//
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

// const shortId: string = new Date(referenceNumber.createdAt).shortId();            // const id: string = `${a.getFullYear}`
// Date.prototype.shortId = function(this: Date) {
//     return `${this.getFullYear().toString().substr(-2)}${this.getMonth()}${this.getDate()}`;
// };
// return referenceNumber;
// return data['referenceId'];

export const LoanController = new LoanControllers();