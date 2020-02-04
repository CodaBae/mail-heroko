const config = require('config')
const express = require('express')
const router = express.Router()
const {User} = require('../../model/User')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

const validateFun = (req) => {
    const schema = {
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(6).required(),
    }
    return Joi.validate(req, schema)
}

router.post('/', async (req, res) => {
    const { error } = validateFun(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    let user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send('invalid email or password')

    const isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid) return res.status(400).send('invalid email or password')
const token = jwt.sign({_id: user._id}, 'mykey')
    res.send(token)
})

module.exports = router