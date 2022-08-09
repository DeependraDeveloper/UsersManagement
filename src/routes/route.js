const express=require('express');
const router=express.Router()
const controller=require("../controllers/userController")
const {Auth}=require("../middleware/auth")


router.post("/register",controller.registerUser)
router.post("/login",controller.login);
router.get("/user/:id",Auth,controller.getProfile);
router.patch("/user/:id",Auth,controller.updateUserProfile);
router.delete("user/:id",Auth,controller.deleteProfile);


module.exports=router;