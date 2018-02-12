import {testSapi} from '../../spec/helpers/sakura-api';
import {JsonWebToken} from './json-web-token';

describe('JsonWebToken tests', () => {
  const sapi = testSapi({
    models: [JsonWebToken]
  });

  it('JsonWebToken', () => {
    pending('not implemented');
  });
});
