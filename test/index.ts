import { test } from 'tapzero'
import { verify } from '@ssc-hermes/util'
// import { verify } from ''

test('example', async t => {
    t.ok('ok', 'should be an example')
})

// root DID
const did = 'did:key:z13V3Sog2YaUKhdGCmgx9UZuW1o1ShFJYc6DvGYe7NTt689NoL2htQdMxpcGJ3C7aZxdwvAzVjiib8MGB5R4vVFYtQJe1k5YfgxHnhAy2AxtG9CCfDMioGExvWNQREeBt6kwZweRCm4D2c6UmAvosCpf48EcdVATJKdQiwW1Swp9Vo5rkbPCTYWHvSpwgw8N9WntcfrPNRF7xDvGFmQ1ZiZkvZw1E4sVUMvhoaLbnHoRSB8NLrdW1mXjkVCyeA3a72x76sXhXtvbQ63noGth8Rke8tGCfXs9Skha81F9UFZz3gmJZTrgFTfCJrcMF2b6AsHZtWgLGnsXcB3hj7pxRy8APSCeq4AYfzCexkrkVdctmfQkrMSDd5WmGEeF8KKzkoNaHZhcgHd8VcYFXnuoKe8'
// sig 'my message'
const sig = 'X8iGF4Lz4erw4UEjGEzjFBPapAj23hH2xZs46RCSk7m6VdI_OJcFHqnboMC9D9Gab3ywqKyKlVUZhLM9M7DC5Ep3FKvM68tXQxvAFNhJGZ91e9_pTxCUs3St1l6vGfMrMNUTzLfn72iClVzXcj5XjaYFzkbvO_l5HhvDUfho5ndVoHhyAVwml-YWG4JUTzeK-HPKCb6jeedjMlEIb5CeM2xMvjwdjs78s3kDVAiV7kMbtKSKDyvAmMfugQ1YlqbOIJmTKOgQOK-0-XtShDxd6j7GtSBkcwFauhjA4Gtd0emVGm6rK9sMT0yDPamFYCi4krt4HtzCxOnryoZTAMYTZg'

test('verify a signature', async t => {
    const valid = await verify(did, sig, 'my message')
    t.ok(valid, 'should verify a valid signature + DID')
})
