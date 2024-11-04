import { BaseMongoEntityService } from '../mongo/BaseMongoEntityService';
import { MongoCollectionName } from './constants';
import { IEntityCommerceUser } from '@/types/ecommerce/IEntityCommerceUser';

export default class EntityCommerceUserService extends BaseMongoEntityService<IEntityCommerceUser> {
  getCollectionName(): MongoCollectionName {
    return MongoCollectionName.COMMERCE_USER;
  }
}
