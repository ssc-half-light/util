# util

Utility functions

Depends on `uint8arrays` and `@oddjs/odd`.

## install

```bash
npm i @ssc-hermes/util
```

## API

### verify
```ts
async (did:string, sig:string, msg:string):Promise<boolean>
```

### sign
```ts
(keystore:KeyStore, msg:string):Promise<Uint8Array>
```

### toString
Return `'base64url'` string. Good for getting a string version of a signature.

```ts
(arr:Uint8Array):string
```

### didToPublicKey
Convert a DID string to a `Uint8Array` and `type` string.

```ts
(did:string):({ publicKey:Uint8Array, type:string })
```

## example

### Sign a message
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

### Verify a signature

```ts
import { verify } from '@ssc-hermes/util'

const DID = 'did:key:z13V3Sog2YaUKhdGCmgx9UZuW1o1ShFJYc6DvGYe7NTt689NoL2htQdMxpcGJ3C7aZxdwvAzVjiib8MGB5R4vVFYtQJe1k5YfgxHnhAy2AxtG9CCfDMioGExvWNQREeBt6kwZweRCm4D2c6UmAvosCpf48EcdVATJKdQiwW1Swp9Vo5rkbPCTYWHvSpwgw8N9WntcfrPNRF7xDvGFmQ1ZiZkvZw1E4sVUMvhoaLbnHoRSB8NLrdW1mXjkVCyeA3a72x76sXhXtvbQ63noGth8Rke8tGCfXs9Skha81F9UFZz3gmJZTrgFTfCJrcMF2b6AsHZtWgLGnsXcB3hj7pxRy8APSCeq4AYfzCexkrkVdctmfQkrMSDd5WmGEeF8KKzkoNaHZhcgHd8VcYFXnuoKe8'
const sig =
'X8iGF4Lz4erw4UEjGEzjFBPapAj23hH2xZs46RCSk7m6VdI_OJcFHqnboMC9D9Gab3ywqKyKlVUZhLM9M7DC5Ep3FKvM68tXQxvAFNhJGZ91e9_pTxCUs3St1l6vGfMrMNUTzLfn72iClVzXcj5XjaYFzkbvO_l5HhvDUfho5ndVoHhyAVwml-YWG4JUTzeK-HPKCb6jeedjMlEIb5CeM2xMvjwdjs78s3kDVAiV7kMbtKSKDyvAmMfugQ1YlqbOIJmTKOgQOK-0-XtShDxd6j7GtSBkcwFauhjA4Gtd0emVGm6rK9sMT0yDPamFYCi4krt4HtzCxOnryoZTAMYTZg'

const isValid = verify(DID, sig, 'my message')
```
