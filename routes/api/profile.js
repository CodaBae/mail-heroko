const express = require('express');
const router = express.Router();
const {auth} = require('../../middleware/auth')
// Load Profile Model
const { Profile } = require('../../model/Profile');
// Load User Model
const { User } = require('../../model/User')

router.get('/', auth, async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
 });

router.get('/me', auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user._id }).populate(
        'user',
        ['name', 'avatar']
      );
  
      if (!profile) {
        return res.status(400).json({ msg: 'There is no profile for this user' });
      }
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
router.post('/me',auth, async (req, res) => {
    const {
        website,
        location,
        userInfo,
        status,
        number,
        skills,
        facebook,
        twitter,
        linkedin,
        handle
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user._id;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (userInfo) profileFields.userInfo = userInfo;
    if (status) profileFields.status = status;
    if (number) profileFields.number = number;
    if (handle) profileFields.handle = handle;

    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: profileFields },
          { new: true, upsert: true }
        );
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
})

router.get('/user/:user_id', async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.params.user_id
      }).populate('user', ['name', 'avatar']);
  
      if (!profile) return res.status(400).json({ msg: 'Profile not found' });
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Profile not found' });
      }
      res.status(500).send('Server Error');
    }
  });


router.delete('/', auth, async (req, res) => {
    try {
    
      // Remove profile
      await Profile.findOneAndRemove({ user: req.user._id });
      // Remove user
      await User.findOneAndRemove({ _id: req.user._id });
  
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


module.exports = router;