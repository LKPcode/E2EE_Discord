import forge from 'node-forge';
import { Buffer } from 'buffer';
import { KeyPair, 
        EncryptedInvitation, 
        DecryptedBlock, 
        MemberItem, 
        EncryptedBlock
    } from '../../types';

// generate a random key and IV
// Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
const generateSymmetricKey = (): string => {
    let key = forge.random.getBytesSync(16);
    key = forge.util.bytesToHex(key);
    return key;
}


// AES encryption
const AES_encrypt = (text:string, key:string, iv:string): string => {
    const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(key));
    cipher.start({iv: forge.util.hexToBytes(iv)});
    cipher.update(forge.util.createBuffer(text));
    cipher.finish();
    const encrypted = cipher.output;
    return encrypted.toHex();
}

const AES_encrypt_file = (file:any, key:string, iv:string) => {
    const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(key));
    cipher.start({iv: forge.util.hexToBytes(iv)});
    // from Buffer to bytes
    cipher.update(forge.util.createBuffer(file));
    cipher.finish();
    const encrypted = cipher.output;
    return encrypted
}


// AES decryption
const AES_decrypt_file = (file:any, key:string, iv:string) => {
    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.hexToBytes(key));
    decipher.start({iv: forge.util.hexToBytes(iv)});
    decipher.update(forge.util.createBuffer(file));
    const result = decipher.finish(); // check 'result' for true/false
    return Buffer.from(decipher.output.data, 'binary');
}


// AES decryption
const AES_decrypt = (encrypted:string, key:string, iv:string) => {
    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.hexToBytes(key));
    decipher.start({iv: forge.util.hexToBytes(iv)});
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encrypted)));
    const result = decipher.finish(); // check 'result' for true/false
    return decipher.output.data;
}

// Hash a string
const hash = (text:string) => {
    const md = forge.md.sha256.create();
    md.update(text);
    return md.digest().toHex();
}


// // Test AES encryption and decryption with a random key and IV
// const key = generateSymmetricKey();
// const iv = generateSymmetricKey();

// console.log("Key:", key);

// const text = "dog";

// const encrypted = AES_encrypt(text, key, iv);
// console.log("Encrypted:", encrypted);

// const decrypted = AES_decrypt(encrypted, key, iv);
// console.log("Decrypted:", decrypted);

// // console.log("Hash:", hash(text));


// Public key cryptography

// Generate a public/private key pair
const generateKeyPairHex = () => {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    let { privateKey, publicKey } = keys;
    let privateKeyHex = convertPrivateKeyObjectToHex(privateKey);
    let publicKeyHex = convertPublicKeyObjectToHex(publicKey);

    return { privateKey:privateKeyHex, publicKey:publicKeyHex };
}


function extractModulusFromPEM(pem:string) {
    const publicKey = forge.pki.publicKeyFromPem(pem);
    return publicKey.n.toString(16); // hexadecimal representation of modulus
}

function reconstructPEMFromModulus(modulusHex:string, exponentHex = '10001') {
    const modulus = new forge.jsbn.BigInteger(modulusHex, 16);
    const exponent = new forge.jsbn.BigInteger(exponentHex, 16);
    const newPublicKey = forge.pki.setRsaPublicKey(modulus, exponent);
    return forge.pki.publicKeyToPem(newPublicKey);
}


// Convert a public key from object to hex
const convertPublicKeyObjectToHex = (public_key:any) => {
    let publicKey = forge.pki.publicKeyToPem(public_key)
   
    return extractModulusFromPEM(publicKey);
}


// Convert a public key from object to hex
const convertPrivateKeyObjectToHex = (private_key:any) => {
    let privateKey = forge.pki.privateKeyToPem(private_key)
    .split('\n').slice(1, -2).join('')
    .replace(/\s+/g, '');
    
    privateKey = Buffer.from(privateKey, 'base64').toString('hex');
    return privateKey;
}


const convertPublicKeyHexToObject = (public_key:string) => {
    let publicKey = reconstructPEMFromModulus(public_key);
    let publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    return publicKeyObj;
}

const convertPrivateKeyHexToObject = (private_key:string) => {
    let privateKey:any  = Buffer.from(private_key, 'hex').toString('base64');
    let privateKeyObj = forge.pki.privateKeyFromPem(
        '-----BEGIN RSA PRIVATE KEY-----\n' +
        privateKey.match(/.{1,64}/g).join('\n') +
        '\n-----END RSA PRIVATE KEY-----\n'
    );

    return privateKeyObj;
}


const convertKeyPairHexToObject = (keyPair:KeyPair) => {
    let { privateKey, publicKey } = keyPair;

    return  {    
                privateKey: convertPrivateKeyHexToObject(privateKey), 
                publicKey: convertPublicKeyHexToObject(publicKey) 
            };
}





// Test public key cryptography


const encryptPGP = (message:string, public_key:string, personalKeyPair:KeyPair): EncryptedInvitation => {

        console.log( "Encrypting PGP message" ,message, public_key, personalKeyPair)

        // PUBLIC KEY OF RECEIVER
        let publicKey = convertPublicKeyHexToObject(public_key);
        // PERSONAL PRIVATE KEY
        let personal_key_pair = convertKeyPairHexToObject(personalKeyPair); 

        // Hash the message
        let md = forge.md.sha1.create();
        md.update(message, 'utf8');
        // Sign the message with personal private key
        let signature = personal_key_pair.privateKey.sign(md);

        // Encrypt the message
        let symmetricKey = generateSymmetricKey(); // Generate a random symmetric key
        let VI = generateSymmetricKey(); // Generate a random IV


        // Encrypt the symmetric key with the public key
        let encryptedSymmetricKeyAndVI = publicKey.encrypt(JSON.stringify({symmetricKey, VI}))


        // Encrypt the message with the symmetric key
        const data = JSON.stringify({message:message, signature: signature, sender: convertPublicKeyObjectToHex(personal_key_pair.publicKey)});
        let encryptedMessage = AES_encrypt(data, symmetricKey, VI);

        return { encryptedMessage:encryptedMessage, encryptedSymmetricKeyAndVI: forge.util.bytesToHex(encryptedSymmetricKeyAndVI) };

}


const decryptPGP = (encryptedMessage:string, encryptedSymmetricKeyAndVI:string, personalPrivateKey:string) => {

    // Convert the private key to object
    let personal_private_key = convertPrivateKeyHexToObject(personalPrivateKey);

    // Decrypt the symmetric key with the private key
    let { symmetricKey, VI } = JSON.parse( personal_private_key.decrypt(
                                    forge.util.hexToBytes(encryptedSymmetricKeyAndVI))
                                );

    // Decrypt the message with the symmetric key and IV
    let decryptedMessage = JSON.parse(AES_decrypt(encryptedMessage, symmetricKey, VI));

    // Verify the signature with the public key of the sender
    // Hash the decrypted message
    let md = forge.md.sha1.create();
    md.update(decryptedMessage.message, 'utf8');
    // Verify the signature with the public key of the sender
    let senderPublicKey = convertPublicKeyHexToObject(decryptedMessage.sender);
    let verified = senderPublicKey.verify(md.digest().bytes(), decryptedMessage.signature);
    // If the signature is verified, the message is authentic

    return { decryptedMessage, verified };
    
}


// const keyPair = generateKeyPairHex();

// const testKeyPair = generateKeyPairHex();

// const text = "The quick brown fox jumps over the lazy dog";

// const { encryptedMessage, encryptedSymmetricKeyAndVI } = encryptPGP(text, testKeyPair.publicKey, keyPair);

// const  { decryptedMessage, verified } = decryptPGP(encryptedMessage, encryptedSymmetricKeyAndVI, testKeyPair.privateKey);

// console.log("Decrypted message:", decryptedMessage.message);
// // console.log("Verified:", verified);


const createBlock = (type:string, previousHash:string, version:number, symmetric_key:string , personal_key_pair:KeyPair, username:string) => {

    if(type === "memberAddition") {
        const { privateKey } = convertKeyPairHexToObject(personal_key_pair);

        const IV = generateSymmetricKey();

        let data = {
            type:type,
            username:username,
            publicKey: personal_key_pair.publicKey,
            previousHash:previousHash
        }

        let data_str:string = JSON.stringify(data);

        // Sign the data
        let md = forge.md.sha1.create();
        md.update(data_str, 'utf8');
        let signature = privateKey.sign(md);
        //  signature to hex
        signature = forge.util.bytesToHex(signature);

        data_str = JSON.stringify({data:data, signature:signature});

        // Encrypt the data with the symmetric key
        data_str = AES_encrypt(data_str, symmetric_key, IV);
        
        

        const block: EncryptedBlock = {
            version: version,
            IV:IV,
            data: data_str
        } 
        
        return block;

    }else{
        return null;
    }
}


const decryptAndVerifyBlock = (
    block: EncryptedBlock,
    symmetric_key: string) => {

    //  Block structure
    // {
    //     version: "0",
    //     IV: "0",
    //     data: {  // Encrypted data
    //         data: {
    //             type: "memberAddition",
    //             username: "test_username",
    //             publicKey: "0",
    //             previousHash: "0"
    //         },
    //         signature: "0"
    //     }
    // }

    // Decrypt the data with the symmetric key

    let data = JSON.parse( AES_decrypt(block.data, symmetric_key, block.IV));

    let signature = data.signature;
    signature = forge.util.hexToBytes(signature);

    console.log("Decrypted block:", data, data.data);

    let unencryptedBlock = data.data;
    
    // Verify the signature with the public key of the sender
    let senderPublicKey = convertPublicKeyHexToObject(unencryptedBlock.publicKey);
    let md = forge.md.sha1.create();
    md.update(JSON.stringify(unencryptedBlock), 'utf8');
    let verified = senderPublicKey.verify(md.digest().bytes(), signature);

    signature = forge.util.bytesToHex(signature);
    return { data:unencryptedBlock, verified, signature };
}

const hashBlock = (unencryptedBlock:DecryptedBlock) => {
    // Hash the block SHA256
    let md = forge.md.sha256.create();
    md.update(JSON.stringify(unencryptedBlock), 'utf8');
    return md.digest().toHex();
}


// // Test the block creation

// const keyPair = generateKeyPairHex();

// const symmetric_key = generateSymmetricKey();

// const previousHash = "0000000000000000000000000000000000000000000000000000000000000000";

// const version = "1";

// const block = createBlock("memberAddition", previousHash, version, symmetric_key, keyPair, "test_username");

// console.log(block);

// const decryptedBlock = decryptAndVerifyBlock(block, symmetric_key);

// console.log(decryptedBlock);


// // Test the block chain

// let blockChain = [];

// blockChain.push(block)

// // hash decrypted block
// let previousBlockHash = hashBlock(decryptedBlock);
// console.log(previousBlockHash);

// // Create a new block
// const block2 = createBlock("memberAddition", previousBlockHash , version, symmetric_key, keyPair, "test_username2");
// blockChain.push(block2);

// const decryptedBlock2 = decryptAndVerifyBlock(block2, symmetric_key);

// // hash decrypted block
// previousBlockHash = hashBlock(decryptedBlock2);
// console.log(previousBlockHash);

// // new key pairs
// const keyPair2 = generateKeyPairHex();
// // Create a new block
// const block3 = createBlock("memberAddition", previousBlockHash , version, symmetric_key, keyPair2, "test_username3");

// blockChain.push(block3);


// console.log(blockChain);


// Decrypt Blockchain
const decryptBlockChain = (blockChain: EncryptedBlock[], symmetric_key:string): DecryptedBlock[] => {
    let decryptedBlockChain = [];
    for (let i = 0; i < blockChain.length; i++) {
        const block = blockChain[i];
        const decryptedBlock = decryptAndVerifyBlock(block, symmetric_key);
        decryptedBlockChain.push(decryptedBlock);
    }
    return decryptedBlockChain;
}

// verify the block chain
const verifyBlockChain = (blockChain:EncryptedBlock[], symmetric_key:string) => {
    // Initialize with the zero hash
    let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
    for (let i = 0; i < blockChain.length; i++) {
        const block = blockChain[i];
        const decryptedBlock = decryptAndVerifyBlock(block, symmetric_key);

        console.log(`Block (${i})`  , decryptedBlock);

        // Verify signature of Block for Authenticity

        console.log(`Previous hash: ${decryptedBlock.data.previousHash} == ${previousHash}`);
        if(decryptedBlock.data.previousHash !== previousHash){
            return false;
        }
        const hash = hashBlock(decryptedBlock);
        previousHash = hash;
    }
    return true;
};

export { 
        generateSymmetricKey, 
        AES_encrypt, 
        AES_decrypt, 
        AES_encrypt_file,
        AES_decrypt_file,
        hash, generateKeyPairHex, 
        convertPublicKeyObjectToHex, 
        convertPrivateKeyObjectToHex, 
        convertPublicKeyHexToObject, 
        convertPrivateKeyHexToObject, 
        convertKeyPairHexToObject, 
        encryptPGP, 
        decryptPGP,
        createBlock,
        decryptAndVerifyBlock,
        hashBlock,
        decryptBlockChain,
        verifyBlockChain,
    };