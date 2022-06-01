function CommonFiles() {
}

CommonFiles.prototype.base64ToArrayBuffer = function (base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
};

CommonFiles.prototype.saveByteArray = function (reportName, byte, mimeType, extension) {
    var blob = new Blob([byte], { type: mimeType });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE            
        window.navigator.msSaveOrOpenBlob(blob, reportName + "." + extension);
    } else {
        // for Non-IE (chrome, firefox etc.)
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = reportName;
        link.download = fileName;
        link.click();
    }
};


CommonFiles.prototype.arrayBufferToBase64 = function (buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}