
const User = require('../models/user.model');


exports.getMyProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user })

    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
    }
}


exports.updateMyProfile = async (req, res) => {

    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.alternateNumber = req.body.alternateNumber || user.alternateNumber;
        user.address = req.body.address || user.address;

        await user.save();

        return res.status(200).json({ message: 'Profile updated', user })

    } catch (err) {
        return res.status(500).json({ message: 'Failed to update profile', error: err.message });
    }
}



exports.getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select('-password');

        if (users.length === 0) {
            return res.status(404).json({ message: 'No useres found' });
        }

        return res.status(200).json({ users })

    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
}



exports.getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user })

    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
}


exports.updateUser = async (req, res) => {

    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        await user.save();

        return res.status(200).json({ message: 'User updated', user })

    } catch (err) {
        return res.status(500).json({ message: 'Failed to update user', error: err.message });
    }
}



exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted' })

    } catch (err) {
        return res.status(500).json({ message: 'Failed to deleted user', error: err.message });
    }
}