import { SakuraApi } from '@sakuraapi/api';
import { LoggerInstance } from 'winston';
export { SakuraApi };
export declare type levels = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
declare const LogService_base: {
    new (...args: any[]): {
        sapi: SakuraApi;
        sapiConfig: any;
    };
    sapi: SakuraApi;
    sapiConfig: any;
} & (new (...args: any[]) => {});
export declare class LogService extends LogService_base {
    private static city;
    private static country;
    private static externalHostname;
    private static logger;
    private static hostName;
    private static ip;
    private static nodeEnv;
    readonly logger: LoggerInstance;
    constructor();
    error(message: any, err?: Error): void;
    warn(message: any, err?: Error): void;
    info(message: any, err?: Error): void;
    verbose(message: any, err?: Error): void;
    debug(message: any, err?: Error): void;
    silly(message: any, err?: Error): void;
    private buildJsonObj(message, err?);
    private initializeTransports(config);
    private getIpInfo();
}
