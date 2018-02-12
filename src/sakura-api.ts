import {SakuraApi}        from '@sakuraapi/api';
import {
  addAuthAudience,
  AuthAudience,
  IAuthAudienceOptions
}                         from '@sakuraapi/auth-audience';
import {
  addAuthenticationAuthority,
  IAuthenticationAuthorityOptions
}                         from '@sakuraapi/auth-native-authority';
import {json}             from 'body-parser';
import * as cors          from 'cors';
import * as debugInit     from 'debug';
import * as helmet        from 'helmet';
import {ConfigApi}        from './api/config.api';
import {BootstrapIndexes} from './config/bootstrap/bootstrap-indexes';
import {dbs}                from './config/bootstrap/db';
import {User}      from './models/user-model';
import {LogService}       from './services/log-service';

const debug = debugInit('app:bootstrap');

export class Bootstrap {
  private log: LogService;
  private sapi: SakuraApi;
  private shuttingDown = false;

  async boot(): Promise<SakuraApi> {
    debug('boot called');

    process.env.NODE_ENV = process.env.NODE_ENV || 'development';

    this.sapi = new SakuraApi({
      baseUrl: '/api',
      models: [User],
      plugins: [
        {
          options: this.authAudienceOptions(),
          order: 1,
          plugin: addAuthAudience
        }
      ],
      providers: [
        LogService
      ],
      routables: [
        ConfigApi
      ]
    });

    this.log = this.sapi.getProvider(LogService);

    // SakuraApi setup
    this.sapi.addMiddleware(cors(this.sapi.config.cors), 0);
    this.sapi.addMiddleware(helmet(), 0);
    this.sapi.addMiddleware(json());

    // Add debug tracing
    if (this.sapi.config.TRACE_REQ === 'true') {
      this.sapi.addMiddleware((req, res, next) => {
        this.log.info({
          body: req.body,
          method: req.method,
          url: req.url
        });
        next();
      });
    }

    await this.sapi.dbConnections.connectAll();

    // Bootstrap items
    const wait = [];
    wait.push(new BootstrapIndexes(this.sapi).run());
    await Promise.all(wait);

    process.once('SIGINT', () => this.shutdownServer.call(this, 'SIGINT'));
    process.once('SIGTERM', () => this.shutdownServer.call(this, 'SIGTERM'));
    process.once('SIGUSR1', () => this.shutdownServer.call(this, 'SIGUSR1'));
    process.once('SIGUSR2', () => this.shutdownServer.call(this, 'SIGUSR2'));

    return this.sapi;
  }

  async shutdownServer(signal: string): Promise<void> {
    debug(`shutdownServer called by ${signal}`);

    if (this.shuttingDown) {
      return;
    }

    this.shuttingDown = true;

    this.log.info(`Shutting down Donation Server (signal: ${signal})`);

    await this.sapi
      .close()
      .catch((err) => this.log.error('Unable to shutdown SakuraApi', err));

    this.log.info('And now his watch is ended');
    process.exit(0);
  }

  authNativeAuthorityOptions(): IAuthenticationAuthorityOptions {
    return {
      authDbConfig: dbs.authentication,
      authenticator: AuthAudience,
      defaultDomain: 'default',
      endpoints: {create: 'users'},
      onBeforeUserCreate: this.onBeforeUserCreate.bind(this),
      onChangePasswordEmailRequest: this.onChangePasswordEmailRequest.bind(this),
      onForgotPasswordEmailRequest: this.onForgotPasswordEmailRequest.bind(this),
      onInjectCustomToken,
      onLoginSuccess: this.onLoginSuccess.bind(this),
      onResendEmailConfirmation: this.onResendEmailConfirmation.bind(this),
      onUserCreated: this.onUserCreated.bind(this),
      userDbConfig: dbs.user
    };
  }

  async onChangePasswordEmailRequest(user: any, req: Request, res: Response): Promise<any> {
    (this.emailService as any).onChangePasswordEmailRequest(...arguments);
  }

  async onForgotPasswordEmailRequest(user: any, token: string, req: Request, res: Response): Promise<any> {
    (this.emailService as any).onForgotPasswordEmailRequest(...arguments);
  }

  async onLoginSuccess(user: any, jwt: any, sa: SakuraApi, req: Request, res: Response): Promise<void> {
    debug('onLoginSuccess called');
    this.log.debug(`User ${user.id} login; JWT id: ${jwt.id}`);
  }

  async onResendEmailConfirmation(user: any, token: string, req: Request, res: Response): Promise<any> {
    debug('onResendEmailConfirmation called');
    (this.emailService as any).onResendEmailConfirmation(...arguments);
  }

  async onUserCreated(user: any, token: string, req: Request, res: Response): Promise<any> {
    debug('onUserCreated called');

    // remember, this is not called during tests. Testing uses its own instance of SakuraApi
    // that has its own configuration
    const resLocals = res.locals;

    const usr = Object.assign({}, user);
    usr._id = user.id;

    const userModel = User.fromDb(usr);
    userModel.salesForceId = resLocals.userMeta.salesForceId;
    userModel.stripeCustomerId = resLocals.userMeta.stripeId;

    await userModel.save();
    await this.onUserCreatedSendWelcomeEmail(userModel, token, req, res)
      .catch((err) => this.log.error('SakuraApi.onUserCreated error when sending welcome email', err));
  }

  async onUserCreatedSendWelcomeEmail(user: any, token: string, req: Request, res: Response): Promise<void> {
    (this.emailService as any).onUserCreated(...arguments);
  }

}
