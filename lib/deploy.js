'use strict'
let apigateway = require('./apigateway.js')
let dataProcess = require('./dataProcess.js')
let lambda = require('./lambda.js')
let packagers = require('./packagers.js')
let cloudwatchevents = require('./cloudwatchevents.js')
let logger = require('./logger.js')
let misc = require('./misc.js')

// --------------------------------------
//               Deployment
// --------------------------------------
// Initial resource deployment loop
exports.deployResources = (resource) =>
  misc.mapPromises(resource, "Resources", deployResource)

// Create a Resource and the methods associated
let deployResource = (resource) => {
  logger.status('Deploying a Resource')
  return apigateway.resourceCreator(resource)
                   .then(lambda.deployStandalone)
                   .then(dataProcess.buildResource)
                   .then(apigateway.deployMethods)
                  //  .then(cloudwatchevents.deployRules)
                   .then(exports.deployResources)
}
