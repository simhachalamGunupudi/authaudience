import { IDbGetParams, IFromDbOptions, SakuraApi } from '@sakuraapi/api';
import { Collection, CollectionInsertOneOptions, CollectionOptions, Cursor, Db as MongoDb, DeleteWriteOpResultObject, InsertOneWriteOpResult, ObjectID, ReplaceOneOptions, UpdateWriteOpResult } from 'mongodb';
export { Collection, CollectionInsertOneOptions, CollectionOptions, Cursor, MongoDb, DeleteWriteOpResultObject, InsertOneWriteOpResult, ObjectID, ReplaceOneOptions, UpdateWriteOpResult, IDbGetParams, IFromDbOptions, SakuraApi };
declare const User_base: {
    new (...args: any[]): {
        _id: ObjectID;
        id: ObjectID;
        create: (options?: CollectionInsertOneOptions) => Promise<InsertOneWriteOpResult>;
        getCollection: () => Collection<any>;
        getDb: () => MongoDb;
        remove: (filter: any, options?: CollectionOptions) => Promise<DeleteWriteOpResultObject>;
        save: (set?: {
            [key: string]: any;
        }, options?: ReplaceOneOptions) => Promise<UpdateWriteOpResult>;
        toDb: (changeSet?: object) => any;
        toJson: (projection?: any) => any;
        toJsonString: (replacer?: () => any, space?: string | number) => string;
    };
    fromDb: <T>(this: new () => T, json: any, options?: IFromDbOptions) => T;
    fromJson: <T>(this: new (...params: any[]) => T, json: object) => T;
    fromJsonToDb: (json: any) => any;
    fromDbArray: <T>(this: new () => T, jsons: object[], options?: IFromDbOptions) => T[];
    fromJsonArray: <T>(this: new () => T, jsons: object[]) => T[];
    get: <T>(this: new () => T, params: IDbGetParams) => Promise<T[]>;
    getById: <T>(this: new () => T, id: string | ObjectID, project?: any) => Promise<T>;
    getCollection: () => Collection<any>;
    getCursor: (filter: any, project?: any) => Cursor<any>;
    getCursorById: (id: any, project?: any) => Cursor<any>;
    getDb: () => MongoDb;
    getOne: <T>(this: new () => T, filter: any, project?: any) => Promise<T>;
    mapJsonToDb: (json: object) => object;
    removeAll: (filter: any, options?: CollectionOptions) => Promise<DeleteWriteOpResultObject>;
    removeById: (id: ObjectID, options?: CollectionOptions) => Promise<DeleteWriteOpResultObject>;
    sapi: SakuraApi;
    sapiConfig?: any;
} & (new (...args: any[]) => {});
export declare class User extends User_base {
    email: string;
    emailVerified: boolean;
    emailVerificationKey: string;
    firstName: string;
    lastLogin: Date;
    lastName: string;
    password: string;
    passwordResetHash: string;
    passwordStrength: number;
    phone: string;
}
