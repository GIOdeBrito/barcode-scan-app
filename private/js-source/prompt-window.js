
function promptConfirm (text, value)
{
	let background = document.querySelector('div.modal-background');
	background.classList.remove('closed');

	let dialog = background.querySelector('dialog');
	dialog.setAttribute('open', 'true');

	dialog.onclick = (ev) => {

		ev.stopPropagation();
	};

	background.onclick = () => {

		dialog.removeAttribute('open');
		background.classList.add('closed');
	};

	dialog.querySelector('p').innerText = text;

	dialog.querySelector('button[name="yes"]').onclick = () => {

		window.funcPromptOptionYes(value);
	};

	dialog.querySelector('button[name="no"]').onclick = () => {

		window.funcPromptOptionNo();
		background.click()
	};
}

export {
	promptConfirm
};
