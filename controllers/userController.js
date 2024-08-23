const User = require('../models/userModel')
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users) {
            res.status(200).json({ data:users });
        }else{
            res.status(404).json({ data:'No users found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const userinfo = await User.findOne({ _id:id })
        if (userinfo) {
            res.status(200).json({ data:userinfo });
        } else {
            res.status(404).json({ data:'No data found' });
        }
        // Find a user by ID -> const user = await User.findById('someuserid');
        // Find one user by a specific field -> const user = await User.findOne({ email: 'john@example.com' });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching user info', error:error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const { firstname, lastname, idno, image, password, role, username } = req.body;
        const newUser  = await User.create({
            firstname: firstname,
            lastname: lastname,
            idno: idno,
            image: image,
            password: password,
            role: role,
            username: username,
        });
        res.status(200).json({ message: 'User Saved', status: 'success', user: newUser });

    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, idno, image, password, role, username } = req.body;

        const updateUser = await User.updateOne({ _id:id }, { $set: { firstname:firstname, lastname:lastname, idno:idno, image:image, password:password, role:role, username:username }})

        // console.log('find id', id)
        //  can use modifiedCount or matchedCount

        if (updateUser.modifiedCount > 0) {
            res.status(200).json({ status: 'success', message: 'User updated successfully' });
        } else {
            res.status(404).json({ status: 'failed', message: 'User not found or nothing to update' });
        }

        // Using find ID
        // const updateUser = await User.findByIdAndUpdate(id, { lastname: 'Smith' }, { new: true });

    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

const archiveUser = async (req, res) => {
    try {
        const { id } = req.body;
        const deleteUser = await User.deleteOne({ _id:id });
        // Delete a user by ID -> const deletedUser = await User.findByIdAndDelete(id);

        if (deleteUser) {
            res.status(200).json({ status: 'success', message: 'User deleted successfully'});
        }        
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Error deleting user', error: error.message });
    }
}

module.exports = {
    getUser,
    getUsers,
    createUser,
    updateUser,
    archiveUser
};