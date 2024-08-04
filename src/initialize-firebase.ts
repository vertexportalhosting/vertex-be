import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    // "type": "service_account",
    "project_id": "vertex-7543c",
    // "private_key_id": "dfe4fd11154330bfbf05e8a7e8cceb59ffcca61e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDIVrN4MrzI1nU6\nKqpk6pzY68UvusxlsDrLXVaDetIAU9Vb5N8qjdifcEDwI6Jss/b70c0jKHaae1q4\nHkofkbyCtfyOs3vNokyBDkAo/Ko7g6SFuswQsN3vi+rGFiTfpkHcnync5hxOtN2k\nES5l91GkWhg2NJ7EeMaoDtAKl3kQrvd3kMWYGTVYInvceUZLjjvBU5o6EqNUyp16\ntsH6EX968kXtKgz7/qgUK1x5N+rdGLlCKX4L4TPXa/RIIoZTEqIw6Ztrd9iD0S2s\nWibASzsfVaJhhQuwh72mxbVizIJiDAZPtICvUhLq9w9Qg7E/vReWGGqBD/YIJBpu\nJmuqB0N3AgMBAAECggEASt4X0L4JTfbTNUsXhYIl3mzxsl4ZH5Flz3UQrS77htLN\ng7t66NC8mQzev79ZZk006jOj+VUYSa/6nZ74LWcNrz1qZjvN8vGJrJsSQB74UShn\nlfBSbZRjRC+iK6e/3PKpX1T91IcMIh+2Sqd/Eu0Djit7K9qrUJogB1MNzT+BJ0nJ\nRNEurR5XQlPMczamThQqQs9SdNIN7rski1/t8SBhSNxrcZaoS1QzPiQ73e4ga99S\n6fUgCkg6LTfWwf/ybTGZLDvqj9yMxuKLCHGocFC/IHA29q28on8ICJlAOLvfSu9G\nmVuI89aoH/uor4KEyBf9C31Tz0YaZvmR9oVyZI3HfQKBgQD/ZuadppwICwuFBP15\nEPZSUBZrYg+mYSPGg3iSQfhSF/NtPWOOFbdaS2/yOx+osyst0IbuhuJbSrz31GDq\nSwUCpMca/59/eH3iEi6o2ghns8wI6C7d3k6TAr7UGH03tl0mxEb3VvtOUYAq5F1K\nIo7jtUM+uM0P4lPpoRK96dKb+wKBgQDIzsr42JCGqKC3Wjv0+6SVBapGKCbVKTMb\nBxrid/PbcOPddUlpHHhaGVPATr7umbXzFBrMBoAfyN0/547+V4uGuWYbI0mESY/j\n0tuL1/BkWUdIsoVPzi5/1qwIeNapwTmm8UAjOXSgT9FPj1YptX+NyAZXmTm68Ohc\n6P3SvhkBtQKBgQDyj6YCoBOcR/Ee2khpTMTEFC/WuIEogSVbCc3fCixuuzSD0UPV\n06YZaX/eTGya6d7eWidsLkqYbXje3qNUoP8XLauzZobyp1rW9HHAB6Ln6oijBPBN\n4y44zOizwrZZzSbXBJ5plgCCt0DEe7JmEEAo3yQIU7bdmRQc1M9Z8tIFNQKBgFM9\nndf/9hFMD6tR5W7NbdE0kvwYItjUBlJa5KMidFzv9BVWTEMdQSqgOx6Jxg4ke88y\n81TGERCb9FNMSvNWGQmVCyWOwCftUo9vVgEnV4hRlgIltqt5Xb8ynwe4B8xAxARX\nF25Cn/zgeXTQhzgs+54rX62qX8sFmF0DXEyi7rzNAoGBAPUPsCynowgtrzZ3r/jZ\noz58ueH7TxRRnLI3Z73yDdrMZ+szhy+5d203X4ElCt9hfVATchGz7zXJkrpJxesx\nUd/xEyVKr5l5eCHZFmEiAdfRKHIXR2RafxYP8Wa7pnCas3H0Rih6rcRVWqu9ky9h\nBnQZw2ZTVyh7foAOf1NY83AX\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-hslbm@vertex-7543c.iam.gserviceaccount.com",
    // "client_id": "116876703057870441300",
    // "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    // "token_uri": "https://oauth2.googleapis.com/token",
    // "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    // "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hslbm%40vertex-7543c.iam.gserviceaccount.com",
    // "universe_domain": "googleapis.com"
  } as admin.ServiceAccount),
  storageBucket: 'vertex-7543c.appspot.com',
});

const bucket = admin.storage().bucket();

export default bucket;