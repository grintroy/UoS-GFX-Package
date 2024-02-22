const DETECTION_THRESHOLD = -50; // in dBFS
const LOOP_INTERVAL = 200; // in ms
const PITCH_LOW = 1000; // in Hz
const PITCH_HIGH = 3000; // in Hz
const CLARITY_THRESHOLD = 0.8;

const PITCH_REFERENCE = 1400; // in Hz

const PitchDetector = Pitchy.PitchDetector;
const audioContext = new window.AudioContext();

const pitchBuffers = [[], [], []];
let selectedPlayer = 1;

let pageUpdates = true;

function updateUIPitch() {
	if (selectedPlayer > 3) return;
	const pitchElement = document.querySelector(
		`.player-meter.player-${selectedPlayer} .meter-value`
	);
	const pitchBuffer = pitchBuffers[selectedPlayer - 1];
	if (pitchBuffer.length === 0) {
		pitchElement.textContent = "---";
		return;
	}
	const pitchMean =
		pitchBuffer.reduce((a, b) => a + b, 0) / pitchBuffer.length;
	const pitchDiff = Math.round(pitchMean - PITCH_REFERENCE);
	const pitchDiffStr = `${pitchDiff >= 0 ? "+" : ""}${pitchDiff}`;

	pitchElement.textContent = pitchDiffStr;
}

function updateUIHighlight() {
	if (selectedPlayer > 3) {
		const finalPitches = [];
		for (const meter of document.querySelectorAll(".player-meter")) {
			const value = meter.querySelector(".meter-value").textContent;
			finalPitches.push(value !== "---" ? parseInt(value) : 10000);
		}
		const absPitches = finalPitches.map((pitch) => Math.abs(pitch));
		const minAbsPitch = Math.min(...absPitches);
		const minIndices = [];
		for (let i = 0; i < 3; i++) {
			if (Math.abs(finalPitches[i]) === minAbsPitch) {
				minIndices.push(i);
			}
		}
		const winnerElements = [];
		for (const index of minIndices) {
			winnerElements.push(
				document.querySelector(`.player-card.player-${index + 1}`)
			);
		}

		document.querySelectorAll(".player-card").forEach((card) => {
			if (winnerElements.includes(card)) {
				card.style.color = "green";
			}
			card.style.opacity = 1;
		});
		pageUpdates = false;
		return;
	}
	document.querySelectorAll(".player-card").forEach((card) => {
		if (card.classList.contains(`player-${selectedPlayer}`)) {
			card.style.opacity = 1;
		} else {
			card.style.opacity = 0.3;
		}
	});
}

function updateUI() {
	updateUIHighlight();
	updateUIPitch();
}

function writePitch(pitch, clarity) {
	if (selectedPlayer > 3) return;
	if (pitch < PITCH_LOW || pitch > PITCH_HIGH) return;
	if (clarity < CLARITY_THRESHOLD) return;
	pitchBuffers[selectedPlayer - 1].push(pitch);
}

function updatePitch(analyserNode, detector, input, sampleRate) {
	if (!pageUpdates) return;

	analyserNode.getFloatTimeDomainData(input);
	const [pitch, clarity] = detector.findPitch(input, sampleRate);

	console.log(`Pitch: ${pitch} Hz, Clarity: ${clarity}`);

	writePitch(pitch, clarity);
	updateUI();

	window.setTimeout(
		() => updatePitch(analyserNode, detector, input, sampleRate),
		LOOP_INTERVAL
	);
}

function startAnalyser() {
	const analyserNode = audioContext.createAnalyser();
	navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
		audioContext.createMediaStreamSource(stream).connect(analyserNode);
		const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
		detector.minVolumeDecibels = DETECTION_THRESHOLD;
		const input = new Float32Array(detector.inputLength);
		updatePitch(analyserNode, detector, input, audioContext.sampleRate);
	});
}

webcg.on("data", (data) => {});

webcg.on("play", () => {
	audioContext.resume();
	startAnalyser();
	document.querySelector(".overlay").style.opacity = 1;
});

webcg.on("stop", () => {
	document.querySelector(".overlay").style.opacity = 0;
});

webcg.on("next", () => {
	selectedPlayer++;
});
