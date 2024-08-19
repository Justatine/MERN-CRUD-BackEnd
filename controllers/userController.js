const User = require('../models/userModel')
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
    try {
        console.log('Fetching users from the database...');
        const users = await User.find();
        console.log('Users fetched:', users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
}

const createUser = async (req, res) => {

}

const updateUser = async (req, res) => {
    const { id } = req.params;
}

const archiveUser = async (req, res) => {
    const { id } = req.params;
}

const loginUser = async (req, res) => {

}

module.exports = {
    getUser,
    getUsers,
    createUser,
    updateUser,
    archiveUser,
    loginUser
};