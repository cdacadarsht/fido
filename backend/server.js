const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Explicit route to serve index.html on root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

let publicKeyCredentialOptions = {};

app.post('/generate-options', (req, res) => {
  const userId = req.body.username;
  const challenge = crypto.randomBytes(32).toString('base64');

  publicKeyCredentialOptions = {
    challenge: challenge,
    rp: {
      name: "FIDO Web App"
    },
    user: {
      id: Buffer.from(userId, 'utf8'),
      name: userId,
      displayName: userId
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 } // ECDSA with SHA-256
    ],
    timeout: 60000,
    attestation: "direct"
  };

  res.json(publicKeyCredentialOptions);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


