import {testSapi} from '../../spec/helpers/sakura-api';
import {Email} from './email';

describe('Email tests', () => {
  const sapi = testSapi({
    providers: [Email]
  });

  it('Email', () => {
    pending('not implemented');
  });
});
