/**
 * Encodes a UTF-8 string to a Base64 string, suitable for URLs.
 * This is a robust way to handle Unicode characters.
 * @param str The string to encode.
 * @returns The Base64 encoded string.
 */
export function b64EncodeUnicode(str: string): string {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        (match, p1) => String.fromCharCode(parseInt(p1, 16))
    ));
}

/**
 * Decodes a Base64 string (that was encoded from UTF-8) back to a string.
 * @param str The Base64 string to decode.
 * @returns The decoded UTF-8 string.
 */
export function b64DecodeUnicode(str: string): string {
    return decodeURIComponent(atob(str).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
