import {
  IRoutableLocals,
  Routable,
  Route,
  SakuraApi,
  SapiRoutableMixin
}                          from '@sakuraapi/api';
import {
  getRouteHandler,
  putRouteHandler
}                          from '@sakuraapi/api/lib/src/handlers';
import {AuthAudience}      from '@sakuraapi/auth-audience';
import {
  NextFunction,
  Request,
  Response
}                          from 'express';
import {
  FORBIDDEN,
  SERVER_ERROR
}                          from '../lib/http-status';
import {User}              from '../models';
import {JsonWebToken}      from '../models/json-web-token';
import {SalesforceService} from '../services/salesforce';
import {StripeService}     from '../services/stripe';

export {SakuraApi};

@Routable({
  authenticator: AuthAudience,
  baseUrl: 'users',
  model: User,
  suppressApi: true
})
export class UserApi extends SapiRoutableMixin() {
  /*
   *  post /user (user creation) is implemented by auth-native-authority... see sakura-api.ts for config
   */

  constructor(private salesforceService: SalesforceService,
              private stripeService: StripeService) {
    super();
  }

  @Route({
    after: [getRouteHandler],
    method: 'get',
    path: ':id'
  })
  getUserById(req: Request, res: Response, next: NextFunction) {

    try {
      const jwt = (res.locals.jwt) ? JsonWebToken.fromJson(res.locals.jwt) : null;
      const id = req.params.id;

      if (id !== jwt.id) {
        res
          .status(FORBIDDEN)
          .json({error: 'FORBIDDEN'});
      }
    } catch (err) {
      res
        .status(SERVER_ERROR)
        .json({error: 'SERVER_ERROR'});
    }

    next();
  }

  @Route({
    after: [putRouteHandler],
    method: 'put',
    path: ':id'
  })
  saveUser(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const jwt = res.locals.jwt || {};
    const resLocals = res.locals as IRoutableLocals;

    // make sure the user can only update him/her self
    if (jwt.id !== id) {
      res
        .status(FORBIDDEN)
        .json({error: 'FORBIDDEN'});
      return next();
    }

    // Check to see if the address has been modified,
    // if it has, update stripe and salesforce... otherwise,
    // skip directly to updating the user using the [putRouteHandler]
    User
      .getById(id)
      .then((user) => {
        // check to see if the user's address has been modified
        const update = User.fromJson(resLocals.reqBody);
        const isAddressModified = this.billingAddressModified(user, update);
        const wait = [];

        // update Salesforce
        if (isAddressModified && user.salesForceId) {
          wait.push(this.salesforceService.updateAddress(user, update));
        }

        // update stripe
        if (isAddressModified && user.stripeCustomerId) {
          wait.push(this.stripeService.updateUserAddress(user, update));
        }

        return Promise.all(wait);
      })
      .then(() => next())
      .catch((err) => {
        res
          .status(SERVER_ERROR)
          .json({error: 'SERVER_ERROR'});
        return next();
      });
  }

  private billingAddressModified(originalUser: User, updatedUser: User): boolean {
    if (!updatedUser.mailingAddress) {
      return false;
    }

    if (!originalUser.mailingAddress) {
      return true;
    }

    // an empty updatedUser.billingAddress results in false by design
    for (const key of Object.keys(updatedUser.mailingAddress)) {
      if (updatedUser.mailingAddress[key] !== originalUser.mailingAddress[key]) {
        return true;
      }
    }

    return false;
  }
}
