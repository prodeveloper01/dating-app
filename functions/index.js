const functions = require('firebase-functions');
const STRIPE_SECRET_KEY =
  'sk_test_51HOg48ApFGBvhObCKH1QDWEmLCf54GrsJp9Kiq9bvhd9gmkn8bfPTXKOVrRWPvTjZudTPt1GBuyhMkDbRlY6eDVE00aoNZe4h9';
const stripe = require('stripe')(STRIPE_SECRET_KEY);

exports.payWithStripe = functions.https.onRequest((request, response) => {
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys

  // eslint-disable-next-line promise/catch-or-return
  stripe.charges
    .create({
      amount: request.body.amount,
      currency: request.body.currency,
      source: request.body.token,
      description: request.body.description,
    })
    .then(charge => {
      response.send({response: charge, error: null});
    })
    .catch(err => {
      response.send({error: err});
    });
});
