# util
![tests](https://github.com/ssc-half-light/util/actions/workflows/nodejs.yml/badge.svg)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@ssc-half-light/util)](https://socket.dev/npm/package/@ssc-half-light/util)
[![types](https://img.shields.io/npm/types/@ssc-half-light/util)](README.md)
[![module](https://img.shields.io/badge/module-ESM-blue)](README.md)
[![license](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

Utility functions

Depends on `uint8arrays` and `@oddjs/odd`.

## install

```bash
npm i @ssc-half-light/util
```

## API

### verify
Works in node or browsers.

```ts
async (did:string, sig:string, msg:string):Promise<boolean>
```

#### example &mdash; verify
```ts
import { verify } from '@ssc-hermes/util'

const DID = 'did:key:z13V3Sog2Ya...'
const sig = 'X8iGF4Lz4erw4UE...'

const isValid = await verify(DID, sig, 'my message')
```

### sign
```ts
(keystore:KeyStore, msg:string):Promise<Uint8Array>
```

#### example &mdash; sign
This depends on a `keystore` instance.

```ts
import { sign, toString } from '@ssc-hermes/util'
import * as odd from '@oddjs/odd'

const program = await odd.program({
    namespace: { creator: 'test', name: 'testing' },
    debug: true
})
const { keystore } = program.components.crypto
const sig = toString(await sign(keystore, 'my message'))
```


### toString
Return a `'base64url'` string. Good for getting a string version of a signature.

```ts
function toString (arr:Uint8Array):string
```

#### example &mdash; toString
```js
test('toString', t => {
    const myString = toString(myUint8Array)
    t.equal(typeof myString, 'string', 'should conver a Uint8Array to string')
})
```

### writeKeyT0Did
Convert a DID string to a `Uint8Array` and `type` string.

```ts
(did:string):({
    publicKey:Uint8Array,
    type: 'rsa' | 'ed25519' | 'bls12-381'
})
```

#### example &mdash; writeKeyToDid
Get the DID version of the key used to sign messages.

```js
test('writeKeyToDid', async t => {
    const crypto = program.components.crypto
    const did = await writeKeyToDid(crypto)
    t.equal(typeof did, 'string', 'should create a string')
    t.ok(did.includes('did:key:'), 'should return the right format string')
})
```

