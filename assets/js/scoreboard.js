webcg.on("data", function (data) {
	document.querySelector("body").dataset.apiHost = data.f0
		? data.f0.text || data.f0
		: "http://localhost:8000";
});

let pollingInterval;
let pageShown = false;

function startPolling() {
	load_contestants();
	pollingInterval = setInterval(load_contestants, 500);
}

function stopPolling() {
	clearInterval(pollingInterval);
}

function showPage() {
	const overlay = document.querySelector(".overlay");
	overlay.style.opacity = 1;
}

function updatePage(contestants) {
	const API_HOST = document.querySelector("body").dataset.apiHost;
	let i = 0;
	for (const contestant of contestants) {
		const image = API_HOST + contestant.image;
		const name = contestant.name;
		const score = contestant.score.value;

		const image_element = document.querySelector(
			`.player-image.player${i + 1} img`
		);
		const name_element = document.querySelector(
			`.player-name.player${i + 1}`
		);
		const score_element = document.querySelector(
			`.player-score.player${i + 1}`
		);

		image_element.src = image;
		name_element.innerHTML = name;
		score_element.innerHTML = score;

		image_element.hidden = false;

		if (contestant.image === null) {
			image_element.remove();
		}

		i++;
	}
	if (!pageShown) {
		showPage();
		pageShown = true;
	}
}

function load_contestants() {
	const API_HOST = document.querySelector("body").dataset.apiHost;
	$.ajax({
		url: `${API_HOST}/scores/api/contestants/`,
		type: "GET"
	})
		.done((contestants) => {
			updatePage(contestants);
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
