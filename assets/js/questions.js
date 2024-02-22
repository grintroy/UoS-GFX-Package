webcg.on("data", function (data) {
	document.querySelector("body").dataset.apiHost = data.f0
		? data.f0.text || data.f0
		: "http://localhost:8000";
});

let pollingInterval;
let pageShown = false;

function startPolling() {
	load_questions();
	pollingInterval = setInterval(load_questions, 500);
}

function stopPolling() {
	clearInterval(pollingInterval);
}

function showPage() {
	const overlay = document.querySelector(".overlay");
	overlay.style.opacity = 1;
}

let last_state = {
	question_showing: null
};
let round = null;

const questionPing = new Audio("assets/audio/question_ping.wav");
questionPing.volume = 0.2;

function updatePage(questions) {
	// Define elements
	const g1a_el = document.querySelector("#g-announce-1");
	const g2a_el = document.querySelector("#g-announce-2");
	const g3a_el = document.querySelector("#g-announce-3");
	const g1r1_el = document.querySelector(".g1-question-text.r-1");
	const g1r2_el = document.querySelector(".g1-question-text.r-2");
	const g1r3_el = document.querySelector(".g1-question-text.r-3");
	const g3r1_el = document.querySelector(".g3-question.r-1");
	const g3r2_el = document.querySelector(".g3-question.r-2");
	const g3r3_el = document.querySelector(".g3-question.r-3");
	const g3r1A_el = document.querySelector(".g3-question-text.r-1.q-a");
	const g3r1B_el = document.querySelector(".g3-question-text.r-1.q-b");
	const g3r1C_el = document.querySelector(".g3-question-text.r-1.q-c");
	const g3r2A_el = document.querySelector(".g3-question-text.r-2.q-a");
	const g3r2B_el = document.querySelector(".g3-question-text.r-2.q-b");
	const g3r2C_el = document.querySelector(".g3-question-text.r-2.q-c");
	const g3r3A_el = document.querySelector(".g3-question-text.r-3.q-a");
	const g3r3B_el = document.querySelector(".g3-question-text.r-3.q-b");
	const g3r3C_el = document.querySelector(".g3-question-text.r-3.q-c");

	// Hide all questions and announcement cards
	q_els = document.querySelectorAll(".q-el");
	q_els.forEach((el) => (el.hidden = true));
	g_announce_els = document.querySelectorAll(".g-announce");
	g_announce_els.forEach((el) => (el.hidden = true));

	// Update elements
	g1r1_el.innerHTML = questions.g1r1;
	g1r2_el.innerHTML = questions.g1r2;
	g1r3_el.innerHTML = questions.g1r3;
	g3r1A_el.innerHTML = questions.g3r1A;
	g3r1B_el.innerHTML = questions.g3r1B;
	g3r1C_el.innerHTML = questions.g3r1C;
	g3r2A_el.innerHTML = questions.g3r2A;
	g3r2B_el.innerHTML = questions.g3r2B;
	g3r2C_el.innerHTML = questions.g3r2C;
	g3r3A_el.innerHTML = questions.g3r3A;
	g3r3B_el.innerHTML = questions.g3r3B;
	g3r3C_el.innerHTML = questions.g3r3C;
	g_announce_els.forEach((el) => {
		el.style.backgroundImage = `url(assets/images/g${el.id.slice(
			-1
		)}a.png)`;
	});

	// Detect when a state changes to the question and play a sound
	if (
		questions.showing.match(/^g\d+r\d+$/) &&
		last_state.question_showing !== questions.showing
	) {
		last_state.question_showing = questions.showing;
		console.log("Playing question ping");
		questionPing.pause();
		questionPing.currentTime = 0;
		questionPing.play();
	}

	// Show the correct element
	if (questions.showing.match(/^g\d+r\d+$/)) {
		// Question
		eval(questions.showing + "_el.hidden = false");
		round = parseInt(questions.showing.slice(-1));
	} else if (questions.showing.match(/^g\d+a$/)) {
		// Announcement card
		eval(questions.showing + "_el.hidden = false");
	}

	// Assign correct and incorrect classes to the questions
	const g3_correct_answers = [
		questions.g3r1correct,
		questions.g3r2correct,
		questions.g3r3correct
	];
	let i = 1;
	for (answer of g3_correct_answers) {
		const els = document.querySelectorAll(`.g3-question-text.r-${i}`);
		for (el of els) {
			classList = el.classList;
			classList.add(
				classList.contains(`q-${answer.toLowerCase()}`)
					? "q-correct"
					: "q-incorrect"
			);
		}
		i++;
	}

	// Highlight correct and incorrect answers
	if (questions.g3showcorrect) {
		const q3_r_el = document.querySelector(`.g3-question.r-${round}`);
		const g3_correct_els = q3_r_el.querySelector(".q-correct");
		const g3_incorrect_els = q3_r_el.querySelectorAll(".q-incorrect");
		g3_correct_els.style.color = "green";
		g3_incorrect_els.forEach((el) => {
			el.style.opacity = 0.3;
		});
	} else {
		for (el of document.querySelectorAll(".g3-question-text")) {
			el.style.color = "#053859";
			el.style.opacity = 1;
		}
	}

	// Ensure the page is shown
	if (!pageShown) {
		showPage();
		pageShown = true;
	}
}

function load_questions() {
	const API_HOST = document.querySelector("body").dataset.apiHost;
	$.ajax({
		url: `${API_HOST}/questions/api/questions/`,
		type: "GET"
	})
		.done((questions) => {
			updatePage(questions[0]);
		})
		.fail((jqXHR, textStatus, errorThrown) => {
			if (jqXHR.status === 0) {
				alert("No connection. Make sure the API is running.");
				stopPolling();
			}
			console.log(jqXHR, textStatus, errorThrown);
		});
}

webcg.on("play", function () {
	startPolling();
});

webcg.on("stop", function () {
	stopPolling();
	const overlay = document.querySelector(".overlay");
	overlay.style.opacity = 0;
	pageShown = false;
});
