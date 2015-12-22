var gameSettings = {
	lives: 3,
	name: "funkyface",
	level: 2
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

var new StandardLevel(questions, 30, 3, gameSettings, callback);


var StandardLevel = function (questions, time, numberOfQuestions, settings, callback) {
	var standardLevelContainer = $("#standard-level");
	setTimeout(endLevel, )
	var generateQuestion = function (question) {
		var questionContainer = $("<div>").addClass("question-container");
		var question = $("<div>").addClass("question").text(question.question);
		questionContainer.append(question);
		forEach(question.alternatives, function (alternative, index) {
			var answer = $("<div>").addClass("answer").text(alternative);
			if(index == question.answer) {
				answer.addClass("correct");
			}
			answer.on("click", checkAnswer);
			questionContainer.append(answer);
		});
		
	};

	var endLevel = function () {
		callback();
	}
}