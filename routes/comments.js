var express= require("express"),
	router= express.Router({mergeParams:true}),
	Campground= require("../models/campground"),
	Comment= require("../models/comment"),
	middleware= require("../middleware");
// comments new

router.get("/new", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new",{campground:campground});
		}
	});
});
// comments create
router.post("/", middleware.isLoggedIn, function(req,res){
	// look up campground using id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else{
			Comment.create(req.body.comment,function(err,comment){
					// add username and add to comment
					comment.author.id= req.user._id;
					comment.author.username= req.user.username;
					// Save Comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Sucessfully created a comment. Good job!")
					res.redirect("/campgrounds/"+campground._id)
			});
		}
	});
});
// Edit Route

router.get("/:comment_id/edit",middleware.checkCommentOwner,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit",{campgroundId:req.params.id, comment:foundComment});
		}
	})
});

// Update Route
router.put("/:comment_id",middleware.checkCommentOwner,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

// Destroy route
router.delete("/:comment_id",middleware.checkCommentOwner,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success","Deleted comment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});



module.exports=router;