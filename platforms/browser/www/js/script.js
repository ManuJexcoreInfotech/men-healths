/* Global functions - Used al all pages */

/**
 * Log out a user - remove all data from localStorage
 * @return
 */
function logout() {
  /* log out firebase user  */
  showPageLoader()
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    localStorage.clear();
    /* redirect to home */
    hidePageLoader();
    window.location = "pageapp-login.html";
  }).catch(function(error) {
    hidePageLoader()
    console.log(error);
    // An error happened.
  });
}


/**
 * Check if user is logged in
 * @return {Boolean} Return a user data object
 */
function isUserLoggedIn() {
  var uid = getLocalData('uid');
  if (uid == null) {
    return false;
  } else {
    return true;
  }
}

/* Transactions with local storage */
function setLocalData(name, value) {
  localStorage[name] = value;
}

function getLocalData(name) {
  if (typeof localStorage[name] != 'undefined') {
    return localStorage[name];
  } else {
    return null;
  }
}

/* function to get url parameters */
function getUrlParameters() {
  var query_string = {};
  var query = window.location.search.substring(1);

  if (query.length > 0) {
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // Push the first value of parameter, ignore remaining values(in case variable is present more that once)
      if (typeof query_string[pair[0]] === "undefined") {
        if (decodeURIComponent(pair[1]) == 'undefined' || decodeURIComponent(pair[1]).length <= 0) {
          query_string[pair[0]] = null;
        } else {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
        }
      }
    }
    return query_string;
  }
  return {};
}

/* procedure to redirect to a page */
function redirectToPage(page) {
  window.location = page;
}

function showAlert(type, text) {
  alert(text)
}

function showPageLoader() {
  $('.page-preloader').addClass('show-preloader');
}

function hidePageLoader() {
  $('.page-preloader').removeClass('show-preloader');
}

/* Global functions - END */

function medicalanswers() {
  /* what user assigns multiple answers in each question?
      we will store answers in an array under users node.
  */
  var user = {};
  user['symptom'] = $("[name='symptom']").val();
  user['start'] = $("[name='start']").val();
  user['whatmedication'] = $("[name='whatmedication']").val(); //this  contains subanswer
  user['medicationproblems'] = $("[name='medicationproblems']").val();
  user['allergies'] = $("[name='allergies']").val();
  user['medicalcondition'] = $("[name='medicalcondition']").val();
  user['message'] = $("[name='message']").val();


  console.log(user);

  var userRef = firebase.database().ref('user');
  var newUserRef = userRef.push();
  newUserRef.set(user);
  var path = newUserRef.toString();
  console.log(path);
}

function appointment() {
  var user = {};
  user['date'] = $("[name='date']").val();
  user['time'] = $("[name='time']").val();


  console.log(user);

  var userRef = firebase.database().ref('user');
  var newUserRef = userRef.push();
  newUserRef.set(user);
  var path = newUserRef.toString();
  console.log(path);
}

function order() {
  var user = {};
  user['drug'] = $("[name='drug']").val();
  user['deliverymethod'] = $("[name='deliverymethod']").val();


  console.log(user);

  var userRef = firebase.database().ref('user');
  var newUserRef = userRef.push();
  newUserRef.set(user);
  var path = newUserRef.toString();
  console.log(path);
}


function billing() {
  /* I want the question forms to automatically assign answers from registration
    To do this we will get the user data by a firebase call, then fetch the data and use:
    $("[name='firstname']").val(user.firstname) --> Anissa: how?
  */
  var user = {};
  user['firstname'] = $("[name='firstname']").val();
  user['lastname'] = $("[name='lastname']").val();
  user['addressline1'] = $("[name='addressline1']").val();
  user['addressline2'] = $("[name='addressline2']").val();
  user['city'] = $("[name='city']").val();
  user['country'] = $("[name='country']").val();
  user['postcode'] = $("[name='postcode']").val();
  user['mobilephone'] = $("[name='mobilephone']").val();
  user['email'] = $("[name='email']").val();

  console.log(user);

  var userRef = firebase.database().ref('user');
  var newUserRef = userRef.push();
  newUserRef.set(user);
  var path = newUserRef.toString();
  console.log(path);
}

function paymentmethod() {
  /* what if user assigns multiple answers in each question?
    welll use array to store the data --> Anissa: how?
  */
  var user = {};
  user['paypal'] = $("[name='paypal']").val();
  user['stripe'] = $("[name='stripe']").val();


  console.log(user);

  var userRef = firebase.database().ref('user');
  var newUserRef = userRef.push();
  newUserRef.set(user);
  var path = newUserRef.toString();
  console.log(path);
}

function invoice() {
  /* what if user assigns multiple answers in each question?
    - Array
  */
  var user = {};
  user['number'] = $("[name='number']").val();
  user['date'] = $("[name='date']").val();
  user['product'] = $("[name='product']").val();
  user['quantity'] = $("[name='quantity']").val();
  user['subtotal'] = $("[name='subtotal']").val();
  user['tax'] = $("[name='tax']").val();
  user['total'] = $("[name='total']").val();


  console.log(user);

  var userRef = firebase.database().ref('user');
  var newUserRef = userRef.push();
  newUserRef.set(user);
  var path = newUserRef.toString();
  console.log(path);
}
