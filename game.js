var gameSettings = {
	lives: 3,
	name: "funkyface",
	currentlevel: 1,
	currentmap: 0,
	width: window.innerWidth,
	height: window.innerHeight,
	levelHeight: window.innerHeight/2,
	standardLevelScreen : $("#standardLevel"),
	mainScreen: $("mainscreen")
}


var translation = {
	"startLevel": "Start level",
	"newgame": "New game"
}


var startButtonTouch = new Hammer($("#start-game")[0]);
startButtonTouch.on('tap', function () {
	openMap();
});



var startLevel = function (mapId, levelId) {
	$("#mainscreen").hide();
	$("#mapscreen").hide();
	$("#titlefield").hide();
	$("#standardlevel").show();
	console.log(mapId, levelId);
	var levelStart = maps[mapId].levels[levelId];
	console.log(levelStart);
	if(levelStart.leveltype == "standardlevel") {
		hordeLevel(levelStart.questions, levelStart.timeToBeatLevel, levelStart.correctAnswers, gameSettings, 
			function () {
				console.log("success");
			},
			function () {
				console.log('fail');
			}
		);
	}
	
}


var renderMap = function (maps) {
	var mapContainer = $("#mapscreen");

	var showLevel = function (event) {
		console.log(event);
		var levelMarker = $(event.target);
		levelMarker.parent().siblings().removeClass("selected");
		levelMarker.parent().addClass("selected");

	};

	var enterLevel = function (event) {
		console.log('heeey');
		var levelStartButton = $(event.target);
		console.log(levelStartButton, levelStartButton.parent());
		var levelId = levelStartButton.parent().attr("data-level-id");
		var mapId = levelStartButton.parent().attr("data-map-id");
		startLevel(mapId, levelId);
	};
	maps.forEach(function(map, mapIndex) {
		var mapScreenContainer = $("<div></div>").addClass("map-screen-container");
		$("#titlefield").text(map.mapname);
		var mapBuffer = $("<div></div>").addClass("map-buffer").css("height", gameSettings.levelHeight);
		mapScreenContainer.append(mapBuffer);
		if(mapIndex == gameSettings.currentmap) {
			mapScreenContainer.addClass("current");
		}
		TweenMax.to(mapScreenContainer, 0, {x: (mapIndex-gameSettings.currentmap)*gameSettings.width, ease: Linear.easeNone});

		map.levels.forEach(function (level, levelIndex) {
			var levelContainer = $("<div></div>").addClass("level").css({
				'height': gameSettings.levelHeight
			})
			.attr("data-map-id", mapIndex)
			.attr("data-level-id", levelIndex);
			var levelTitle = $("<div></div>").addClass("level-title").text(level.levelname);
			var levelMarker = $("<div></div>").addClass("level-marker");
			var levelMarkerTouch = new Hammer(levelMarker[0]);
			var levelStartButton = $("<div></div>").addClass("level-start-button").text(translation.startLevel);
			var levelStartButtonTouch = new Hammer(levelStartButton[0]);
			if(mapIndex == gameSettings.currentmap && levelIndex == gameSettings.currentlevel) {
				levelContainer.addClass("current").addClass("selected");
			}
			levelContainer.append(levelMarker, levelTitle, levelStartButton);
			mapScreenContainer.prepend(levelContainer);

			levelMarkerTouch.on('tap', showLevel);
			levelStartButtonTouch.on('tap', enterLevel);
		});


		mapContainer.append(mapScreenContainer);
	});
};

var openMap = function (settings) {
	$("#mainscreen").hide();
	$("#standardlevel").hide();
	$("#mapscreen").show();
	$("#titlefield").show();
	var scrollLength = $(".map-screen-container.current").outerHeight(true)*2;
	if(gameSettings.currentLevel != 0) {
		scrollLength = scrollLength - ((gameSettings.currentlevel+1)*gameSettings.levelHeight);
		console.log(scrollLength);
	}
	console.log(scrollLength);
	$(".map-screen-container.current").scrollTop(scrollLength);
}



var gapLevel = function (questions, time, timeBetweenGaps, settings, success, fail, achievements) {
	var gapLevelContainer = $("#gaplevel");
	var levelLives = settings.lives;
	gapLevelContainer.empty();


	var clearGap = false;

	var questionCounter = 1;

	var levelTimer = setTimeout(function () {
		failLevel();
	}, time * 1000);

	var questionTimeout = undefined;


	var generateQuestion = function (questionObject, newTimer) {
		var questionContainer = $("<div></div>").addClass("question-container").addClass("current");
		var question = $("<div></div>").addClass("question").text(questionObject.question);
		questionContainer.append(question);
		questionObject.alternatives.forEach(function (alternative, index) {
			var answer = $("<div></div>").addClass("answer").text(alternative);
			var answerTouch = new Hammer(answer[0]);
			if(index == questionObject.answer) {
				answer.addClass("correct");
			}
			answerTouch.on("tap", checkAnswer);
			questionContainer.append(answer);
		});

		TweenMax.to(questionContainer, 0, {x: window.innerWidth, ease:Linear.easeNone});
		gapLevelContainer.append(questionContainer);
		TweenMax.to(questionContainer, 0.5, {x: 0, ease: Back.easeOut});

		if(newTimer) {
			clearGap = false;
			questionTimeout = setTimeout(function () {
				console.log(questionTimeout);
				checkGap(questionContainer);
			}, timeBetweenGaps * 100);
		}

		console.log(questionTimeout);
	};

	var checkGap = function (questionContainer) {
		if(!clearGap) {
			clearTimeout(questionTimeout);
			generateNewQuestion(parentContainer, true);
		} else {
			clearTimeout(questionTimeout);
			failLevel();
		}
	}

	var checkAnswer = function (event) {
		var currentAnswer = $(event.target);
		var parentContainer = currentAnswer.parent();
		if(currentAnswer.hasClass("correct")) {
			currentAnswer.addClass("correct-animation");
			clearGap = true;
		} else {
			currentAnswer.addClass("wrong-animation");
			clearGap = false;
		}
	};

	var generateNewQuestion = function (questionContainer, toggle) {
		TweenMax.to(questionContainer, 0.5, {x: -window.innerWidth, ease: Back.easeOut});
		generateQuestion(questions[questionCounter++], toggle);
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
	generateQuestion(questions[questionCounter-1], true);
}


var hordeLevel = function (questions, time, numberOfQuestions, settings, success, fail) {
	var standardLevelContainer = $("#standardlevel");
	var levelLives = settings.lives;
	var walkers = [];
	standardLevelContainer.empty();

	var questionCounter = 1;

	var levelTimer = setTimeout(function () {
		failLevel();
	}, time * 1000);

	var questionTimeout = undefined;

	var addGround = function () {
		var ground = $("<div></div>").addClass("ground dirt");
		standardLevelContainer.append(ground);
	};

	var addGuy = function () {
		var guy = $("<div></div>").addClass("guysprite standing");
		standardLevelContainer.append(guy);
	};

	var addWalker = function (timeToWalk) {
		var walker = $("<div></div>").addClass("enemysprite walker");
		var distanceToWalk = settings.width - 10 - 40;
		standardLevelContainer.append(walker);
		console.log('innstillinger: ', timeToWalk, distanceToWalk);
		TweenMax.to(walker, timeToWalk, {x: -distanceToWalk, ease: Linear.easeNone});
		walkers.push(walker);
	}

	var shootWalker = function (callback) {
		var shot = $("<div></div>").addClass("shotsprite horde");
		standardLevelContainer.append(shot);
		TweenMax.to(shot, 2, {x: settings.width - 40 - 10, ease: Linear.easeNone});
		console.log("hest");
		console.log(shot, walkers);
		if(checkShot(shot,walkers[0])) {
				callback(false);
		}

		var shotInterval = setInterval(function () {
			if(checkShot(shot,walkers[0])) {
				callback(shotInterval);
			}
		}, 10);
	};

	checkShot = function (shot, walker) {
		console.log(shot, walker);
		if(shot.offset().left >= walker.offset().left) {
			shot.remove();
			return true;
		} else {
			return false;
		}
	}

	var removeWalker = function (walkerAttackToggle, callback) {
		var currentWalker = walkers[0];
		if(walkerAttackToggle) {
			console.log("success attack");
			shootWalker(function (shotInterval) {
				if(shotInterval) clearInterval(shotInterval);
				walkers.shift();
				currentWalker.remove();
				callback();
			});
		} else {
			console.log("fail attack");
			TweenMax.to(currentWalker, 1, {x: "-=100", ease: Linear.easeNone, onComplete: function () {
				currentWalker.remove();
			}});
		}
	}


	var generateQuestion = function (questionObject, newTimer) {
		var questionContainer = $("<div></div>").addClass("question-container").addClass("current");
		var question = $("<div></div>").addClass("question").text(questionObject.question);
		questionContainer.append(question);
		questionObject.alternatives.forEach(function (alternative, index) {
			var answer = $("<div></div>").addClass("answer").text(alternative);
			var answerTouch = new Hammer(answer[0]);
			if(index == questionObject.answer) {
				answer.addClass("correct");
			}
			answerTouch.on("tap", checkAnswer);
			questionContainer.append(answer);
		});

		TweenMax.to(questionContainer, 0, {x: window.innerWidth, ease:Linear.easeNone});
		standardLevelContainer.append(questionContainer);
		TweenMax.to(questionContainer, 0.5, {x: 0, ease: Back.easeOut});

		if(newTimer) {
			addWalker(5);
			questionTimeout = setTimeout(function () {

				console.log(questionTimeout);
				failAttack(questionContainer);
			}, 5000);
		}

		console.log(questionTimeout);
	};

	var failAttack = function (questionContainer) {
		clearTimeout(questionTimeout);
		levelLives--;
		console.log('minus life');
		removeWalker(false);
		if(levelLives <= 0) {
			failLevel();
		} else {
			generateNewQuestion(questionContainer, true);
		}

	}

	var successAttack = function (questionContainer) {
		clearTimeout(questionTimeout);
		removeWalker(true, function () {
			generateNewQuestion(questionContainer, true);
		});
	};

	var checkAnswer = function (event) {
		var currentAnswer = $(event.target);
		var parentContainer = currentAnswer.parent();
		if(currentAnswer.hasClass("correct")) {
			currentAnswer.addClass("correct-animation");
			successAttack(parentContainer);
		} else {
			currentAnswer.addClass("wrong-animation");
			generateNewQuestion(parentContainer, false);
		}
	};

	var generateNewQuestion = function (questionContainer, toggle) {
		TweenMax.to(questionContainer, 0.5, {x: -window.innerWidth, ease: Back.easeOut});
		generateQuestion(questions[questionCounter++], toggle);
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
	addGuy();
	addGround();
	generateQuestion(questions[questionCounter-1], true);
}



renderMap(maps, function () {
	console.log("start spill");
});