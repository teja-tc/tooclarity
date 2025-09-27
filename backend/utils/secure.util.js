const crypto = require('crypto');

const REQUIRED_KEY_LEN = 32; // 256-bit

function getKey() {
	const keyB64 = process.env.TOKEN_ENC_KEY;
	if (!keyB64) throw new Error('TOKEN_ENC_KEY not configured');
	const key = Buffer.from(keyB64, 'base64');
	if (key.length !== REQUIRED_KEY_LEN) throw new Error('TOKEN_ENC_KEY must be 32 bytes (base64)');
	return key;
}

exports.encrypt = (plaintext) => {
	const key = getKey();
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
	const enc = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
	const tag = cipher.getAuthTag();
	return `${iv.toString('base64')}.${enc.toString('base64')}.${tag.toString('base64')}`;
};

exports.decrypt = (ciphertext) => {
	const key = getKey();
	const [ivB64, encB64, tagB64] = String(ciphertext).split('.');
	const iv = Buffer.from(ivB64, 'base64');
	const enc = Buffer.from(encB64, 'base64');
	const tag = Buffer.from(tagB64, 'base64');
	const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
	decipher.setAuthTag(tag);
	const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
	return dec.toString('utf8');
}; 