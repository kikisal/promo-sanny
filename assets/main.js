((m) => {

	const chooseFileLabel = document.querySelector("#choose-file-label");
	const chooseFile = document.querySelector("#choose-file");
	const fileInput = document.querySelector("#screenshot");
	const previewContainer = document.getElementById("previewContainer");
	const screenshotPreview = document.getElementById("screenshotPreview");

	function removeImage() {
		fileInput.value = "";
		previewContainer.style.display = "none";
		screenshotPreview.src = "";
		chooseFileLabel.innerText = "No files chosen";
	}

	function createAutoForm(formElement, endpoint) {
		return {};
	}

	document.querySelector('.arrow-wrapper').addEventListener('click', function () {
		const targetId = this.getAttribute('data-target');
		const targetElement = document.getElementById(targetId);
		if (targetElement) {
			targetElement.scrollIntoView({ behavior: 'smooth' });
			// Focus after scrolling for accessibility
			targetElement.focus({ preventScroll: true });
		}
	});

	chooseFile.addEventListener("click", (e) => {
		e.preventDefault();
		fileInput.click();
	});

	function getFileNameFromPath(path) {
		const normalizedPath = path.replace(/\\/g, '/');
		return normalizedPath.substring(normalizedPath.lastIndexOf('/') + 1);
	}

	fileInput.addEventListener("change", function () {
		const file = this.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = function (e) {
				screenshotPreview.src = e.target.result;
				previewContainer.style.display = "block";
				chooseFileLabel.innerText = getFileNameFromPath(fileInput.value); 
			};
			reader.readAsDataURL(file);
		} else {
			showModernPopup("Errore", "Puoi solo caricare immagini.", "error");
			removeImage();
		}
	});

	document.getElementById("giveawayForm").addEventListener("submit", async function (e) {
		e.preventDefault();

		if (!fileInput.value || fileInput.value == "") {
			showModernPopup("Errore", "Prima di proseguire, caricare una ricevuta!", "error");

			return false;
		}

		const formData = new FormData(this);
		const submitBtn = document.querySelector('.submit-btn');
		
		// Disable submit button and show loading state
		submitBtn.disabled = true;
		submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Invio in corso...';
		
		try {
			const response = await fetch('https://djsannyjofficial.it/api/promo-apply', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				showModernPopup("Successo!", "Modulo inviato! Grazie per la partecipazione.", "success");
				this.reset();
				removeImage();
				window.scrollTo({behavior: "smooth", left: 0, top: 0});
			} else {
				showModernPopup("Errore", result.message, "error");
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			showModernPopup("Errore di Connessione", "Errore di connessione. Riprova più tardi.", "error");
		} finally {
			// Re-enable submit button
			submitBtn.disabled = false;
			submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Invia';
		}
	});

	function showModernPopup(title, message, type = 'success') {
		const popup = document.getElementById('modernPopup');
		const popupTitle = document.getElementById('popupTitle');
		const popupMessage = document.getElementById('popupMessage');
		const popupIcon = document.getElementById('popupIcon');
		const popupIconSymbol = document.getElementById('popupIconSymbol');
		
		popupTitle.textContent = title;
		popupMessage.textContent = message;
		
		// Reset classes
		popupIcon.classList.remove('success', 'error');
		
		if (type === 'success') {
			popupIcon.classList.add('success');
			popupIconSymbol.className = 'fa-solid fa-check';
		} else if (type === 'error') {
			popupIcon.classList.add('error');
			popupIconSymbol.className = 'fa-solid fa-exclamation-triangle';
		}
		
		popup.classList.add('show');
	}
	
	function closeModernPopup() {
		const popup = document.getElementById('modernPopup');
		popup.classList.remove('show');
	}
	
	// Close popup when clicking outside
	document.getElementById('modernPopup').addEventListener('click', function(e) {
		if (e.target === this) {
			closeModernPopup();
		}
	});

	m.removeImage = removeImage;
	m.showModernPopup = showModernPopup;
	m.closeModernPopup = closeModernPopup;
})(window);