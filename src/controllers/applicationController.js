const applicationModel = require("../models/applicationModel")
const validator = require("../validators/validator")



const createApplication = async function(req, res){
    try{
       
        const appDetails = req.body
        const {name, age, email , phone , qualification, city} = appDetails
        if(!(name || age || email || phone || qualification || city)){
            return res.status(400).send({status : false, msg : "Please provide all required details"})
        }

        if(!validator.isValid(name || age || email || phone || qualification || city)){
            return res.status(400).send({status : false , msg : "Please fill all the blanks carefully"})
        }

        if (!validator.isValidName(name)) {
            return res.status(400).send({ status: false, msg: "please provide valid first name" });
        }

        if (!validator.isValidDigit(age)) {
            return res.status(400).send({ status: false, msg: "please provide valid age" });
        }

        if (!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, msg: "please provide valid phone number" });
        }
      
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "please provide valid email id" });
        }


        const duplicatePhone = await applicationModel.findOne({ phone: phone });

        if (duplicatePhone) {
            return res.status(400).send({status: false,msg: "phone no already exist. Please provide another phone no" });
        }

        const duplicateEmail = await applicationModel.findOne({ email: email });
    
        if (duplicateEmail) {
            return res.status(400).send({status: false,msg: "email id already exist. Please provide another email id",});
        }


        const finalDetails = {name, age, email , phone , qualification, city}

        const savedDetails = await applicationModel.create(finalDetails);

        return res.status(201).send({status : true, msg : "application created successfully" , data : savedDetails})
    }
    catch(err){
        return res.status(500).send({status : false, msg : err.message})
    }
}




module.exports= {createApplication}