import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {LocalPreSignupProvider} from '../../providers';

describe('Local Pre Signup Service', () => {
  let localPresignupProvider: LocalPreSignupProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('Pre Signup Service', () => {
    it('checks if provider returns a function', async () => {
      const result = localPresignupProvider.value();
      expect(result).to.be.Function();
    });
  });

  function setUp() {
    localPresignupProvider = new LocalPreSignupProvider();
  }
});
