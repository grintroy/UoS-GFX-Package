let lottieIntro, lottieOutro, overlay, svg;

window.debugData = {
	f0: "Name Surname",
	f1: "Subtitle"
};

webcg.on("data", (data) => {
	document.querySelectorAll(".name-stroke").forEach((el) => {
		el.textContent = data.f0 ? data.f0.text || data.f0 : "Name Surname";
	});
});

webcg.on("play", () => {
	lottieIntro.style.opacity = 1;
	lottieOutro.style.opacity = 0;
	lottieIntro.play();
	lottieOutro.stop();

	setTimeout(() => {
		overlay.style.opacity = 1;
		svg.style.top = "0px";
	}, 300);
});

webcg.on("stop", () => {
	lottieOutro.style.opacity = 1;
	lottieIntro.style.opacity = 0;
	lottieOutro.play();
	lottieIntro.stop();

	setTimeout(() => {
		overlay.style.opacity = 0;
		svg.style.top = "50px";
	}, 500);
});

document.addEventListener("DOMContentLoaded", () => {
	lottieIntro = document.getElementById("lottie-intro");
	lottieOutro = document.getElementById("lottie-outro");
	overlay = document.querySelector(".overlay");
	svg = overlay.querySelector("svg");

	lottieIntro.load(lottie_intro_json);
	lottieOutro.load(lottie_outro_json);
});
