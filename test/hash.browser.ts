import { test } from 'tapzero'
import { getHash } from '../dist/hash.js'

test('hash', async t => {
    const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
    const file = dataURItoFile(base64, 'test.png')
    const hash = await getHash(file)
    t.equal(typeof hash, 'string', 'should create a hash that is a string')
    t.equal(hash, 'o-6gAwtho4sZpSxWl_5yS_6Bk-zPYdxbDJ2WlWRdopo',
        'should return the expected hash')
})

function dataURItoFile (dataurl, filename) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
}
