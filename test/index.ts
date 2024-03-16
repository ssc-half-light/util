import { test } from '@nichoth/tapzero'
import * as odd from '@oddjs/odd'
import { components, createCryptoComponent } from '@ssc-hermes/node-components'
import {
    verify,
    writeKeyToDid,
    toString,
    sign,
    didToPublicKey
} from '../dist/index.js'

// root DID
const did = 'did:key:z13V3Sog2YaUKhdGCmgx9UZuW1o1ShFJYc6DvGYe7NTt689NoL2htQdMxpcGJ3C7aZxdwvAzVjiib8MGB5R4vVFYtQJe1k5YfgxHnhAy2AxtG9CCfDMioGExvWNQREeBt6kwZweRCm4D2c6UmAvosCpf48EcdVATJKdQiwW1Swp9Vo5rkbPCTYWHvSpwgw8N9WntcfrPNRF7xDvGFmQ1ZiZkvZw1E4sVUMvhoaLbnHoRSB8NLrdW1mXjkVCyeA3a72x76sXhXtvbQ63noGth8Rke8tGCfXs9Skha81F9UFZz3gmJZTrgFTfCJrcMF2b6AsHZtWgLGnsXcB3hj7pxRy8APSCeq4AYfzCexkrkVdctmfQkrMSDd5WmGEeF8KKzkoNaHZhcgHd8VcYFXnuoKe8'
// signature 'my message'
const sig = 'X8iGF4Lz4erw4UEjGEzjFBPapAj23hH2xZs46RCSk7m6VdI_OJcFHqnboMC9D9Gab3ywqKyKlVUZhLM9M7DC5Ep3FKvM68tXQxvAFNhJGZ91e9_pTxCUs3St1l6vGfMrMNUTzLfn72iClVzXcj5XjaYFzkbvO_l5HhvDUfho5ndVoHhyAVwml-YWG4JUTzeK-HPKCb6jeedjMlEIb5CeM2xMvjwdjs78s3kDVAiV7kMbtKSKDyvAmMfugQ1YlqbOIJmTKOgQOK-0-XtShDxd6j7GtSBkcwFauhjA4Gtd0emVGm6rK9sMT0yDPamFYCi4krt4HtzCxOnryoZTAMYTZg'

const cryptoComponent = await createCryptoComponent()

let program

test('setup', async t => {
    program = await odd.assemble({
        namespace: { creator: 'test', name: 'testing' },
        debug: false
    }, components)

    t.ok(program, 'create a program')
})

test('verify a signature', async t => {
    const valid = await verify(did, sig, 'my message')
    t.equal(valid, true, 'should verify a valid signature + DID')
})

test('verify a bad signature', async t => {
    const isValid = await verify(did, 'badSignature', 'my message')
    t.equal(isValid, false, 'should return false for a bad signature')

    try {
        await verify(did, 'bad signature', 'my message')
        t.fail('should throw an error with this signature')
    } catch (err) {
        t.ok(err.message.includes('Non-base64url character'),
            'should throw an error with badly formatted signature')
    }
})

let arrSig:Uint8Array
test('sign', async t => {
    console.log(Object.keys(program))
    arrSig = await sign(cryptoComponent.keystore, 'hello')
    t.ok(arrSig instanceof Uint8Array, 'should return a Uint8Array')
})

test('toString', t => {
    const myString = toString(arrSig)
    t.equal(typeof myString, 'string', 'should conver a Uint8Array to string')
})

test('writeKeyToDid', async t => {
    const crypto = program.components.crypto
    const did = await writeKeyToDid(crypto)
    console.log('**did**', did)
    t.equal(typeof did, 'string', 'should create string')
    t.ok(did.includes('did:key:'), 'should return the right format string')
})

test('didToPublicKey', t => {
    const did = 'did:key:z13V3Sog2YaUKhdGCmgx9UZuW1o1ShFJYc6DvGYe7NTt689NoL3d4K4nWAnkvpsYjc6cvvHJ2ae5UKju7b2AjpkquiL6ZTFbVAcBmxcfFUKFnhyqYobQ6S6CJpa5WotSWdANS26wcMiDjBU3PVq3EfBmVd1mUHFctDtBoU4tnenVgVZn7NLAxXELix4S9V9sfrmqhNtNe3fhqXYjJg635imLTnhH3swxStauB3AngmGYiNzSUv3aZCWxJkTyz53zfhgAfQTV7D59iv1jEdwYySFm7gVNYrXZXSCgcCPFzpCKbupHCNuQBBh2fbZCBViDigsCmR1r6r3obAvCHsauwonEtoTJPTBVRJ7Ghzw4nto7Rr3Jo7VGE5BLTyfF8G9pE2TV9sfDsz9cWA1gudc1hmz'
    const pubKey = didToPublicKey(did)
    t.ok(pubKey, 'should return')
    t.equal(pubKey.type, 'rsa', 'should return the right key type')
    t.ok(pubKey.publicKey instanceof Uint8Array,
        'should return the public key as a Uint8Array')
})
