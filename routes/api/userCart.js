const express = require('express')
const router = express.Router()
const { UserCart } = require('../../model/UserCart')
const {auth} = require('../../middleware/auth')

router.get('/', async (req, res) => {
    const result = await UserCart.find()
    res.send(result)
})
router.get('/me', async (req, res) => {
    const userCart = await UserCart.findOne({ user: req.user._id }).populate(
        'user',
        ['name']
    );
    if (!userCart) {
        return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(userCart);
})

router.post('/', async (req, res) => {
    userCart = new UserCart(_.pick(req.body, ['body']))
    await userCart.save()
    res.send(userCart)
})

router.delete('/:id', auth, async (req, res) => {
    const result = await UserCart.findByIdAndRemove(req.params.id)
    if (!result) return res.status(404).send('user with id not found')
    res.send(result)
})
module.exports = router