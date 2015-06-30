var normalizeUrl = require('normalizeurl'),
    x509         = require('x509'),
    request      = require('request'),
    crypto       = require('crypto');

module.exports = function(req, res, next) {

    var url = normalizeUrl(req.get('SignatureCertChainUrl')),
        signature = req.get('Signature'),
        urlPattern = new RegExp('^https://s3\.amazonaws\.com(:443)?\/echo.api\/'),
        date = new Date(),
        timestamp = new Date(req.body.request.timestamp),
        valid = false;

    if(Math.abs(date - timestamp) / 1000 > 150) {
        next('route');
    } else if(!urlPattern.test(url)) {
        next('route');
    } else {

        request(url, function (error, response, data) {

            if (!error && response.statusCode == 200) {

                var cert = x509.parseCert(data);

                if (cert.notBefore <= date && cert.notAfter >= date) {
                    var san = cert.extensions.subjectAlternativeName;

                    if(san === 'DNS:echo-api.amazon.com') {

                        var publicKey = cert.publicKey.n,
                        verifier = crypto.createVerify('SHA1');

                        verifier.update(JSON.stringify(req.body));
                        valid = verifier.verify(data, signature, 'base64');

                    }

                }

                valid ? next() : next('route');
            }

        });
    }

}
