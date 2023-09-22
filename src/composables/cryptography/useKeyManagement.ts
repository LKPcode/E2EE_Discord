import { generateKeyPairHex } from './ciphers.js'


export default function useKeyManagement(){

    const generateKeyPair =  () => {
        const keyPair = generateKeyPairHex()
        return keyPair
    }

    const generateSymmetricKey =  () => {
        const symmetricKey = ""

        return symmetricKey
    }

    return {
        generateKeyPair,
        generateSymmetricKey
    }
}