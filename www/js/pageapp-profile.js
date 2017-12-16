// $(loadProfilePage())
// $(window).load(loadProfilePage());
$(document).ready(setTimeout(function() {
  showPageLoader();
  loadProfilePage();
  hidePageLoader();
}, 0));

/**
 * loadProfilePage() - to load profile data in the profile page
 * @type {[type]}
 */
function loadProfilePage() {
  showPageLoader();
  // get user data from localStorage
  var userData = {
    firstname: getLocalData('firstname'),
    lastname: getLocalData('lastname'),
    dateofbirth: getLocalData('dateofbirth'),
    nricidnumber: getLocalData('nricidnumber'),
    email: getLocalData('email'),
    password: getLocalData('password'),
    mobilephone: getLocalData('mobilephone'),
    addressline1: getLocalData('addressline1'),
    addressline2: getLocalData('addressline2'),
    city: getLocalData('city'),
    country: getLocalData('country'),
    postcode: getLocalData('postcode')
  };

  for (var key in userData) {
    $("input[name='" + key + "']").val(userData[key]);
  }
  hidePageLoader();
}


/**
 * updateProfileData() - to update the data of user profile
 * @return {[type]} [description]
 */
function updateProfileData() {
  showPageLoader();
  let error = [];

  /* Checking if some required fields are undefined like firstname */
  if (typeof $("[name='firstname']").val() == 'undefined' || $("[name='firstname']").val().length <= 0) {
    /* If some field is not defined - populate it in error variable */
    error.push('First name is necessary.');
  }
  if (typeof $("[name='lastname']").val() == 'undefined' || $("[name='lastname']").val().length <= 0) {
    error.push('Last name is necessary.');
  }
  if (typeof $("[name='dateofbirth']").val() == 'undefined' || $("[name='dateofbirth']").val().length <= 0) { /* age must be 17+ */
    error.push('Date of birth is necessary.');
  } else {
    /* Check - Age < 17 : show error */
    birthday = new Date($("[name='dateofbirth']").val());
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 17) {
      error.push("You need to be 17 years or older to register.");
    }
  }
  if (typeof $("[name='email']").val() == 'undefined' || $("[name='email']").val().length <= 0) { /*this email is already in use */
    error.push('email is necessary.');
  }
  // if (typeof $("[name='password']").val() == 'undefined' || $("[name='password']").val().length <= 0) { /*password must be strong */
  //   error.push('password is necessary.');
  // }
  /* Checking if some required fields are undefined like firstname */
  if (typeof $("[name='nricidnumber']").val() == 'undefined' || $("[name='nricidnumber']").val().length <= 0) {
    error.push('nricid number is necessary.');
  }
  if (typeof $("[name='addressline1']").val() == 'undefined' || $("[name='addressline1']").val().length <= 0) {
    error.push('address line 1 is necessary.');
  }
  if (typeof $("[name='city']").val() == 'undefined' || $("[name='city']").val().length <= 0) {
    error.push('city is necessary.');
  }
  if (typeof $("[name='country']").val() == 'undefined' || $("[name='country']").val().length <= 0) {
    error.push('country is necessary.');
  }
  if (typeof $("[name='postcode']").val() == 'undefined' || $("[name='postcode']").val().length <= 0) {
    error.push('Post code is necessary.');
  }
  if (typeof $("[name='mobilephone']").val() == 'undefined' || $("[name='mobilephone']").val().length <= 0) {
    error.push('Mobile phone is necessary.');
  }




  var user = {}

  /* check if error variable is empty: empty means no error(oll fields are defined) - else there are some fields empty*/
  if (error.length <= 0) {
    user['firstname'] = $("[name='firstname']").val();
    user['lastname'] = $("[name='lastname']").val();
    user['dateofbirth'] = $("[name='dateofbirth']").val();
    user['email'] = $("[name='email']").val();
    userPassword = $("[name='password']").val();
    user['nricidnumber'] = $("[name='nricidnumber']").val();
    user['addressline1'] = $("[name='addressline1']").val();
    user['city'] = $("[name='city']").val();
    user['country'] = $("[name='country']").val();
    user['postcode'] = $("[name='postcode']").val();
    user['mobilephone'] = $("[name='mobilephone']").val();

    // console.log(user);
    var tempFlag = '';

    for (var key in user) {
      if (typeof user[key] == 'undefined') {
        user[key] = '';
      }
    }

    /* Add user data to teh users node with the user uid */
    var userRef = firebase.database().ref().child('users/' + getLocalData('uid'));
    userRef.update(user, function(error) {
      if (error) {
        hidePageLoader();
        console.log(error);
      } else {
        console.log("success");
        /* Add the data to localStorage */
        for (var key in user) {
          setLocalData(key, user[key]);
          // console.log(key, getLocalData(key));
        }
        hidePageLoader();
        window.location = "pageapp-profile.html";
      }
      hidePageLoader();
    });
    // var path = userRef.toString();

  } else {
    hidePageLoader();
    console.log(error);
    alert(error);
  }
}


function updateProfilePassword() {
  console.log('request to update password.');
}
