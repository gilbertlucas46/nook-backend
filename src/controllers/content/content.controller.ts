import { cityEntity } from '@src/entity';
export class ContentController {
	async regionsList() {
		return await cityEntity.list();
	}
}

export const contentController = new ContentController();
