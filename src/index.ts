import * as uint8arrays from 'uint8arrays'
import * as BrowserCrypto from '@oddjs/odd/components/crypto/implementation/browser'
// import { publicKeyToDid } from '@oddjs/odd/did/transformers'
import type { Crypto } from '@oddjs/odd'
import { Implementation } from '@oddjs/odd/components/crypto/implementation'
type KeyStore = Implementation['keystore']

const KEY_TYPE = {
    RSA: 'rsa',
    Edwards: 'ed25519',
    BLS: 'bls12-381'
} as const

const EDWARDS_DID_PREFIX = new Uint8Array([0xed, 0x01])
const BLS_DID_PREFIX = new Uint8Array([0xea, 0x01])
const RSA_DID_PREFIX = new Uint8Array([0x00, 0xf5, 0x02])
const BASE58_DID_PREFIX = 'did:key:z'

export function sign (keystore:KeyStore, msg:string) {
    return keystore.sign(uint8arrays.fromString(msg))
}

export function toString (arr:Uint8Array) {
    return uint8arrays.toString(arr, 'base64url')
}

export const verify = async (did:string, sig:string, msg:string) => {
    const { publicKey, type } = didToPublicKey(did)
    const keyType = BrowserCrypto.did.keyTypes[type]

    const res = await keyType.verify({
        message: uint8arrays.fromString(msg),
        publicKey,
        signature: uint8arrays.fromString(sig, 'base64url')
    })

    return res
}

export function didToPublicKey (did:string): ({
    publicKey:Uint8Array,
    type:'rsa' | 'ed25519' | 'bls12-381'
}) {
    if (!did.startsWith(BASE58_DID_PREFIX)) {
        throw new Error(
            'Please use a base58-encoded DID formatted `did:key:z...`')
    }

    const didWithoutPrefix = ('' + did.substr(BASE58_DID_PREFIX.length))
    const magicalBuf = uint8arrays.fromString(didWithoutPrefix, 'base58btc')
    const { keyBuffer, type } = parseMagicBytes(magicalBuf)

    return {
        publicKey: keyBuffer,
        type
    }
}

export function publicKeyToDid (
    crypto: Crypto.Implementation,
    publicKey: Uint8Array,
    keyType: string
): string {
    // Prefix public-write key
    const prefix = crypto.did.keyTypes[keyType]?.magicBytes
    if (prefix === null) {
        throw new Error(`Key type '${keyType}' not supported, ` +
            `available types: ${Object.keys(crypto.did.keyTypes).join(', ')}`)
    }

    const prefixedBuf = uint8arrays.concat([prefix, publicKey])

    // Encode prefixed
    return BASE58_DID_PREFIX + uint8arrays.toString(prefixedBuf, 'base58btc')
}

export async function writeKeyToDid (crypto: Crypto.Implementation)
:Promise<string> {
    const [pubKey, ksAlg] = await Promise.all([
        crypto.keystore.publicWriteKey(),
        crypto.keystore.getAlgorithm()
    ])
    return publicKeyToDid(crypto, pubKey, ksAlg)
}

/**
 * Parse magic bytes on prefixed key-buffer
 * to determine cryptosystem & the unprefixed key-buffer.
 */
function parseMagicBytes (prefixedKey) {
    // RSA
    if (hasPrefix(prefixedKey, RSA_DID_PREFIX)) {
        return {
            keyBuffer: prefixedKey.slice(RSA_DID_PREFIX.byteLength),
            type: KEY_TYPE.RSA
        }
    // EDWARDS
    } else if (hasPrefix(prefixedKey, EDWARDS_DID_PREFIX)) {
        return {
            keyBuffer: prefixedKey.slice(EDWARDS_DID_PREFIX.byteLength),
            type: KEY_TYPE.Edwards
        }
    // BLS
    } else if (hasPrefix(prefixedKey, BLS_DID_PREFIX)) {
        return {
            keyBuffer: prefixedKey.slice(BLS_DID_PREFIX.byteLength),
            type: KEY_TYPE.BLS
        }
    }

    throw new Error('Unsupported key algorithm. Try using RSA.')
}

const arrBufs = {
    equal: (aBuf, bBuf) => {
        const a = new Uint8Array(aBuf)
        const b = new Uint8Array(bBuf)
        if (a.length !== b.length) return false
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false
        }
        return true
    }
}

function hasPrefix (prefixedKey, prefix) {
    return arrBufs.equal(prefix, prefixedKey.slice(0, prefix.byteLength))
}

export function blobFromFile (file:File):Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onloadend = () => {
            if (!reader.result) return reject(new Error('no content'))
            resolve(reader.result as Uint8Array)
        }

        reader.onerror = () => {
            return reject(reader.error)
        }

        reader.readAsArrayBuffer(file)
    })
}
