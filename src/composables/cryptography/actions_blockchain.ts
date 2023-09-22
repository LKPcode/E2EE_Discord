import { EncryptedBlock, DecryptedBlock, KeyPair, MemberItem } from "../../types"
import { generateSymmetricKey,generateKeyPairHex,convertPublicKeyHexToObject, AES_encrypt, AES_decrypt, convertKeyPairHexToObject } from "./ciphers"
import forge from "node-forge"

export default class BlockChain {

    encryptedChain: EncryptedBlock[]
    decryptedChain: DecryptedBlock[]
    symmetric_keys: string[]
    verified: boolean = false

    constructor (encryptedChain: EncryptedBlock[], symmetric_keys:string[]) {
        this.symmetric_keys = symmetric_keys
        this.encryptedChain = encryptedChain
        this.decryptedChain = this.decryptBlockChain()
        this.verified = this.verifyBlockChain()
    }
    
    loadBlockChain = (encryptedChain: EncryptedBlock[], symmetric_keys:string[]) => {
        this.symmetric_keys = symmetric_keys
        this.encryptedChain = encryptedChain
        this.decryptedChain = this.decryptBlockChain()
        this.verified = this.verifyBlockChain()

    }

    getLastBlockHash = () => {
        if(this.decryptedChain.length == 0){
            return "0000000000000000000000000000000000000000000000000000000000000000";
        }
        return this.hashBlock(this.decryptedChain[this.decryptedChain.length - 1])
    }

    createBlock = (type:string, version:number, personal_key_pair:KeyPair, payload:string) => {
        
        let previousHash = this.getLastBlockHash()

        if(type === "memberAddition" || type === "channelAddition") {
            const { privateKey } = convertKeyPairHexToObject(personal_key_pair);

            const IV = generateSymmetricKey();

            let data: DecryptedBlock["data"] = {
                type:type,
                payload:payload,
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

            let block_to_encrypt: DecryptedBlock = {data:data, signature:signature}
            data_str = JSON.stringify(block_to_encrypt);

            console.log("data_str:", data_str, this.symmetric_keys , IV);

            // Encrypt the data with the symmetric key
            data_str = AES_encrypt(data_str, this.symmetric_keys[0] , IV);
            
            
            const block: EncryptedBlock = {
                version: version,
                IV:IV,
                data: data_str
            } 
            
            // Push block to encrypted Chian and decrypted chain 
            // also update verified value
            this.addBlock(block);

            return block;

        }else{
            console.log("Error: Block type not supported");
            throw new Error("Block type not supported");
            return null;
        }
    }

    addBlock = (block: EncryptedBlock) => {
        this.encryptedChain.push(block);
        let decrypted_block = this.decryptAndVerifyBlock(block, this.symmetric_keys[0]);
        this.decryptedChain.push(decrypted_block)
        this.verified = decrypted_block.verified;
    }

    decryptAndVerifyBlock = (
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
        console.log("AES:", AES_decrypt(block.data, symmetric_key, block.IV));

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

    hashBlock = (unencryptedBlock:DecryptedBlock) => {
        // Hash the block SHA256
        let md = forge.md.sha256.create();
        md.update(JSON.stringify(unencryptedBlock), 'utf8');
        return md.digest().toHex();
    }

    // Decrypt Blockchain
    decryptBlockChain = (): DecryptedBlock[] => {
        let decryptedBlockChain = [];
        for (let i = 0; i < this.encryptedChain.length; i++) {
            const block = this.encryptedChain[i];
            const decryptedBlock = this.decryptAndVerifyBlock(block, this.symmetric_keys[0]);
            decryptedBlockChain.push(decryptedBlock);
        }
        return decryptedBlockChain;
    }

    // verify the block chain
    verifyBlockChain = () => {
        // Initialize with the zero hash
        let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
        for (let i = 0; i < this.decryptedChain.length; i++) {

            const decryptedBlock = this.decryptedChain[i];

            console.log(`Block (${i})`  , decryptedBlock);

            // Verify signature of Block for Authenticity !!!

            console.log(`Previous hash: ${decryptedBlock.data.previousHash} == ${previousHash}`);
            if(decryptedBlock.data.previousHash !== previousHash){
                return false;
            }
            const hash = this.hashBlock(decryptedBlock);
            previousHash = hash;
        }
        return true;
    }

    // Get First block of chain to get the Moderator's public key
    getModeratorPublicKey = () => {
        if (this.decryptedChain.length === 0) {
            throw new Error("Block chain is empty");
        }
        if(this.decryptedChain[0].data.type !== "memberAddition" 
            && this.decryptedChain[0].data.previousHash !== "0000000000000000000000000000000000000000000000000000000000000000"){
                throw new Error("First block is not a member addition or is not the genesis block");
        }
        return this.decryptedChain[0].data.publicKey;
    }

}


// console.log("Test Block Chain");

// // Test the block creation
// const keyPair = generateKeyPairHex();

// const symmetric_key = generateSymmetricKey();

// const version = 0;

// let chain = new BlockChain([],[symmetric_key]);

// const block0: EncryptedBlock|null = chain.createBlock("memberAddition", version, keyPair, "test_username0");
// // chain.addBlock(block0!);

// const block1: EncryptedBlock|null = chain.createBlock("memberAddition", version, keyPair, "test_username1");
// // chain.addBlock(block1!);

// // console.log([block0, block1]);




// console.log("Encrypted Chain",chain.encryptedChain);

// console.log("Decrypted Chain",chain.decryptedChain);

// console.log("Verified Chain",chain.verifyBlockChain());

  


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
