var request = require('request');
var config = require('../../config/configuration.json');
var VisaAPIClient = require('../../libs/visaapiclient.js');
var assert = require('chai').assert;
var req = request.defaults();
var randomstring = require('randomstring');
var crypto = require('@trust/webcrypto');
var ab2str = require('arraybuffer-to-string');


describe('Cybersource Payments Test non tokenized', function () {
	var apiKey = config.apiKey;
	var baseUri = 'cybersource/';
	var visaAPIClient = new VisaAPIClient();
	var paymentRsrc;

	var processPaymentRequest = JSON.stringify({
		"clientReferenceInformation": {
			"code": "TC50171_3"
		},
		"processingInformation": {
			"commerceIndicator": "internet"
		},
		"aggregatorInformation": {
			"subMerchant": {
				"cardAcceptorID": "1234567890",
				"country": "US",
				"phoneNumber": "650-432-0000",
				"address1": "900 Metro Center",
				"postalCode": "94404-2775",
				"locality": "Foster City",
				"name": "Visa Inc",
				"administrativeArea": "CA",
				"region": "PEN",
				"email": "test@cybs.com"
			},
			"name": "V-Internatio",
			"aggregatorID": "123456789"
		},
		"orderInformation": {
			"billTo": {
				"country": "US",
				"lastName": "VDP",
				"address2": "Address 2",
				"address1": "201 S. Division St.",
				"postalCode": "48104-2201",
				"locality": "Ann Arbor",
				"administrativeArea": "MI",
				"firstName": "RTS",
				"phoneNumber": "999999999",
				"district": "MI",
				"buildingNumber": "123",
				"company": "Visa",
				"email": "test@cybs.com"
			},
			"amountDetails": {
				"totalAmount": "102.21",
				"currency": "USD"
			}
		},
		"paymentInformation": {
			"card": {
				"expirationYear": "2031",
				"number": "5555555555554444",
				"securityCode": "123",
				"expirationMonth": "12",
				"type": "002"
			}
		}
	});

	describe('Reverse payment', function () {
		it('Process payment', function (done) {
			this.timeout(10000);
			var resourcePath = 'v2/payments';
			var queryParams = 'apikey=' + apiKey;

			visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, processPaymentRequest, 'POST', {},
				function (err, responseCode, body) {
					if (!err) {
						assert.equal(responseCode, 200);
						paymentRsrc = body;
						console.log(paymentRsrc);
					} else {
						assert(false);
					}
					done();
				});
		});

		it('Reverse payment', function (done) {
			if (!paymentRsrc) {
				assert(false, 'payment is not defined');
				done();
				return;
			}
			this.timeout(10000);
			var resource = paymentRsrc._links.authReversal;
			var resourcePath = resource.href.replace('/pts/', '');
			var queryParams = 'apikey=' + apiKey;

			visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, processPaymentRequest, resource.method, {},
				function (err, responseCode, body) {
					if (!err) {
						assert.equal(responseCode, 200);
					} else {
						assert(false);
					}
					done();
				});
		});
	});

	describe('Capture, refund and void payment', function () {
		it('Process payment', function (done) {
			this.timeout(10000);
			var resourcePath = 'v2/payments';
			var queryParams = 'apikey=' + apiKey;

			visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, processPaymentRequest, 'POST', {},
				function (err, responseCode, body) {
					if (!err) {
						assert.equal(responseCode, 200);
						paymentRsrc = body;
						console.log(paymentRsrc);
					} else {
						assert(false);
					}
					done();
				});
		});

		it('Capture payment', function (done) {
			if (!paymentRsrc) {
				assert(false, 'payment is not defined');
				done();
				return;
			}
			this.timeout(10000);
			var resource = paymentRsrc._links.capture;
			var resourcePath = resource.href.replace('/pts/', '');
			var queryParams = 'apikey=' + apiKey;
			var request = JSON.stringify({
				"clientReferenceInformation": {
					"code": "TC50171_3"
				},
				"orderInformation": {
					"amountDetails": {
						"totalAmount": "102.21",
						"currency": "USD"
					}
				}
			});

			visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, request, resource.method, {},
				function (err, responseCode, body) {
					if (!err) {
						assert.equal(responseCode, 200);
						paymentRsrc = body;
					} else {
						assert(false);
					}
					done();
				});
		});

		it('Refund payment', function (done) {
			if (!paymentRsrc) {
				assert(false, 'payment is not defined');
				done();
				return;
			}
			this.timeout(10000);
			var resource = paymentRsrc._links.refund;
			var resourcePath = resource.href.replace('/pts/', '');
			var queryParams = 'apikey=' + apiKey;
			var request = JSON.stringify({
				"clientReferenceInformation": {
					"code": "TC50171_3"
				},
				"orderInformation": {
					"amountDetails": {
						"totalAmount": "102.21",
						"currency": "USD"
					}
				}
			});

			visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, request, resource.method, {},
				function (err, responseCode, body) {
					if (!err) {
						assert.equal(responseCode, 200);
						paymentRsrc = body;
					} else {
						assert(false);
					}
					done();
				});
		});

		it('Void payment', function (done) {
			if (!paymentRsrc) {
				assert(false, 'payment is not defined');
				done();
				return;
			}
			this.timeout(10000);
			var resource = paymentRsrc._links.void;
			var resourcePath = resource.href.replace('/pts/', '');
			var queryParams = 'apikey=' + apiKey;
			var request = JSON.stringify({
				"clientReferenceInformation": {
					"code": "TC50171_3"
				}
			});

			visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, request, resource.method, {},
				function (err, responseCode, body) {
					if (!err) {
						assert.equal(responseCode, 200);
						paymentRsrc = body;
					} else {
						assert(false);
					}
					done();
				});
		});
	});

});

// describe('Cybersource Payments Test non ecrypted tokenized', function () {
	// this.timeout(10000);
// 	var apiKey = config.apiKey;
// 	var baseUri = 'cybersource/';
// 	var visaAPIClient = new VisaAPIClient();
// 	var keyId, publicKey;


// 	it('Cybersource Generate Key Test', function (done) {
// 		var request = JSON.stringify({
// 			"encryptionType": "None"
// 		});
// 		var resourcePath = 'payments/flex/v1/keys';
// 		var queryParams = 'apikey=' + apiKey;
// 		visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, request, 'POST', {},
// 			function (err, responseCode, body) {
// 				if (!err) {
// 					assert.equal(responseCode, 200)
// 					if (responseCode === 200) {
// 						keyId = body.keyId;
// 					}
// 				} else {
// 					assert(false, err);
// 				}
// 				done();
// 			});
// 	});

// 	it('Cybersource Tokenize Card Test', function (done) {
// 		if (!keyId) {
// 			assert(false, 'keyId not defined');
// 			done();
// 			return;
// 		}
// 		var cardNumber = '4111111111111111';
// 		var request = JSON.stringify({
// 			keyId: keyId,
// 			cardInfo: {
// 				cardNumber: cardNumber, // non encrypted card number
// 				// cardExpirationMonth: "10",
// 				// cardExpirationYear: "2020",
// 				cardType: '001'
// 			}
// 		});
// 		var resourcePath = 'payments/flex/v1/tokens';
// 		var queryParams = 'apikey=' + apiKey;
// 		visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, request, 'POST', {},
// 			function (err, responseCode, body) {
// 				if (!err) {
// 					assert.equal(responseCode, 200);
// 				} else {
// 					assert(false, body.message);
// 				}
// 				done();
// 			});
// 	});

// });


// describe('Cybersource Payments Test encrypted Tokenized', function () {
// 	var apiKey = config.apiKey;
// 	var baseUri = 'cybersource/';
// 	var visaAPIClient = new VisaAPIClient();

// 	var keyId, publicKey;


// 	it('Cybersource Generate Key Test', function (done) {
// 		var request = JSON.stringify({
// 			"encryptionType": "RsaOaep256"
// 		});
// 		var resourcePath = 'payments/flex/v1/keys';
// 		var queryParams = 'apikey=' + apiKey;
// 		visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, request, 'POST', {},
// 			function (err, responseCode, body) {
// 				if (!err) {
// 					if (responseCode !== 200) {
// 						assert(false);
// 						return;
// 					}
// 					keyId = body.keyId;
// 					// Encrypt cardholders device. This should be done on the cardholders’ device
// 					crypto.subtle.importKey(
// 						"jwk",
// 						{
// 							kty: "RSA",
// 							e: body.jwk.e,
// 							n: body.jwk.n,
// 							alg: "RSA-OAEP-256",
// 							ext: true,
// 						},
// 						{
// 							name: "RSA-OAEP",
// 							hash: { name: "SHA-256" },
// 						},
// 						false,
// 						["encrypt"]
// 					).then(function (key) {
// 						publicKey = key;
// 						assert(true);
// 						done();
// 					}).catch(function (err) {
// 						console.error(err);
// 						assert(false, err);
// 						done();
// 					});
// 				} else {
// 					assert(false, err);
// 					done();
// 				}
// 			});
// 	});

// 	it('Cybersource Tokenize Card Test', function (done) {
// 		if (!keyId || !publicKey) {
// 			assert(false, 'keyId or publicKey not defined');
// 			done();
// 			return;
// 		}

// 		var cardNumber = '4111111111111111';

// 		console.log('public');
// 		console.log(publicKey.algorithm);
// 		console.log(Object.keys(publicKey.algorithm));

// 		return crypto.subtle.encrypt(
// 			{
// 				name: "RSA-OAEP",
// 				hash: { name: 'SHA-256' }
// 			},
// 			publicKey,
// 			cardNumber
// 		)
// 			.then(function (encrypted) {
// 				var request = JSON.stringify({
// 					keyId: keyId,
// 					cardInfo: {
// 						cardNumber: ab2str(encrypted, 'base64'), // encrypted card number
// 						cardExpirationMonth: "10",
// 						cardExpirationYear: "2020",
// 						cardType: '001'
// 					}
// 				});
// 				var resourcePath = 'payments/flex/v1/tokens';
// 				var queryParams = 'apikey=' + apiKey;
// 				visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, request, 'POST', {},
// 					function (err, responseCode, body) {
// 						if (!err) {
// 							assert.equal(responseCode, 200);
// 						} else {
// 							assert(false);
// 						}
// 						done();
// 					});
// 			})
// 			.catch(function (err) {
// 				console.error(err);
// 				assert(false);
// 				done();
// 			});
// 	});
// });
