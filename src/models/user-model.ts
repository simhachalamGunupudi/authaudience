import {
  Db,
  IDbGetParams,
  IFromDbOptions,
  Json,
  Model,
  SakuraApi,
  SapiModelMixin
} from '@sakuraapi/api';
import {
  Collection,
  CollectionInsertOneOptions,
  CollectionOptions,
  Cursor,
  Db as MongoDb,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  ObjectID,
  ReplaceOneOptions,
  UpdateWriteOpResult
} from 'mongodb';

import {dbs} from '../config/bootstrap/db';

export {
  Collection,
  CollectionInsertOneOptions,
  CollectionOptions,
  Cursor,
  MongoDb,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  ObjectID,
  ReplaceOneOptions,
  UpdateWriteOpResult,
  IDbGetParams,
  IFromDbOptions,
  SakuraApi
};

@Model({
  dbConfig: dbs.configdatabase
})
export class User extends SapiModelMixin() {
  @Db() @Json()
  email: string;

  @Db() @Json()
  emailVerified: boolean;

  @Db({field: 'emailVerified'}) @Json({field: 'emailVerified'})
  emailVerificationKey: string;

  @Db({field: 'fn'}) @Json()
  firstName: string;

  @Db() @Json()
  lastLogin: Date;

  @Db({field: 'ln'}) @Json()
  lastName: string;

  @Db({field: 'pw', private: true}) @Json()
  password: string;

  @Db({field: 'pwHash'}) @Json()
  passwordResetHash: string;

  @Db() @Json()
  passwordStrength: number;

  @Db() @Json()
  phone: string;
}
