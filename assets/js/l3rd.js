window.debugData = {
	f0: "Name Surname",
	f1: "Subtitle"
};

webcg.on("data", function (data) {
	document.querySelectorAll(".name-stroke").forEach((el) => {
		el.textContent = data.f0 ? data.f0.text || data.f0 : "Name Surname";
	});
});

webcg.on("play", function () {
	const lottieIntro = document.getElementById("lottie-intro");
	lottieIntro.style.opacity = 1;
	const lottieOutro = document.getElementById("lottie-outro");
	lottieOutro.style.opacity = 0;
	lottieIntro.play();
	lottieOutro.stop();

	setTimeout(() => {
		const overlay = document.querySelector(".overlay");
		overlay.style.opacity = 1;
		const svg = overlay.querySelector("svg");
		svg.style.top = "0px";
	}, 300);
});

webcg.on("stop", function () {
	const lottieOutro = document.getElementById("lottie-outro");
	lottieOutro.style.opacity = 1;
	const lottieIntro = document.getElementById("lottie-intro");
	lottieIntro.style.opacity = 0;
	lottieOutro.play();
	lottieIntro.stop();

	setTimeout(() => {
		const overlay = document.querySelector(".overlay");
		overlay.style.opacity = 0;
		const svg = overlay.querySelector("svg");
		svg.style.top = "50px";
	}, 500);
});
