
export default class {

	#formats = [];

	constructor (type)
	{
		this.getReaders(type);
	}

	async initAsync ()
	{
		const codeReader = new ZXing.BrowserMultiFormatReader();
	    const videoElement = document.getElementById('video-output');

		let stream = null;

	    try
	    {
	        // Request camera access
	        stream = await navigator.mediaDevices.getUserMedia({
	            video: { facingMode: 'environment' }
	        });

	        videoElement.srcObject = stream;

	        codeReader.decodeFromVideoDevice(null, 'video-output', (result, error) => {

	            if(result)
	            {
					if(this.#formats.includes(result.getBarcodeFormat()))
	                {
	                    console.log('Found code:', result.text);
						window.funcOnCodeFound(result.text);
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

	getReaders (type)
	{
		switch(type)
	    {
	        case 'code39':
				this.#formats = [
		            ZXing.BarcodeFormat.CODE_39
		        ];
				break;
	        case 'ean':
				this.#formats = [
		            ZXing.BarcodeFormat.EAN_13,
		            ZXing.BarcodeFormat.EAN_8
		        ];
				break;
	        default:
				this.#formats = [];
				break;
	    }
	}
};

