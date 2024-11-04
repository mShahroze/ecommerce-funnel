import { BaseMongoEntityService } from '../mongo/BaseMongoEntityService';
import { MongoCollectionName } from './constants';
import { IEntityCommerceProduct } from '@/types/ecommerce/IEntityCommerceProduct';

export default class EntityCommerceProductService extends BaseMongoEntityService<IEntityCommerceProduct> {
  public getCollectionName(): MongoCollectionName {
    return MongoCollectionName.COMMERCE_PRODUCT;
  }
}
