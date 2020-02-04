const express = require('express');
const router = express.Router();
const {Smtp,validateFun} = require('../../model/Smtp');
const {auth} = require('../../middleware/auth')


router.get('/',auth, async (req, res) => {
    const result = await Smtp.find()
    res.send(result)
})

router.post('/',auth, async (req, res) => {
    const { error } = validateFun(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const smtp = new Smtp({
        smtpUrl: req.body.smtpUrl,
        smtpPassword: req.body.smtpPassword,
        smtpEmail: req.body.smtpEmail,
    })
    const result = await smtp.save()
    res.send(result)
})


router.put('/:id',auth, async (req, res) => {
    const { error } = validateFun(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const smtp = await Smtp.findByIdAndUpdate(req.params.id, {
        smtpUrl: req.body.smtpUrl,
        smtpPassword: req.body.smtpPassword,
        smtpEmail: req.body.smtpEmail,
    }, { new: true })

    if (!smtp) return res.status(404).send('user with id not found')

    res.send(smtp)
})

router.delete('/:id',auth, async (req, res) => {
    // const result = await User.deleteOne({ _id: id })
    const smtp = await Smtp.findByIdAndRemove(req.params.id)
    if (!smtp) return res.status(404).send('user with id not found')
    res.send(smtp)
})


  module.exports = router;