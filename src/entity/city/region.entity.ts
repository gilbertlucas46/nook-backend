import { BaseEntity } from '@src/entity/base/base.entity';
import { RegionDocument, IRegion } from '@src/models/region';
import { REGIONS } from '@src/constants/region.constants';
import { ICity } from '@src/models/city';
import { cityEntity } from './cities.entity';

class RegionEntity extends BaseEntity {
	constructor() {
		super('Region');
	}
	/**
	 * @description A function to insert document into collection.
	 * @param payload entity data
	 */
	async save(payload: IRegion): Promise<RegionDocument> {
		const document = await this.DAOManager.save<RegionDocument>(this.modelName, payload);
		return document;
	}
	/**
	 * @description A function to insert multiple documents into collection.
	 * @param data entity info
	 */
	async store(payload: IRegion[]): Promise<RegionDocument[]> {
		const documents = await this.DAOManager.store<RegionDocument>(this.modelName, payload);
		return documents;
	}

	async isEmpty(): Promise<boolean> {
		return !await this.DAOManager.count(this.modelName, {});
	}
	async bootstrap() {
		if (await this.isEmpty()) {
			const regionsData: IRegion[] = REGIONS.map(({ cities, ...data }) => data);
			const regionDocs: RegionDocument[] = await this.store(regionsData);
			const citiesData: ICity[] = regionDocs.map<ICity[]>((doc: RegionDocument, index: number) => {
				return REGIONS[index].cities.map((city) => {
					return {
						...city,
						region: doc._id,
					};
				});
			}).reduce<ICity[]>((allCities: ICity[], regionalCities: ICity[]) => allCities.concat(regionalCities), []);
			await cityEntity.store(citiesData);
		}
	}
	async clear() {
		await this.DAOManager.remove(this.modelName, {});
	}
}

export const regionEntity = new RegionEntity();
