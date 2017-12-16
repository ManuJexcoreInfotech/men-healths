/* Variables */
var questions = [];
var answers = [];
var questionId = 0;
var urlParameters = {};

/* Run these on document ready */
$(document).ready(function() {
  showPageLoader();
  getQuestions();
  getAnswers();
  urlParameters = getUrlParameters();
  // console.log(urlParameters);

  if ('question' in urlParameters && urlParameters.question != null) {
    questionId = urlParameters.question;
    loadQuestion(questionId);
  } else {
    questionId = 0;
    loadQuestion(0);
  }
  hidePageLoader();
});

/* Function to load all the questions from firebase to the questions array */
function getQuestions() {
  questions = [{
    title: 'What is your symptom? (you may choose more than 1 answer)',
    type: 'multiple',
    options: [
      'Difficulty keeping/getting an erection.',
      'Reaching orgasm too quickly.',
      'Reaching orgasm too slowly or not at all.',
      'Reduced interest in sex.'
    ]
  }, {
    title: 'When did you start feeling this way?',
    type: 'single',
    options: [
      'The past week',
      'The past month',
      'The past year'
    ]
  }, {
    title: 'Are you taking any medication to treat your symptom?',
    type: 'single',
    options: [
      'Yes',
      'No'
    ]
  }, {
    title: 'Any medication problems?',
    type: 'single',
    options: [
      'Yes',
      'No'
    ]
  }, {
    title: 'Any allergies to food or medicine?',
    type: 'single',
    options: [
      'Yes',
      'No'
    ]
  }, {
    title: 'Any medical condition? (you may choose more than 1)',
    type: 'multiple',
    options: [
      'Cancer',
      'Diabetes',
      'Heart Disease (CHF, MI)',
      'Stroke',
      'High Blood Pressure',
      'High Cholesterol',
      'Other',
      'No Medical Condition'
    ]
  }];
}

/* Function to load all the answers from localStorage to answers array,  and later from firebase - if feature needed */
function getAnswers() {
  answers = getLocalData('answers');
  console.log('ANSWERS SECTION: ');
  if (answers == null || answers == '') {
    console.log('no answers in lacalstorage');
    /* Initiate with questions - to maintain length of the arrays */
    answers = questions;
  } else {
    answers = JSON.parse(answers);
  }
  console.log(answers);
}

/* function to load question to the HTML  */
function loadQuestion(questionId) {
  questionId = parseInt(questionId);
  var tempQues = questions[questionId];
  var tempOption = '';

  // console.log(questions);
  // console.log(questionId);
  // console.log(tempQues);

  $('#question-title').innerHTML = '';
  $('#question-options').innerHTML = '';

  $('#question-title').append(tempQues['title']);
  for (var i = 0; i < tempQues.options.length; i++) {
    if (tempQues.type == 'single') {
      tempOption = "<a href class='interest-box interest-box-single-choice transparent-background bg-green-dark'>\
      <em>" + tempQues.options[i] + "</em>\
      <i class='interest-first-icon fa fa-circle-o'></i>\
      <i class='interest-second-icon hide-interest-icon fa fa-check'></i>\
      </a>";

    } else if (tempQues.type == 'multiple') {
      tempOption = "<a href class='interest-box interest-box-multiple-choice transparent-background bg-green-dark'>\
      <em>" + tempQues.options[i] + "</em>\
      <i class='interest-first-icon fa fa-circle-o'></i>\
      <i class='interest-second-icon hide-interest-icon fa fa-check'></i>\
      </a>";
    }
    $('#question-options').append(tempOption);
  }

  /* back and next buttons */
  var tempBack = parseInt(questionId) - 1;
  var tempNext = parseInt(questionId) + 1;
  // $('#question-back').removeAttr('onclick');
  // $('#question-next').removeAttr('onclick');
  // $('#question-back').attr('onclick', "loadQuestion(" + tempBack + ")");
  // $('#question-next').attr('onclick', "loadQuestion(" + tempNext + ")");

  $('#question-back').attr('onclick', "submitAnswer('questionnaire.html?question=" + tempBack + "')");
  $('#question-next').attr('onclick', "submitAnswer('questionnaire.html?question=" + tempNext + "')");
  $('#question-submit').addClass('hide-this');
  // $('#question-back').attr('href', "questionnaire.html?question=" + tempBack);
  // $('#question-next').attr('href', "questionnaire.html?question=" + tempNext);

  if (questions.length <= questionId + 1) {
    /* Last question */
    $('#question-next').addClass('hide-this');
    $('#question-submit').removeClass('hide-this');
    $('#question-submit').attr('onclick', "submitQuestionare()");
  } else if (questionId == 0) {
    /* First question */
    $('#question-back').addClass('hide-this');
  } else {
    // console.log('mid question');
    $('#question-next').removeClass('hide-this');
    $('#question-back').removeClass('hide-this');
  }

}

function submitAnswer(moveToPage) {
  showPageLoader();
  /* save the answer */
  questAns = [];
  $('.interest-box').filter(function() {
    if (!($(this).is('.transparent-background'))) {
      questAns.push($(this).children('em').text());
    }
  });

  if (questAns.length == 0) {
    showalert('Error', 'Please Answer');
  } else {
    var tempQuest = questions[questionId];
    tempQuest.answer = questAns;
    answers[questionId] = tempQuest;
    // answers[questionId]['answer'] = questAns;
    // console.log('ANSWER DATA');
    // console.log(questionId);
    // console.log(answers);
    // console.log(answers[questionId]);
    setLocalData('answers', JSON.stringify(answers));
    /* submit answers */
    if (moveToPage != 'submit') {
      hidePageLoader();
      /* redirect to page */
      redirectToPage(moveToPage);
    }
  }
  hidePageLoader();

}

function submitQuestionare() {
  showPageLoader();
  submitAnswer('submit');

  /* Add data to firebase questionnaire node */


  var questionnaireRef = firebase.database().ref().child('questionnaire/' + getLocalData('uid'));
  questionnaireRef.update(answers, function(error) {
    if (error) {
      console.log(error);
    } else {
      console.log("success");
      hidePageLoader();
      window.location = "home.html";
    }
  });
  hidePageLoader();
}
