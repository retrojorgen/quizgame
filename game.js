var gameSettings = {
	lives: 3,
	name: "funkyface",
	currentlevel: 0,
	highScore: 2000,
	width: window.innerWidth,
	height: window.innerHeight,
	levelHeight: window.innerHeight/2,
	standardLevelScreen : $("#standardLevel"),
	mainScreen: $("mainscreen")
}

if($("#mobile-wrapper").length) {
	gameSettings.width = 375;
	gameSettings.height = 667;
}

var currentGameData = {
	points: 0,
	level: 0,
	question: 0,
	answer: [],
	gameStatus: true,
	correctAnswersInCurrentLevel: 0,
	currentQuestionType: "single",
	currentQuestionContainerNode : undefined,
	lives: 3
}


var translation = {
	"startLevel": "Start level",
	"newgame": "New game"
}


var startButtonTouch = new Hammer($("#start-game")[0]);
startButtonTouch.on('tap', function () {
	startGame();
});

var startGame = function () {

	var levelContainer = $("#levelContainer");
	
	var checkAnswer = function () {
		console.log("sjekker svar");
		console.log(currentGameData.answer[0], Levels[currentGameData.level].questions[currentGameData.question].answer);
		if(Levels[currentGameData.level].questions[currentGameData.question].type == "single") {
			if(currentGameData.answer[0] == Levels[currentGameData.level].questions[currentGameData.question].answer) {
				return true;
			} else {
				return false;
			}
		} else {
			var trueArray = [];
			for (var x = 0; x<= Levels[currentGameData.level].questions[currentGameData.question].answer; x++) {
				if(Levels[currentGameData.level].questions[currentGameData.question].answer.indexOf(currentGameData.answer[x] > -1)) {
					trueArray.push(currentGameData.answer[x]);
				}
			}
			if(trueArray == currentGameData.answer) {
				return true;
			} else {
				return false;
			}
		}
	};
	
	// draw question and add to DOM
	var drawQuestion = function () {
		currentGameData.answer = [];
		var questionContainer = $("<div></div>").addClass("questionContainer");
		var questionTitle = $("<div></div>").addClass("question").text(Levels[currentGameData.level].questions[currentGameData.question].question);
		questionContainer.append(questionTitle);
		if(Levels[currentGameData.level].questions[currentGameData.question].type != "single") {
			questionContainer.addClass("multipleChoice").attr("data-q-id", currentGameData.question);
		} else {
			questionContainer.addClass("multipleChoice").attr("data-q-id", currentGameData.question);
		}
		Levels[currentGameData.level].questions[currentGameData.question].alternatives.forEach(function (alternative, i) {
			var alternativeNode = $("<div></div>").addClass("alternative").text(alternative).attr("data-answer-id", i);
			var alternativeNodeTouch = new Hammer(alternativeNode[0]);
			alternativeNodeTouch.on("tap", function (event) {
				if(Levels[currentGameData.level].questions[currentGameData.question].type == "single") {
					currentGameData.answer = [$(event.target).attr("data-answer-id")];
					$(event.target).siblings(".alternative").removeClass("selected").addClass("faded");
					$(event.target).addClass("selected").removeClass("faded");
				} else {
					if($(event.target).hasClass("selected")) {
						var answerIndex = currentGameData.answer.indexOf($(event.target).attr("data-answer-id"));
						if(answerIndex > -1) {
							currentGameData.answer.slice(answerIndex, 1);
						}
					} else {
						currentGameData.answer.push($(event.target).attr("data-answer-id"));
					}
					$(event.target).toggleClass("selected");
				}
			});
			questionContainer.append(alternativeNode);
		});

		var selectButton = $("<div></div>").addClass("answerbutton").text("svar");
		var selectButtonTouch = new Hammer(selectButton[0]);
		selectButtonTouch.on('tap', function (event) {
			console.log(event);
			//event.preventDefault();
			//event.stopPropagation();
			if(checkAnswer()) {
				// right answer
				var qContainer = $(event.target).parent();
				if(Levels[currentGameData.level].questions[currentGameData.question].type == "single") {
					currentGameData.points += 10;
				} else {
					currentGameData.points += 20;	
				}
				$("#scoreinput").text(currentGameData.points);
			} else {
				// wrong answer
			}
			if(currentGameData.gameStatus) {
				currentGameData.question++;
				drawQuestion();
			}
			TweenMax.to($(event.target).parent(), 0.3, {x: "-" + gameSettings.width, ease:Power4.easeOut, onComplete: function () {
				console.log("hey");
				$(event.target).parent().remove();
			}});
		});
		questionContainer.append(selectButton);

		TweenMax.to(questionContainer, 0, {x: gameSettings.width, ease: Linear.easeNone});
		levelContainer.append(questionContainer);
		TweenMax.to(questionContainer, 0.3, {x: 0, ease: Power4.easeOut});
	};

	// loads level, sets timer.
	var loadLevel = function (level) {
		
		var titleField = $("<div</div>").attr("id", "titlefield").text(level.levelname);
		levelContainer.append(titleField);

		drawQuestion();

		setTimeout(function () {

		}, level.timeToBeatLevel * 1000);
	}

	// show end screen with ok button
	// go back to main screen
	var endGame = function () {
		currentGameData.gameStatus = false;
	}

	// run on first init
	var init = function () {
		currentGameData.level = 0;
		currentGameData.question = 0;
		TweenMax.to($("#mainscreen"), 1, {x: "-" + gameSettings.width, ease: Power4.easeInOut});
		loadLevel(Levels[0]);
		$("#bottomContainer").toggleClass("visible");
	}

	init();
};

