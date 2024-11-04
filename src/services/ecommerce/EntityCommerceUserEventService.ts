import { IEntityCommerceProduct } from '@/types/ecommerce/IEntityCommerceProduct';
import { IEntityCommerceUser } from '@/types/ecommerce/IEntityCommerceUser';
import {
  IEntityCommerceUserEvent,
  TCommerceEventType,
} from '@/types/ecommerce/IEntityCommerceUserEvent';
import { BaseMongoEntityService } from '../mongo/BaseMongoEntityService';
import { MongoCollectionName } from './constants';

export interface IModelWithUser {
  user: IEntityCommerceUser;
}

export interface IModelWithProduct {
  product: IEntityCommerceProduct;
}

export interface IModelCommerceUserEventWithReferences
  extends IEntityCommerceUserEvent,
    IModelWithUser,
    IModelWithProduct {}

export default class EntityCommerceUserEventService extends BaseMongoEntityService<IEntityCommerceUserEvent> {
  public getCollectionName(): MongoCollectionName {
    return MongoCollectionName.COMMERCE_USER_EVENT;
  }

  public async genRecentOrderDetails(): Promise<
    IModelCommerceUserEventWithReferences[]
  > {
    const db = await this.genDb();
    const orderDetailsPipeline = await db
      .collection(this.getCollectionName())
      .aggregate<IModelCommerceUserEventWithReferences>([
        {
          $match: {
            event_type: 'purchase',
          },
        },
        {
          $lookup: {
            from: 'commerce-product',
            localField: 'commerce_reference_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: {
            path: '$product',
          },
        },
        {
          $lookup: {
            from: 'commerce-user',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
          },
        },
        {
          $limit: 20,
        },
      ])
      .toArray();

    return orderDetailsPipeline;
  }

  public async genNumRecentEventByType(
    eventType: TCommerceEventType
  ): Promise<number> {
    const db = await this.genDb();
    const numPurchasesPipeline = await db
      .collection(this.getCollectionName())
      .aggregate<{ total_events: number }>([
        {
          $match: {
            event_type: eventType,
          },
        },
        {
          $group: {
            _id: null,
            total_events: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

    return numPurchasesPipeline[0]?.total_events ?? 0;
  }

  public async genNumRecentRevenue(): Promise<number> {
    const db = await this.genDb();
    const revenueSumPipeline = await db
      .collection(this.getCollectionName())
      .aggregate<{ total_price: number }>([
        {
          $match: {
            event_type: 'purchase',
          },
        },
        {
          $lookup: {
            from: 'commerce-product',
            localField: 'commerce_reference_id',
            foreignField: '_id',
            as: 'product_details',
          },
        },
        {
          $unwind: {
            path: '$product_details',
          },
        },
        {
          $group: {
            _id: null,
            total_price: {
              $sum: '$product_details.price',
            },
          },
        },
      ])
      .toArray();

    return revenueSumPipeline[0]?.total_price ?? 0;
  }
}
