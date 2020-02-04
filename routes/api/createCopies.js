const express = require('express')
const router = express.Router()
const { CreateCopiesSchema } = require('../../model/CreateCopies')
const {auth} = require('../../middleware/auth')

router.get('/', async (req, res) => {
    const result = await CreateCopiesSchema.find()
    res.send(result)
})
router.get('/:id', async (req, res) => {
    const createCopiesSchema = await CreateCopiesSchema.findById(req.params.id)
    if (!createCopiesSchema) {
        return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(createCopiesSchema);
})

router.post('/', async (req, res) => {
    createCopiesSchema = new CreateCopiesSchema(_.pick(req.body, ['body']))
    await createCopiesSchema.save()
    res.send(createCopiesSchema)
})

router.delete('/:id', auth, async (req, res) => {
    const result = await CreateCopiesSchema.findByIdAndRemove(req.params.id)
    if (!result) return res.status(404).send('user with id not found')
    res.send(result)
})

module.exports = router