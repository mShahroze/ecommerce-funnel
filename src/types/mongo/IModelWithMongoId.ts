import { Document, ObjectId } from 'mongodb';

export interface IModelWithMongoId extends Document {
  _id: ObjectId;
}
