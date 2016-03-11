var startTheApp = function () {

	var selectScreen = function (showScreen, hideScreen, callback) {
		if(hideScreen) {
			TweenMax.to(hideScreen, 0.5, {opacity: 0, ease: Power4.easeOut, onComplete: function () {
				hideScreen.hide();
				showScreen.show();
				TweenMax.to(showScreen, 0.5, {opacity: 1, ease: Power4.easeOut});
				TweenMax.staggerFrom(showScreen.find('.stagger'), 2, {scale: 0.7, opacity: 0, delay: 0.5, ease: Elastic.easeOut}, 0.2);
				if(callback) callback();
			}});
		} else {
			showScreen.show();
			TweenMax.to(showScreen, 0.5, {opacity: 1, ease: Power4.easeOut});
			TweenMax.staggerFrom(showScreen.find('.stagger'), 2, {scale: 0.7, opacity: 0, delay: 0.5, ease: Elastic.easeOut}, 0.2);
			if(callback) callback();
		}
	}

	var shuffleArray = function (a) {
	    var j, x, i;
	    for (i = a.length; i; i -= 1) {
	        j = Math.floor(Math.random() * i);
	        x = a[i - 1];
	        a[i - 1] = a[j];
	        a[j] = x;
	    }
	}


	var startMainScreen = function () {
		selectScreen(gameSettings.mainScreen);
	}

	var submitUsername = function () {
		var usernameTemp = gameSettings.usernameInput.val();
		
		if(usernameTemp) {
			localStorage.username = usernameTemp;
			gameSettings.username = usernameTemp;
			TweenMax.to(gameSettings.usernameForm, 1,  {x: "-" + gameSettings.width, ease: Power4.easeOut, onComplete: function () {
				gameSettings.usernameForm.hide();	
			}});
			gameSettings.emailForm.show();
			TweenMax.to(gameSettings.emailForm, 1,  {x: 0, ease: Power4.easeOut, onComplete: function () {
				gameSettings.emailInput.focus();
			}});
		}
	}

	var submitEmail = function () {
		var emailTemp = gameSettings.emailInput.val();

		localStorage.email = emailTemp;
		gameSettings.email = emailTemp;

		selectScreen(gameSettings.mainScreen, gameSettings.authenticationScreen, function () {
			userAuthenticated();
		});

	}

	var startAuth = function () {
		selectScreen(gameSettings.authenticationScreen, undefined, function () {
			TweenMax.to(gameSettings.usernameForm, 0, {x: 0, ease: Linear.easeNone});
			TweenMax.to(gameSettings.emailForm, 0, {x: gameSettings.width, ease: Linear.easeNone});
			gameSettings.usernameForm.show();
			gameSettings.usernameInput.focus();	
		});
	}

	var insertUserName = function () {
		gameSettings.usernameWelcome.text(gameSettings.username);
	}

	var userAuthenticated = function() {
		insertUserName();
		
		TweenMax.to(gameSettings.mainScreenJanStandard, 0, {y: 100, ease: Linear.easeNone});
		TweenMax.to(gameSettings.mainScreenJanStandard, 1, {y: 0, ease: Bounce.easeOut});

		TweenMax.to(gameSettings.logo, 0, {y: -100, scale: 0.5, ease: Linear.easeNone});
		TweenMax.to(gameSettings.logo, 1, {y: 0, scale: 1, ease: Bounce.easeOut});
	}

	var startGame = function () {
		
		var checkAnswer = function () {
			
			
			if(Levels[currentGameData.level].questions[currentGameData.question].type == "single") {
				if(currentGameData.answer[0] == Levels[currentGameData.level].questions[currentGameData.question].answer-1) {
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

		var animatePoint = function () {
			console.log("animerer");
			console.log(currentGameData.correctContainerCount);
			TweenMax.to(currentGameData.correctContainerCount, 0.25, {x: -9, y: -10, scale: 3.3, ease: Bounce.easeInOut, onComplete: function () {
				TweenMax.to(currentGameData.correctContainerCount, 0.25, {x: 0, y:0, scale: 1, ease: Linear.easeNone});
			}});
		};


		var animateLives = function () {
			TweenMax.to(gameSettings.livesUpdate, 0.25, {scale: 2.4, x: 28, y: -10, ease:Bounce.easeInOut, onComplete: function () {
				TweenMax.to(gameSettings.livesUpdate, 0.25, {scale: 1, x: 0, y: 8, ease: Linear.easeNone});
			}});
		}
		
		// draw question and add to DOM
		var drawQuestion = function () {
			currentGameData.answer = [];
			var questionContainer = $("<div></div>").addClass("questionContainer");
			var questionTitle = $("<div></div>").addClass("question").text(Levels[currentGameData.level].questions[currentGameData.question].question);
			if(Levels[currentGameData.level].questions[currentGameData.question].question.length > 27) {
				questionTitle.css('font-size', '30px');
			}
			questionContainer.append(questionTitle);
			if(Levels[currentGameData.level].questions[currentGameData.question].type != "single") {
				questionContainer.addClass("multipleChoice").attr("data-q-id", currentGameData.question);
			} else {
				questionContainer.addClass("single").attr("data-q-id", currentGameData.question);
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

			var selectButton = $("<img>", {src:"img/answer-button.png"}).addClass("answerbutton");
			var selectButtonTouch = new Hammer(selectButton[0]);
			selectButtonTouch.on('tap', function (event) {
				var that = window;

				
				//event.preventDefault();
				//event.stopPropagation();
				if(checkAnswer()) {
					// right answer
					var qContainer = $(event.target).parent();

					currentGameData.correctAnswersInCurrentLevel++;
					currentGameData.correctContainerCount.text(currentGameData.correctAnswersInCurrentLevel);
					console.log('riktige svar: ', currentGameData.correctAnswersInCurrentLevel);

					if(Levels[currentGameData.level].questions[currentGameData.question].type == "single") {
						currentGameData.points += 100;
					} else {
						currentGameData.points += 200;	
					}
					gameSettings.scoreInput.text(currentGameData.points);
					animatePoint();
				} else {
					// wrong answer

					// lose life
					currentGameData.lives--;
					gameSettings.livesUpdate.css("width", currentGameData.lives * 29);
					if(currentGameData.lives <= 0) {
						endGame();
					}

					setTimeout(function () {
						currentGameData.janStandard.removeClass("wrongjan");
					},500);
				}

				console.log('sjekker svar: ', currentGameData.correctAnswersInCurrentLevel, Levels[currentGameData.level].correctAnswersToProceed);
				if(currentGameData.correctAnswersInCurrentLevel >= Levels[currentGameData.level].correctAnswersToProceed) {
					console.log('prøver å komme til neste bane');
					nextLevel();
				} else {
					if(currentGameData.gameStatus) {
						console.log('prøver å laste neste spørsmål');
						currentGameData.question++;
						drawQuestion();
					} else {
						console.log('no clue', currentGameData.gameStatus);	
					}
					
				}
				TweenMax.to($(event.target).parent(), 1, {x: "-" + gameSettings.width, ease:Power4.easeOut, onComplete: function () {
					
					$(event.target).parent().remove();
				}});
			});
			questionContainer.append(selectButton);

			TweenMax.to(questionContainer, 0, {x: gameSettings.width, ease: Linear.easeNone});
			gameSettings.levelScreen.append(questionContainer);
			TweenMax.to(questionContainer, 1, {x: 0, ease: Power4.easeOut});
		};

		

		// loads level, sets timer.
		var loadLevel = function (level) {

			shuffleArray(level.questions);

			gameSettings.levelScreen.empty();

			currentGameData.correctAnswersInCurrentLevel = 0;
			currentGameData.levelCounter = level.timeToBeatLevel;

			var titleField = $("<div</div>").attr("id", "titlefield").text(level.levelname);
			var countDownContainer = $("<div></div>").attr("id", "countdown").text(level.timeToBeatLevel);
			currentGameData.correctContainerCount = $("<span></span>", {id: "correctAnswersCounter"}).text("0");
			var correctContainerAnswers = $("<span></span>", {id: "correctAnswersOnLevel"}).addClass("small").text("/" + Levels[currentGameData.level].correctAnswersToProceed);
			var correctContainer = $("<div></div>").attr("id", "correct").append(currentGameData.correctContainerCount,correctContainerAnswers);
			currentGameData.janStandard = $("<div></div>").addClass("jangame-wrapper").append($("<img>", {src:"img/retrojan-angry.png"}).addClass("jangame"));
			var timerAnimated = $("<div></div>").attr("id", "timer");
			TweenMax.to(timerAnimated, 0, {x: "-" + gameSettings.width, ease: Linear.easeNone});
			TweenMax.to(currentGameData.janStandard, 0, {y: 250, ease: Linear.easeNone});
			TweenMax.to(currentGameData.janStandard, 1, {y: 50, ease: Bounce.easeOut});
			gameSettings.levelScreen.append(titleField, countDownContainer, correctContainer, timerAnimated, currentGameData.janStandard);

			drawQuestion();

			TweenMax.to(gameSettings.bottomContainer, 0.5, {y: 0, ease: Bounce.easeInOut});


			selectScreen(gameSettings.levelScreen, gameSettings.statusScreen);

			currentGameData.countDownInterval = setInterval (function () {
				currentGameData.levelCounter--;
				countDownContainer.text(currentGameData.levelCounter);
			}, 1000);

			
			currentGameData.mainTimeout = setTimeout(function () {
				endGame();
			}, level.timeToBeatLevel * 1000);
		
			TweenMax.to(timerAnimated, level.timeToBeatLevel, {x: 0, ease: Linear.easeNone});

		};

		var nextLevel = function () {
			console.log("next-level kalt");

			clearTimeout(currentGameData.mainTimeout);
			clearTimeout(currentGameData.countDownInterval);
			var calculatedBonus = currentGameData.levelCounter * 4;
			currentGameData.points += calculatedBonus;
			currentGameData.gameStatus = false;
			if(Levels[currentGameData.level + 1]) {
				currentGameData.level++;
				currentGameData.question = 0;
				console.log("sending data: ", currentGameData.level, calculatedBonus, currentGameData.points, currentGameData.levelCounter, (currentGameData.levelCounter*10));
				updateStatusScreen(currentGameData.level, calculatedBonus, currentGameData.points);
				selectScreen(gameSettings.statusScreen, gameSettings.levelScreen);
			}
		};

		// show end screen with ok button
		// go back to main screen
		var endGame = function () {
			clearTimeout(currentGameData.mainTimeout);
			selectScreen(gameSettings.endGameContainer, gameSettings.levelScreen);
		

			gameSettings.endGameContainer.find(".screen-header").text("Game over!");
			
			if(currentGameData.lives <= 0) {
				gameSettings.endGameContainer.find(".screen-description").text("You ran out of lives");
			} else {
				gameSettings.endGameContainer.find(".screen-description").text("You ran out of time");
			}

			if(currentGameData.points > localStorage.score) {
				gameSettings.endGameContainer.find(".screen-label").text('No new high-score');
			} else {
				gameSettings.endGameContainer.find(".screen-label").text('new high score!');
			}

			gameSettings.endGameContainer.find(".screen-number-bigstart-level-button").text(currentGameData.points);
			
			console.log("avslutter spill");
			currentGameData.gameStatus = false;
			clearTimeout(currentGameData.countDownInterval);
			
		}

		var updateStatusScreen = function (levelNumber, bonus, score) {
			console.log("data coming in", levelNumber, bonus, score);
			gameSettings.statusScreenTitle.text(Levels[levelNumber].levelname);
			gameSettings.statusScreenScoreToBeat.text(Levels[levelNumber].correctAnswersToProceed)
			gameSettings.statusScreenLevelNumber.text(levelNumber+1);
			if(bonus > 0) {
				gameSettings.statusScreenTimebonusContainer.show();
				gameSettings.statusScreenTimebonusInfoContainer.show();
				gameSettings.statusScreenTimebonusInfo.text(levelNumber);
				gameSettings.statusScreenTimebonus.text(bonus);
			} else {
				gameSettings.statusScreenTimebonusContainer.hide();
				gameSettings.statusScreenTimebonusInfoContainer.hide();
			}
			if(!score) {
				gameSettings.statusScreenCurrentScore.text("0");
			} else {
				gameSettings.statusScreenCurrentScore.text(score);
				gameSettings.scoreInput.text(score);
			}

		};

		// run on first init
		var init = function () {

			gameSettings.livesUpdate.css("width", currentGameData.lives * 29);
			
			currentGameData.level = 0;
			currentGameData.question = 0;

			selectScreen(gameSettings.statusScreen, gameSettings.mainScreen);
			gameSettings.bottomContainer.show();
			updateStatusScreen(currentGameData.level, 0, currentGameData.points);

			var startLevelTouch = new Hammer(gameSettings.startLevelButton[0]);

			startLevelTouch.on('tap', function () {
				loadLevel(Levels[currentGameData.level]);
			});
		}

		init();
		
	};

	var translation = {
		"startLevel": "Start level",
		"newgame": "New game"
	}


	var gameSettings = {
		lives: 3,
		highScore: 2000,
		width: window.innerWidth,
		height: window.innerHeight,
		levelHeight: window.innerHeight/2,
		levelScreen : $("#levelContainer").hide(),
		mainScreen: $("#mainscreen").hide(),
		authenticationScreen: $("#authenticationScreen").hide(),
		bottomContainer: $("#bottomContainer").hide(),
		statusScreen: $("#statusscreen"),
		usernameWelcome: $("#username-welcome"),
		startGameButton: $("#start-game-button"),
		startLevelButton: $("#start-level-button"),
		usernameInput: $("#username-input"),
		emailInput: $("#email-input"),
		usernameForm: $("#username"),
		emailForm: $("#email"),
		mainScreenJanStandard: $("#mainscreen .janstandard"),
		logo: $("#logo"),
		scoreInput: $("#scoreinput"),
		livesUpdate: $("#lives"),
		statusScreenLevel: $("#statusscreen-level"),
		statusScreenTitle: $("#statusscreen-title"),
		statusScreenLevelNumberContainer: $("#statusscreen-level-number-container"),
		statusScreenLevelNumber: $("#statusscreen-level-number"),
		statusScreenTimebonusInfoContainer: $("#statusscreen-timebonus-info-container"),
		statusScreenTimebonusInfo: $("#statusscreen-timebonus-info"),
		statusScreenTimebonusContainer: $("#statusscreen-timebonus-container"),
		statusScreenTimebonus: $("#statusscreen-timebonus"),
		statusScreenCurrentScoreInfo: $("#statusscreen-current-score-info"),
		statusScreenCurrentScoreContainer: $("#statusscreen-current-score-container"),
		statusScreenCurrentScore: $("#statusscreen-current-score"),
		statusScreenScoreToBeat: $("#statusscreen-score-to-beat"),
		endGameContainer : $("#endgameContainer")
	}

	if(localStorage.username) {
		gameSettings.username = localStorage.username;
		insertUserName();
	}

	if(localStorage.email) {
		gameSettings.email = localStorage.email;
	}

	if(localStorage.score) {
		gameSettings.score = localStorage.score;
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
		lives: gameSettings.lives
	}


	gameSettings.usernameForm.submit(function (event) {
		event.preventDefault();
		event.stopPropagation();
		submitUsername();
	});

	gameSettings.emailForm.submit(function (event) {
		event.preventDefault();
		event.stopPropagation();
		submitEmail();
	});


	
	var startButtonTouch = new Hammer(gameSettings.startGameButton[0]);
	startButtonTouch.on('tap', function () {
		
		startGame();
	});

	if(!gameSettings.username) {
	  startAuth();
	} else {
	  startMainScreen();
	}

};



