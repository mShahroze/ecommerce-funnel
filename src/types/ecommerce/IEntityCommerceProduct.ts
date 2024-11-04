import { IModelWithMongoId } from '../mongo/IModelWithMongoId';

export type TCurrency = 'USD';

export interface IEntityCommerceProduct extends IModelWithMongoId {
  price: number;
  currency: TCurrency;
}
