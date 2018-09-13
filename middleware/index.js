var Campground= require("../models/campground");
var Comment= require("../models/comment");


var middlewareObj= {

};


middlewareObj.checkOwner=function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
				if(err){
					res.redirect("back")
				} else {
				// Does user own campground	
				if(foundCampground.author.id.equals(req.user._id)){
					next();
					} else {
						req.flash("error", "you don't have permission to do that, silly...")
						res.redirect("back")
						}
					}
				});
	} else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back")
	}
		}

middlewareObj.checkCommentOwner=function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err){
					res.redirect("back");
				} else {
				// Does user own comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
					} else {
						req.flash("That is not your comment to change...")
						res.redirect("back")
						}
					}
				});
			} else{
				req.flash("error","You need to be logged in to do that");
				res.redirect("back");
			}
		}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that.")
	res.redirect("/login");
}

module.exports=middlewareObj