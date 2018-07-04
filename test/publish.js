const pact = require('@pact-foundation/pact-node')
const path = require('path')
const opts = {
  pactUrls: [path.resolve(__dirname, '../pacts/platform_cdc_nodeconsumer-platform_cdc_nodeprovider.json')],
  pactBroker: 'http://proxy-k8s-001-test0-platform-gb-lon1.metroscales.io:30052',
  //pactBrokerUsername: '<UserName>',
  //pactBrokerPassword: '<Password>',
  tags: ['prod', 'test'],
  consumerVersion: '1.0.0'
}

pact.publishPacts(opts)
  .then(() => {
    console.log('Pact contract publishing complete!')
    console.log('')
    console.log(`Head over to ${opts.pactBroker} and login with`)
    //console.log(`=> Username: ${opts.pactBrokerUsername}`)
    //console.log(`=> Password: ${opts.pactBrokerPassword}`)
    console.log('to see your published contracts.')
  })
  .catch(e => {
    console.log('Pact contract publishing failed: ', e)
  })
