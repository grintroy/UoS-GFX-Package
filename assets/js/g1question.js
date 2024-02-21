webcg.on("data", function (data) {
	document.querySelector(".question-text").innerHTML = data.f0
		? data.f0.text || data.f0
		: "THE QUESTION OR PROMPT GOES RIGHT ON THIS SCREEN";
});

webcg.on("play", function () {
	const overlay = document.querySelector(".overlay");
	overlay.style.opacity = 1;
});
webcg.on("stop", function () {
	const overlay = document.querySelector(".overlay");
	overlay.style.opacity = 0;
});
