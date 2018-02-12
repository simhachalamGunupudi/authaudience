/// <reference types="express" />
import { SakuraApi } from '@sakuraapi/api';
import { NextFunction, Request, Response } from 'express';
import { LogService } from '../services/log-service';
export { SakuraApi };
declare const ConfigApi_base: {
    new (...args: any[]): {
        sapi?: SakuraApi;
        sapiConfig?: any;
    };
    getRouteHandler?: (req: Request, res: Response, next: NextFunction) => void;
    getAllRouteHandler?: (req: Request, res: Response, next: NextFunction) => void;
    putRouteHandler?: (req: Request, res: Response, next: NextFunction) => void;
    postRouteHandler?: (req: Request, res: Response, next: NextFunction) => void;
    deleteRouteHandler?: (req: Request, res: Response, next: NextFunction) => void;
    sapi?: SakuraApi;
    sapiConfig?: any;
} & (new (...args: any[]) => {});
export declare class ConfigApi extends ConfigApi_base {
    private log;
    constructor(log: LogService);
    deleteHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    getHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    headHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    postHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    putHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    configHandler(req: Request, res: Response): Promise<void>;
}
