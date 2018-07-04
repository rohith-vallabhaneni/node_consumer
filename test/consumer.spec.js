const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const pact = require('pact')
const MOCK_SERVER_PORT = 1234
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN'

chai.use(chaiAsPromised)

describe('Pact', () => {
  const { somethingLike: like, term, eachLike } = pact.Matchers
  const provider = pact({
    consumer: 'platform_cdc_nodeConsumer',
    provider: 'platform_cdc_nodeProvider',
    port: MOCK_SERVER_PORT,
    log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: LOG_LEVEL,
    spec: 2
  })
  // Setup a Mock Server before unit tests run.
  // This server acts as a Test Double for the real Provider API.
  // We call addInteraction() to configure the Mock Service to act like the Provider
  // It also sets up expectations for what requests are to come, and will fail
  // if the calls are not seen.
  before(() => {
    return provider.setup()
      .then(() => {
        provider.addInteraction({
          uponReceiving: 'ExamplePactJSConsumer test interaction',
          withRequest: {
            method: 'GET',
            path: '/user'
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: {
              id: 1,
              name: 'John'
            }
          }
        })
      })
      .catch(e => {
        throw new Error("Unable to start the Pact Server: " + e)
      })
  })

  // Configure and import consumer API
  // Note that we update the API endpoint to point at the Mock Service
  process.env.API_HOST = `http://localhost:${MOCK_SERVER_PORT}`
  const { getUser } = require('../consumer')

  describe('when a call to the consumer is made', (done) => {
      it('returns the User', done => {
         getUser()
         .then(userReceived => {
            chai.assert.exists(userReceived)
            chai.assert.isObject(userReceived, 'User is an object');
            chai.expect(userReceived).to.have.property('id', 1);
            chai.expect(userReceived).to.have.property('name', 'John')
            done()
      })
      })
  })

  // Creates pact files
  after(() => {
    return provider.finalize()
  })
})
