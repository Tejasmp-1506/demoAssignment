const adminModel = require("../models/adminModel")
const applicationModel = require("../models/applicationModel")
const validator = require("../validators/validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")




const createAdmin = async function(req, res){
    try{
       
        const {fName, lName, email , phone , password} = req.body
        if(!(fName || lName || email || phone || password)){
            return res.status(400).send({status : false, msg : "Please provide all required details"})
        }

        if(!validator.isValid(fName || lName || email || phone || password)){
            return res.status(400).send({status : false , msg : "Please fill all the blanks carefully"})
        }

        if (!validator.isValidName(fName)) {
            return res.status(400).send({ status: false, msg: "please provide valid first name" });
        }

        if (!validator.isValidName(lName)) {
            return res.status(400).send({ status: false, msg: "please provide valid last name" });
        }

        if (!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, msg: "please provide valid phone number" });
        }
      
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "please provide valid email id" });
        }

        if (!validator.isValidPassword(password)) {
            return res.status(400).send({status: false, msg: "please provide strong and valid password including eg. 'A-Z , a-z , 0-9 , @'",});
        }

        const duplicatePhone = await adminModel.findOne({ phone: phone });

        if (duplicatePhone) {
            return res.status(400).send({status: false,msg: "phone no already exist. Please provide another phone no" });
        }

        const duplicateEmail = await adminModel.findOne({ email: email });
    
        if (duplicateEmail) {
            return res.status(400).send({status: false,msg: "email id already exist. Please provide another email id",});
        }

        const encryptPassword = await bcrypt.hash(password, 10);

        const finalDetails = {fName, lName, email , phone , password : encryptPassword}

        const savedDetails = await adminModel.create(finalDetails);

        return res.status(201).send({status : true, msg : "admin created successfully" , data : savedDetails})
    }
    catch(err){
        return res.status(500).send({status : false, msg : err.message})
    }
}







const login = async function(req, res){
    try{
        const loginDetails = req.body

        if(!loginDetails){
          return res.status(400).send({status : false , msg : "Please provide login details"})
        }

        const {email , password} = loginDetails

        if(!(email || password)){
          return res.status(400).send({status : true , msg : "Please provide email and password"})
        }

        if(!validator.isValid(email || password)){
            return res.status(400).send({status : false , msg : "Please fill the blanks carefully"})
        }

        if (email && password) {
            let adminDetails = await adminModel.findOne({ email });
            if (!adminDetails) {
              return res.status(400).send({ status: false, msg: "user does not exist" });
            }

            let verifiedPass = await bcrypt.compare(password, adminDetails.password);
            if(verifiedPass){
                let payload = {_id : adminDetails._id};
                let token = jwt.sign(payload, "MySercetKey", {expiresIn : "300m"});
                return res.status(200).send({status : true , msg : "User login successfully" , data : token})
            }
            else{
                return res.status(400).send({status : false, msg : "Invalid password"})
            }
        }
    }
    catch(error){
        res.status(500).send({status : false, msg : err.message})
    }
}






const getApplicationDetails = async function(req, res){
    try{
          let qualification = req.query.qualification
          let city = req.query.city

          let data = {}
          
          if(qualification){
            let searchByqualification = await applicationModel.find({qualification : qualification})
            if(searchByqualification.length != 0){
                return res.status(200).send({status : false, data : searchByqualification})
            }else{
                res.status(404).send({status : false, msg : "application not found"})
            }
          }

          if(city){
            let searchBylcity = await applicationModel.find({city : city})
            if(searchBylcity.length != 0){
                return res.status(200).send({status : true, data : searchBylcity})
            }else{
                res.status(404).send({status : false, msg : "application not found"})
            }
          }


        let finalResult = await applicationModel.find({data})

        if(finalResult){
            res.status(200).send({status : true , data : finalResult})
        }else{
            res.status(404).send({status : false , msg : "No such application found"})
        }

    }catch(err){
        res.status(500).send({status : false , msg : err.message})
    }
  }







module.exports= {createAdmin, login , getApplicationDetails}