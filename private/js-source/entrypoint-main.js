
import Scanner from "./scanner.js";
import { promptConfirm } from "./prompt-window.js";

window.addEventListener('load', () =>
{
    if(typeof ZXing === 'undefined')
    {
        alert('ZXing library failed to load, the scanner will not operate.');
        return;
    }

	window.parent.postMessage({
		action: 'SCAN_LOADED'
	}, '*');

	//console.log(ZXing.BarcodeFormat.CODE_39);

	setGlobalCallbacks();

	const scanType = getURLScannerOption();

	window['code-type-paragraph'].innerText = scanType.toUpperCase();

	const scanner = new Scanner(scanType);
	scanner.initAsync();
});

function setGlobalCallbacks ()
{
	window.funcOnCodeFound = (result) => {

		promptConfirm(`Confirm code: ${result}?`);
	};

	window.funcPromptOptionYes = (value) => {

		window.parent.postMessage({
			action: 'SCAN_RESULT',
			value: value
		}, '*');
	};

	window.funcPromptOptionNo = (value) => {

		console.log('Canceled');
	};
}

function getURLScannerOption ()
{
	const search = window.location.search;
    const urlParams = new URLSearchParams(search);

    // Scan type. Code-39, EAN, etc.
	// Default option is EAN
	const type = (urlParams.get('scan') ?? 'ean').toLowerCase().trim();

	return type;
}

