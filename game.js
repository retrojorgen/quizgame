var gameSettings = {
	lives: 3,
	name: "funkyface",
	level: 2,
	width: window.innerWidth,
	height: window.innerHeight,
	standardLevelScreen : $("#standardLevel"),
	mainScreen: $("mainscreen")
}



var questions = [
	{
		question: "Who created sonic?",
		alternatives: ["Nintendo","Sega","Sony Ericsson"],
		answer: 1
	},
	{
		question: "Who created Mario?",
		alternatives: ["Sega","Atari","Nintendo"],
		answer: 2
	},
	{
		question: "Who created Pitfall?",
		alternatives: ["Sega","Atari","Nintendo"],
		answer: 1
	}
]
console.log($("#start-game"));
$("#start-game").on("click", function () {
	startLevel();
});

var startLevel = function () {
	$("#mainscreen").hide();
	$("#standardlevel").show();
	console.log("hest");
	StandardLevel(questions, 30, 3, gameSettings, 
		function () {
			console.log("success");
		},
		function () {
			console.log('fail');
		}
	);
}

var StandardLevel = function (questions, time, numberOfQuestions, settings, success, fail) {
	var standardLevelContainer = $("#standardlevel");

	var questionCounter = 1;

	var levelTimer = setTimeout(function () {
		failLevel();
	}, time * 1000);


	var generateQuestion = function (questionObject) {
		var questionContainer = $("<div></div>").addClass("question-container").addClass("current");
		var question = $("<div></div>").addClass("question").text(questionObject.question);
		questionContainer.append(question);
		questionObject.alternatives.forEach(function (alternative, index) {
			var answer = $("<div></div>").addClass("answer").text(alternative);
			if(index == questionObject.answer) {
				answer.addClass("correct");
			}
			answer.on("click", checkAnswer);
			questionContainer.append(answer);
		});

		TweenMax.to(questionContainer, 0, {x: window.innerWidth, ease:Linear.easeNone});
		standardLevelContainer.append(questionContainer);
		TweenMax.to(questionContainer, 0.5, {x: 0, ease: Back.easeOut});
	};

	var checkAnswer = function (event) {
		var currentAnswer = $(event.target);
		if(currentAnswer.hasClass("correct")) {
			currentAnswer.addClass("correct-animation");
		} else {
			currentAnswer.addClass("wrong-animation");
		}
		var parentContainer = currentAnswer.parent();
		TweenMax.to(parentContainer, 0.5, {x: -window.innerWidth, ease: Back.easeOut});
		if(questionCounter++ <= numberOfQuestions) {
			generateQuestion(questions[questionCounter-1]);
		} else {
			winLevel();
		}
	};

	var startTimer = function () {
		var timerContainer = $("<div></div>").addClass("level-timer");
		TweenMax.to(timerContainer, 0, {x: -window.innerWidth, ease: Linear.easeNone});
		TweenMax.to(timerContainer, time, {x: 0, ease: Linear.easeNone});
		standardLevelContainer.append(timerContainer);
	}

	var failLevel = function () {
		clearTimeout(levelTimer);
		fail();
	}

	var winLevel = function () {
		clearTimeout(levelTimer);
		success();
	}

	startTimer();
	generateQuestion(questions[questionCounter-1]);
}