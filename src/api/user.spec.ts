import {testSapi} from '../../spec/helpers/sakura-api';
import {User} from './user';

describe('User tests', () => {
  const sapi = testSapi({
    routables: [User]
  });

  it('User', () => {
    pending('not implemented');
  });
});
