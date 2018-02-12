import {testSapi} from '../../spec/helpers/sakura-api';
import {User} from './user-model';

describe('UserModel tests', () => {
  const sapi = testSapi({
    models: [User]
  });

  it('UserModel', () => {
    pending('not implemented');
  });
});
