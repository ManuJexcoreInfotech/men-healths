/*
  You will have to trigger these functions from the html pages
  like in poge pageapp-login.html line 74:
  onclick="login()" in the anchor tags
 */
function login() {
  showPageLoader();
  /* login with email and password only */
  var user = {};
  user['email'] = $("[name='email']").val();
  user['password'] = $("[name='password']").val();

  var tempFlag = '';
  /* Sign in with firebase */
  firebase.auth().signInWithEmailAndPassword(user['email'], user['password']).then(function(fbUser) {
    tempFlag = fbUser.uid;
    console.log('uid: ' + tempFlag);
    /* Login success - now retrieve user data */
    if (tempFlag != '') {
      firebase.database().ref('/users/' + fbUser.uid).once('value').then(function(snapshot) {
        var userData = snapshot.val();
        userData['uid'] = fbUser.uid;
        /* Store the user's data in local storage - needed to check if user is logged in on other pages. */
        for (var key in userData) {
          setLocalData(key, userData[key]);
          console.log(key, getLocalData(key));
        }

        if ('city' in userData && 'country' in userData && 'mobilephone' in userData) {
          hidePageLoader();
          window.location = "home.html";
        } else {
          hidePageLoader();
          window.location = "pageapp-register-2.html";
        }

      });
    }

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    // Log errors is some found in authentication
    hidePageLoader();
    console.log(errorCode);
    console.log(errorMessage);
    alert(errorMessage);
  });

  // This piece of code was not working
  // /* fetch user data on login successful */
  // firebase.auth().onAuthStateChanged(firebaseUser => {
  //   if (tempFlag != '') {
  //     firebase.database().ref('/users/' + firebaseUser.uid).once('value').then(function(snapshot) {
  //       var userData = snapshot.val();
  //       userData['uid'] = firebaseUser.uid;
  //       /* Store the user's data in local storage - needed to check if user is logged in on other pages. */
  //       for (var key in userData) {
  //         setLocalData(key, userData[key]);
  //         console.log(getLocalData(key));
  //       }
  //       window.location = "home.html";
  //
  //     });
  //   }
  // });


}

/**
 * This would be called to register the user
 * - will create the user with data provided initially
 * @return {[type]} [description]
 */
function register() {
  showPageLoader();
  // Initialise empty array 'error'
  let error = [];

  /* Checking if some required fields are undefined like firstname */
  if (typeof $("[name='firstname']").val() == 'undefined') {
    /* If some field is not defined - populate it in error variable */
    error.push('First name is necessary.');
  }
  if (typeof $("[name='lastname']").val() == 'undefined') {
    error.push('Last name is necessary.');
  }
  if (typeof $("[name='dateofbirth']").val() == 'undefined') { /* age must be 17+ */
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
  if (typeof $("[name='email']").val() == 'undefined') { /*this email is already in use */
    error.push('email is necessary.');
  }
  if (typeof $("[name='password']").val() == 'undefined') { /*password must be strong */
    error.push('password is necessary.');
  } else if (typeof $("[name='repeatpassword']").val() == 'undefined') { /* i just added this. is it necessary? */
    error.push('password is necessary.');
  } else if ($("[name='password']").val() != $("[name='repeatpassword']").val()) {
    /* Check - If passwords match */
    error.push('Passwords are different');
  }


  /* what if Address 2 is not mandatory? Should we put a special code in this line?
    Not included Address 2 in above set of if else statements
  */
  var user = {}

  /* check if error variable is empty: empty means no error(oll fields are defined) - else there are some fields empty*/
  if (error.length <= 0) {
    user['firstname'] = $("[name='firstname']").val();
    user['lastname'] = $("[name='lastname']").val();
    user['dateofbirth'] = $("[name='dateofbirth']").val();
    user['email'] = $("[name='email']").val();
    userPassword = $("[name='password']").val();
    // Should not add password to the database
    // user['password'] = $("[name='password']").val();
    // user['repeatpassword'] = $("[name='repeatpassword']").val();

    console.log(user);
    var userBk = user;
    var tempFlag = '';

    /* Add user to firebase users */
    firebase.auth().createUserWithEmailAndPassword(user['email'], userPassword).then(function(fbUser) {
      console.log(fbUser.uid);
      tempFlag = fbUser.uid;


    }).catch(function(error) {
      // Handle Errors here. - and provide relevent messages
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      hidePageLoader();
      alert(errorMessage);
      // ...
    });

    for (var key in user) {
      if (typeof user[key] == 'undefined') {
        user[key] = '';
      }
    }

    /* Add user data to teh users node with the user uid */
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (tempFlag != '') {
        //  ref.set({/*save something to a specific uid*/});
        // console.log('HI: ' + firebaseUser.uid);
        var userRef = firebase.database().ref().child('users/' + firebaseUser.uid);
        userRef.set(user, function(error) {
          if (error) {
            hidePageLoader();
            console.log(error);
          } else {
            console.log("success");
            hidePageLoader();
            window.location = "pageapp-login.html";
          }
        });
        var path = userRef.toString();
        console.log(path);
        // Redirect to register part 2 - Now login page - to support it
        // window.location = "pageapp-login.html";
        // alert('Success! please login.');
      }
    });

  } else {
    hidePageLoader();
    console.log(error);
    alert(error);
  }




}

/**
 * This functio is to save the second part of the user data
 * - Not using it now - will in later section
 * @return {[type]} [description]
 */
function registerTwo() { // I want the answers to be reflected in profile section
  // Initialise empty array 'error'
  showPageLoader();
  let error = [];

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

  /* what if Address 2 is not mandatory? Should we put a special code in this line?
    Not included Address 2 in above set of if else statements
  */
  var user = {}

  /* check if error variable is empty: empty means no error(oll fields are defined) - else there are some fields empty*/
  if (error.length <= 0) {
    user['nricidnumber'] = $("[name='nricidnumber']").val();
    user['addressline1'] = $("[name='addressline1']").val();
    user['city'] = $("[name='city']").val();
    user['country'] = $("[name='country']").val();
    user['postcode'] = $("[name='postcode']").val();
    user['mobilephone'] = $("[name='mobilephone']").val();

    console.log(user);
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
          console.log(key, getLocalData(key));
        }
        hidePageLoader();
        window.location = "home.html";
      }
    });
    // var path = userRef.toString();

  } else {
    hidePageLoader();
    console.log(error);
    alert(error);
  }




}
