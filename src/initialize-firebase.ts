import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    // "type": "service_account",
    "projectId": "kayrarr-14eac",
    // "private_key_id": "c6445bfddc030aaa894284d2e2944d0a98c92e23",
    "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCJoTiYkPGg9LB/\nHQv5woPeVNyhikj+tOq2ce1kctRkw1U4s04e0h0iZLZd77L/emigPrPPNHEUtFZO\nqqvbl02R3L+7EPDWsT7whkOFt8cohgJXvrMJy/r22SM8y06FaWTrSlvlIsBcHHug\nr2qZAPnk3/bjzeHee4WhknsKqWjyjwPPMDIhj+ty8RXdid5/yFPfRIMGnE5vuq8P\n/8cBo6XmkkikHv8aQlsDdgWva/YkWwCgjWM5ve3lWhB9mcw8kqK+gd1c9e+264NX\nZNtdEN0UuW4JopCq6jfKo8/DMRcD8h36oBc73sM/WvsrSJyHpAhMjpmp/a5X/poE\nrY/W5cYzAgMBAAECggEAFPXdxbaFZir92k4VLdOG+8xW0a9a0JfDC0gsjFjEqhfp\nmboNErqTP1KxR3si+q+s0YLbJZpqAmo4nsB1bfsMEEPbW2UIGNpjqIP6Mpo7lZtb\nLfvYDoznSsLlD/QyoDTd7sujVTFGtICN/3nXtTel10qYsjb/yD9tqZ7CaGxGlHIk\nRyuLMAx129z0LG8uqrtAXBR+Q05SwR+zDTGfN6bzWqSl4vJLfQCSZXZZldIYM6lK\nwE3bCued4H/m+LogjJE0mu2D8o/zrLTMTFxK61CFs16Wod5Vw7bOni8659GV0xYI\nMRQ7DAtD38bsm2V2zx1A9IIHbw8JOs27bFmKSjp2GQKBgQC+gYoEifZQ/q/ENXLf\n1f4LpAw97y5UilQOmsxaxLLOn9RuD6k2t7vnS1eYupxnCJqmOlLm1Lb+9daYdkuL\nWgCZ1z3PGWK+guiII0slLKM3Mf7we7dPcTsij5E0fgAW6spef+iPyg/EInZSYys6\nkF5sw3jwnbTJy6G5aT3D6E1VlQKBgQC48glTsOYQiFfJTEisfKaGhgp6ZQ2jUfXY\nRa6g9v4Mw60xuBTe5Zaz/nrWNt1OYJR1IrsoHnnlhQABzCGrO4bL1JCYQI0OWvW/\nFC2iMXf1WSQpxh29q/XDJ6+mwnkOjAOTfSsZWmivkzdKJ8HPukcRWKJynn8BEuQx\nu2Vd56aqpwKBgQCYeohkn6QmKeO3EOy0GcxvtssRm2oiwmELG31rPTq8xRK7UQ+o\nOyFLvHMNTHe4xBs75zzJgwJBSbWMbEqE6/HFMJFJPNFbGN5TcKRJydONbxfVlcAf\n9spVHEIlmKArt5toTcpvpFRAMTExOiy0gC8DsOUQ+bllNvZnt8N3FW0ojQKBgGwc\nYENh9zrW2Ko9Q4ZA339nv5xIki5UbOfd4/UILP39LLMRrnGVuADD076BF+EHKAFJ\nKiqLlioLEzP5xfy4sVVZjqTRpyMrHNhzzTEwxbTQRQl+XEhRyzonatCKggV052pC\nEv2hEe0Am6Nnli398Ck9rMhfylIwXuCLcPfxwEWlAoGBAJ4RNGs2/V4EiWTPQ1vA\n991v2pSzyphP7pUNjQG9U6RbX+/awhm9/yTocDYIStBLDozub0z9dh5q7a+26Zs3\nEtazLItSP0NPyJ72z54CbaboyfJWv4YUzGpO7c38UGBaGq++aDot/JsTRKujt7uQ\n+DEKncyEC124YORavSCWZ8PQ\n-----END PRIVATE KEY-----\n",
    "clientEmail": "firebase-adminsdk-eed0s@kayrarr-14eac.iam.gserviceaccount.com",
    // "client_id": "111961008317762285142",
    // "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    // "token_uri": "https://oauth2.googleapis.com/token",
    // "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    // "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-eed0s%40kayrarr-14eac.iam.gserviceaccount.com"
  }
  ),
  storageBucket: 'kayrarr-14eac.appspot.com',
});

const bucket = admin.storage().bucket();

export default bucket;