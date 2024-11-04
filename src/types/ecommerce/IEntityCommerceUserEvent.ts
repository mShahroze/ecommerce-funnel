import { ObjectId } from 'mongodb';
import { IModelWithMongoId } from '../mongo/IModelWithMongoId';

export type TCommerceEventType =
  | 'session'
  | 'product_view'
  | 'checkout'
  | 'purchase';

export interface IEntityCommerceUserEvent extends IModelWithMongoId {
  date: Date;
  event_type: TCommerceEventType;
  user_id: ObjectId;
  commerce_reference_id: ObjectId | null;
}
