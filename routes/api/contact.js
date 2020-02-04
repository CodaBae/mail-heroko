const express = require('express')
const router = express.Router()
const {Contact,validateFun} = require('../../model/Contact')
const {auth} = require('../../middleware/auth')

router.get('/', auth, async (req, res) => {
    const contact = await Contact.find()
    res.send(contact)
})

router.get('/me', auth, async (req, res) => {
    const contact = await Contact.findById(req.user._id)
    if (!contact) return 'user with id doesnt exist'
    res.send(contact)
})

router.post('/me', auth, async (req, res) => {
    const { error } = validateFun(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    user = req.user._id
    const contact = {
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        location: req.body.location,
        des: req.body.des,
        user
    }
    try {
        // Using upsert option (creates new doc if no match is found):
        let contact1 = await Contact.findOneAndUpdate(
          { user: req.user._id },
          { $set: contact },
          { new: true, upsert: true }
        );
        res.json(contact1);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    
})

router.delete('/:id',auth, async (req, res) => {
    // const result = await User.deleteOne({ _id: id })
    const result = await Contact.findByIdAndRemove(req.params.id)
    if (!result) return res.status(404).send('user with id not found')
    res.send(result)
})
module.exports = router;