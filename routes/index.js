
/*
 * GET home page.
 */


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.message = function(req, res){
    res.render('message', { title: 'Hello, World!' });
};

exports.auth = function(req, res){
    res.render('auth', { title: 'Login/Signup' });
};

exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('usercollection');
        collection.find({}, {}, function(e, docs){
            res.render('userlist', {
                "userlist": docs
            });
        });
    };
};

exports.login = function(db){
    return function(req, res){
      
        // Get our form values. These rely on the "name" attributes
        var email = req.body.email;
        var password = req.body.password;
 
        // Set our collection
        var collection = db.get('usercollection');
	
        // Get data from database
        collection.find({"email" : email, "password" : password}, {}, function(e, docs){

            if (docs.length > 0){
                console.log('doc received...');
		req.session.user_id = docs[0]._id;
		res.render('message', { title: docs[0].name });
		res.location('message');
            }else{
		res.render('message', { title: 'Login Failed' });
		res.location('message');
            }
        });
    }
};

exports.signup = function(db){
    return function(req, res){
      
        // Get our form values. These rely on the "name" attributes
        var name = req.body.name;
        var user = req.body.email
        var password = req.body.password
        var mobile = req.body.mobile
        var company = req.body.company
        var location = req.body.location
 
        // Set our collection
        var collection = db.get('usercollection');

        // Submit to the DB
        collection.insert({
            "name" : name,
            "email" : email,
            "password" : password,
            "mobile" : mobile,
            "company" : company,
            "location" : location
        }, function (err, doc){
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }else {
                // If it worked, forward to success page
                res.redirect("userlist");
                // And set the header so the address bar doesn't still say /adduser
                res.location("userlist");
            }
        });
    }
};
