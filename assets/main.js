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
			removeImage();
		}
	});

	document.getElementById("giveawayForm").addEventListener("submit", async function (e) {
		e.preventDefault();

		const formData = new FormData(this);
		const submitBtn = document.querySelector('.submit-btn');
		
		// Disable submit button and show loading state
		submitBtn.disabled = true;
		submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Invio in corso...';
		
		try {
			const response = await fetch('http://localhost:3001/api/promo-apply', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				alert("Modulo inviato! Grazie per la partecipazione.");
				this.reset();
				removeImage();
			} else {
				alert("Errore: " + result.message);
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			alert("Errore di connessione. Riprova più tardi.");
		} finally {
			// Re-enable submit button
			submitBtn.disabled = false;
			submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Invia';
		}
	});

	m.removeImage = removeImage;
})(window);