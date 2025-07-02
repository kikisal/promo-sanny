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

	document.getElementById("giveawayForm").addEventListener("submit", function (e) {
		e.preventDefault();

		const formData = new FormData(this);

		console.log("Submitting...", Object.fromEntries(formData));

		alert("Modulo inviato! Grazie per la partecipazione.");
		this.reset();

		removeImage();
		
	});

	const autoForm = createAutoForm("giveawayForm", `${window.location.origin}/api/promo-apply`);

	m.removeImage = removeImage;
})(window);