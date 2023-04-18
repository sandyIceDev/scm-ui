
import CryptoJS from 'crypto-js';
import elliptic from 'elliptic';

/**
 * msg {
 *  data: 'message content'
 *  signature: 'HmacSha256'
 * }
 */
function signMessage(msg, secretKey){
    const hmac = CryptoJS.HmacSHA256(msg.data, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hmac);
    msg.signature = signature;
}

function verifyMessage(msg,secretKey){
    let signature = msg.signature;
    signMessage(msg,secretKey)
    return signature === msg.signature;
}

function generateEllipticParikey(){
  var EC = elliptic.ec;
  var ec = new EC('curve25519');

  var key = ec.genKeyPair();
  return {
    public:key.getPublic().encode("hex"),
    private:key.getPrivate().toJSON(),
  }
}

function generateEllipticShareKey(prvKey,pubKey){
    var EC = elliptic.ec;
    var ec = new EC('curve25519');
    var key = ec.keyFromPrivate(prvKey)
    var pub = ec.keyFromPublic(pubKey,"hex")
    var shared = key.derive(pub.getPublic());
    return shared.toString(16);
}
function aesEncrypt(sharedKey,msg){
    var key = CryptoJS.enc.Hex.parse(sharedKey); // 256-bit key
    var iv = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(sharedKey).toString().substring(0,32));
    var encrypted = CryptoJS.AES.encrypt(msg, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function aesDecrypt(sharedKey,msg){
    var key = CryptoJS.enc.Hex.parse(sharedKey); // 256-bit key
    var iv = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(sharedKey).toString().substring(0,32));
    var decrypted = CryptoJS.AES.decrypt(msg, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export {
    signMessage,
    verifyMessage,
    generateEllipticParikey,
    generateEllipticShareKey,
    aesEncrypt,
    aesDecrypt
};