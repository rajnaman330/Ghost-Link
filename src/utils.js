import CryptoJS from "crypto-js";

// Ye wo chabi hai jisse message lock hoga. 
// Asli app mein hum ise chhupa ke rakhte hain.
const SECRET_KEY = "ghost-link-super-secret-key"; 

export const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

export const decryptMessage = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};