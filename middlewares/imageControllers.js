
const images = require("../models/images");
const fs = require("fs");
const path = require("path");
const  User  = require("../models/user");
const  admin  = require("../models/admin");

exports.userAddProfileImage = async(req, res) =>{

    try {
        var obj = {
            img: {
                data: fs.readFileSync(path.join(__dirname,'../uploads/' + req.file.filename)),
                contentType : "image/png"
            }
    }
        const id = await images.create(obj)
        fs.unlinkSync(path.join(__dirname,'../uploads/' + req.file.filename ))
        const imgUrl = `${process.env.ORIGIN_URL}/img/${id._id}`
        User.updateOne({email:req.email},{profile_image:imgUrl})
        res.send(id._id)
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}


exports.adminAddProfileImage = async(req, res) =>{

    try {
        var obj = {
            img: {
                data: fs.readFileSync(path.join(__dirname,'../uploads/' + req.file.filename)),
                contentType : "image/png"
            }
    }
        const id = await images.create(obj)
        fs.unlinkSync(path.join(__dirname,'../uploads/' + req.file.filename ))
        const imgUrl = `${process.env.ORIGIN_URL}/img/${id._id}`
        admin.updateOne({email:req.email},{profile_image:imgUrl})
        res.send(id._id)
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

exports.preview = async(req, res) => {
    try{
        const _id = req.params._id
        const image = await images.findOne({_id})
         res.send(image.img.data)
        }
        catch(e){
            res.send(
                'enter query is not correct'
            )
        }
}