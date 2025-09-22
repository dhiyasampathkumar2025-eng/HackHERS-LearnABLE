document.addEventListener('DOMContentLoaded', function () {
	const speakBtn = document.getElementById('speak-text');
	const ttsTextarea = document.getElementById('tts-text');
	// Register service worker for offline support
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', function() {
			navigator.serviceWorker.register('service-worker.js')
				.then(function(reg) {
					// Registration successful
				})
				.catch(function(err) {
					console.warn('Service worker registration failed:', err);
				});
		});
	}

	// Speech-to-Text elements
	const startSpeechBtn = document.getElementById('start-speech');
	const speechTextarea = document.getElementById('speech-text');

	// Web Speech API Speech Recognition
	let recognition;
	if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = false;
		recognition.lang = 'en-US';

		startSpeechBtn.addEventListener('click', function () {
			speechTextarea.value = '';
			recognition.start();
			startSpeechBtn.disabled = true;
			startSpeechBtn.textContent = 'Listening...';
		});

		recognition.onresult = function(event) {
			const transcript = event.results[0][0].transcript;
			speechTextarea.value = transcript;
		};

		recognition.onerror = function(event) {
			alert('Speech recognition error: ' + event.error);
		};

		recognition.onend = function() {
			startSpeechBtn.disabled = false;
			startSpeechBtn.textContent = 'Start Listening';
		};
	} else {
		startSpeechBtn.disabled = true;
		speechTextarea.value = 'Speech recognition not supported in this browser.';
	}

	speakBtn.addEventListener('click', function () {
		const text = ttsTextarea.value.trim();
		if (text.length === 0) {
			alert('Please enter some text to speak!');
			return;
		}
		const utterance = new window.SpeechSynthesisUtterance(text);
		window.speechSynthesis.speak(utterance);
	});
});
