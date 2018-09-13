// Importing Libraries
var express		= require("express"),
	app			= express(),
	bodyParser	= require("body-parser"),
	mongoose	= require("mongoose"),
	flash		= require("connect-flash"),
	passport	= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	=require("method-override"),
	Campground 	= require("./models/campground"),
	Comment 	= require("./models/comment"),
	User		= require("./models/user"),
	seedDB		= require("./seeds");

var campgroundRoutes= require("./routes/campgrounds"),
	commentRoutes= require("./routes/comments"),
	indexRoutes= require("./routes/index");

// Config
mongoose.connect("mongodb://localhost/yelp_data");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");
// seedDB(); 
// Passport Config(for Authentication)
app.use(require("express-session")({
	secret:"Matt is the best",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// adding flash
app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(100, function(){
	console.log("Yelp Camp Server is ON!")
});

