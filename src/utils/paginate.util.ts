import {SERVER } from '../constants';

export const paginate = async (Model: any, pipeline?: object[], limit?: number, page?: number) => {
	try {
		if (limit) {
			limit = Math.abs(limit);
			if (limit > SERVER.MAX_LIMIT) {
				limit = SERVER.MAX_LIMIT;
			}
		} else {
			limit = SERVER.LIMIT;
		}

		if (page && (page !== 0)) {
			page = Math.abs(page);
		} else {
			page = 1;
		}

		const skip = (limit * (page - 1));
		const result = await Model.aggregate(queryBuilder(pipeline || [], skip, limit, page)).exec();
		const theTotal = result[0].metadata && result[0].metadata[0] ? result[0].metadata[0].total : 0;
		const thePage = result[0].metadata && result[0].metadata[0] ? result[0].metadata[0].page : page;
		let pageToSend = -1;
		if (theTotal > (thePage * limit)) {
			pageToSend = thePage + 1;
		}

		return {
			data: result[0].data,
			total: theTotal,
			page: pageToSend,
			limit,
		};
	} catch (err) {
		throw new Error(err);
	}
};

const queryBuilder = (pipeline: object[], skip: number, limit: number, page: number): object[] => {
	const q = pipeline || [];

	q.push({
		$facet: {
			data: [
				{ $skip: skip },
				{ $limit: limit },
			],
			metadata: [{ $count: 'total' }, { $addFields: { page } }],
		},
	});
	return q;
};

export interface PaginateResult {
	data: object[];
	total: number;
	page: number;
	limit: number;
}
