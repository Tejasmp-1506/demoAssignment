const userModel = require("../models/userModel")
const validator = require("../validators/validator")


const createUser = async function(req, res){
    try{
       
        const userDetails = req.body
        const {fname, lname, email} = userDetails
        if(!(fname || lname || email )){
            return res.status(400).send({status : false, msg : "Please provide all required details"})
        }

        if(!validator.isValid(fname || lname || email)){
            return res.status(400).send({status : false , msg : "Please fill all the blanks carefully"})
        }

        if (!validator.isValidName(fname)) {
            return res.status(400).send({ status: false, msg: "please provide valid first name" });
        }

        if (!validator.isValidName(lname)) {
            return res.status(400).send({ status: false, msg: "please provide valid last name" });
        }

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "please provide valid email id" });
        }

        const duplicateEmail = await userModel.findOne({ email: email });
    
        if (duplicateEmail) {
            return res.status(400).send({status: false,msg: "email id already exist. Please provide another email id",});
        }


        const finalDetails = {fname , lname , email}

        const savedDetails = await userModel.create(finalDetails);

        return res.status(201).send({status : true, msg : "User created successfully" , data : savedDetails})
    }
    catch(err){
        return res.status(500).send({status : false, msg : err.message})
    }
}


module.exports = { createUser }

