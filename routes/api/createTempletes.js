const express = require('express')
const router = express.Router()
const { CreateTempletesSchema } = require('../../model/CreateTempletes')
const {auth} = require('../../middleware/auth')


router.get('/', async (req, res) => {
    const result = await CreateTempletesSchema.find()
    res.send(result)
})
router.get('/:id', async (req, res) => {
    const createTempletesSchema = await CreateTempletesSchema.findById(req.params.id)
    if (!createTempletesSchema) {
        return res.status(400).json({ msg: 'There is no templete for this user' });
    }

    res.json(createTempletesSchema);
})

router.post('/', async (req, res) => {
    createTempletesSchema = new CreateTempletesSchema(_.pick(req.body, ['body']))
    await createTempletesSchema.save()
    res.send(createTempletesSchema)
})

router.delete('/:id', auth, async (req, res) => {
    const result = await CreateTempletesSchema.findByIdAndRemove(req.params.id)
    if (!result) return res.status(404).send('templete with id not found')
    res.send(result)
})

module.exports = router