webcg.on("data", function (data) {
	document.querySelector(".question-text.q-a").innerHTML = data.f0
		? data.f0.text || data.f0
		: "HAVE YOU EVER SEEN CROCODILE SEATS IN THE TRUNK? TURN AROUND, SIT DOWN, LET EM BITE YO BUTT";
	document.querySelector(".question-text.q-b").innerHTML = data.f1
		? data.f1.text || data.f1
		: "HAVE YOU EVER SEEN A BADGER IN A CAR? TURN AROUND, SIT DOWN, LET IT BITE YO ARSE";
	document.querySelector(".question-text.q-c").innerHTML = data.f2
		? data.f2.text || data.f2
		: "HAVE YOU EVER FELT NEW LEATHER SEATS? TURN AROUND, SIT DOWN, LET EM KISS YO CHEEKS";
});

webcg.on("play", function () {
	const overlay = document.querySelector(".overlay");
	overlay.style.opacity = 1;
});
webcg.on("stop", function () {
	const overlay = document.querySelector(".overlay");
	overlay.style.opacity = 0;
});
