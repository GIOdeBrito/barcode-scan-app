
window.addEventListener('load', () =>
{
    if(typeof ZXing === 'undefined')
    {
        alert('ZXing library failed to load, the scanner will not operate.');
        return;
    }

    console.log(ZXing.BarcodeFormat.CODE_39);

    initReader();
});

var SCAN_RESULT = 0;

// Get params from the request url
function getScanReaders ()
{
    let search = window.location.search;

    const urlParams = new URLSearchParams(search);

    // Scan type. Code-39, EAN, etc.
	const type = (urlParams.get('scan') ?? 'ean').toLowerCase();

    window['code-type-paragraph'].innerText = type.toUpperCase();

    switch(type)
    {
        case 'code39': return [
            ZXing.BarcodeFormat.CODE_39
        ];
        case 'ean': return [
            ZXing.BarcodeFormat.EAN_13,
            ZXing.BarcodeFormat.EAN_8
        ];
        default: return [];
    }
}

async function initReader ()
{
    const codeReader = new ZXing.BrowserMultiFormatReader();
    let stream = null;

    const videoElement = document.getElementById('video-output');

    const formats = getScanReaders();

    try
    {
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });

        videoElement.srcObject = stream;

        // Start decoding from the video stream (Limit to Code39 only)
        codeReader.decodeFromVideoDevice(null, 'video-output', (result, error) =>
        {
            if(result)
            {
                if (formats.includes(result.getBarcodeFormat()))
                {
                    console.log('Found code:', result.text);
                    //alert(`Barcode found: ${result.text}`);
                    promptConfirm(`Confirma o código: ${result.text}?`);
                }
            }
            if(error && error.name !== 'NotFoundException')
            {
                console.error('Scanning error:', error);
                //alert(error);
            }
        });
    }
    catch(err)
    {
        console.error('Error accessing camera:', err);
        alert(err);
    }
}

function promptConfirm (text)
{
    let background = document.querySelector('div.modal-background');
    background.classList.remove('closed');

    let dialog = background.querySelector('dialog');
    dialog.setAttribute('open', 'true');

    dialog.onclick = (ev) =>
    {
        ev.stopPropagation();
    };

    background.onclick = () =>
    {
        dialog.removeAttribute('open');
        background.classList.add('closed');
    };

    dialog.querySelector('p').innerText = text;

    dialog.querySelector('button[name="yes"]').onclick = () =>
    {
        sendScanResultToParent();
    };

    dialog.querySelector('button[name="no"]').onclick = () => background.click();
}

function sendScanResultToParent ()
{
    const msg = {
        action: 'CODE',
        code: SCAN_RESULT
    };

    window.opener.postMessage(msg, '*');

    // Close self, if it was open'd by another javascript instance
    window.close();
}

