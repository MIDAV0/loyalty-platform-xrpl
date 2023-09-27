export function stringToHex(inputString: string) {
    let hex = '';
    for (let i = 0; i < inputString.length; i++) {
        hex += inputString.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex.toUpperCase();
}