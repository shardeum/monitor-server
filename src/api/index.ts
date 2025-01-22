const express = require('express');
const router = express.Router();

import {Controller} from '../controller';
import {Middleware} from '../middleware';
import config from '../config'

const authentication = require('../controller/authentication');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const requireAuthInProduction = function(req, res, next) {
  if (config.env === 'release') {
    console.log('Release mode required auth')
    requireAuth(req, res, next)
  } else {
    console.log('Dev mode. No auth')
    next()
  }
}

router.post('/signin', requireSignin, authentication.signin);
// router.post('/signup', authentication.signup);

router.get('/report', requireAuthInProduction, Controller.report);
router.get('/sync-report',  requireAuthInProduction, Controller.getSyncReports);
router.get('/scale-report',  requireAuthInProduction, Controller.getScaleReports);
router.get('/removed',  requireAuthInProduction, Controller.getRemoved);
router.get('/flush',  requireAuthInProduction, Controller.flush);
router.get('/history',  requireAuthInProduction, Controller.history);
router.get('/rare-counter', Controller.rareCounter);
router.get('/reset-rare-counter', Controller.resetRareCounter);
router.get('/tx-coverage',  requireAuthInProduction, Controller.getTxCoverage);
router.get('/mock',  requireAuthInProduction, Controller.mock);
router.get('/counted-events', requireAuthInProduction, Controller.countedEvents);
router.get('/invalid-ip', Controller.invalidIPs);
router.get('/version', Controller.version);
router.get('/status',  (req, res) => {
  res.status(200).send({ status: 'online', env: config.env });
});
router.get('/app-versions', requireAuthInProduction, Controller.appVersions);
router.get('/list-foundation-nodes', requireAuthInProduction, Controller.listFoundationNodes);

router.post(
  '/joining',
  Middleware.fieldExistance(['publicKey']),
  Controller.joining
);
router.post(
  '/joined',
  Middleware.fieldExistance(['publicKey', 'nodeId']),
  Controller.joined
);
router.post(
  '/active',
  Middleware.fieldExistance(['nodeId']),
  Controller.active
);
router.post(
  '/removed',
  Middleware.fieldExistance(['nodeId']),
  Controller.removed
);
router.post(
  '/heartbeat',
  Middleware.fieldExistance(['nodeId', 'data']),
  Controller.heartbeat
);
router.post(
  '/sync-statement',
  Middleware.fieldExistance(['nodeId', 'syncStatement']),
  Controller.syncReport
);
router.post(
  '/notify-action-started',
  [Middleware.fieldExistance(['action']), requireAuthInProduction],
  Controller.notifyActionStarted
)

module.exports = router;
