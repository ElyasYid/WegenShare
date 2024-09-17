const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
    try{
        const { username, email, password } = req.body

        const user = new User({ username, email, password })
        await user.save()

        res.status(201).json({ message: 'User created successfuly', user })
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error })
    }
}