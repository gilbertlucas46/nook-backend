import { cityEntity } from '@src/entity';
export class ContentController {
	async regionsList() {
		const result = await cityEntity.list();
		return result;
	}
}

export const contentController = new ContentController();
