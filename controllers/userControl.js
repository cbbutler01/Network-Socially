const { User, Thought } = require('../models');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find({})
                .populate({
                    path: 'friends',
                    select: '-__v',
                })
                .select('-__v')
                .sort({ _id: -1 })

            res.json(users)
        } catch (err) {
            console.error(err);
            return res.status(500).json(err)
        }
    },
    async getOneUser({ params }, res) {
        try {
            const user = await User.findById({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
                if(!user) {
                    return res.status(404).json({ message:'No user found!' })
                }
                res.json(user)
        } catch (err) {
            console.error(err)
            return res.status(500).json(err)
        }
    },
    async createUser({ body }, res) {
        try {
            const user = await User.create(body)
            res.json(user)
        } catch (err) {
            console.error(err)
            return res.status(500).json(err)
        }
    },
    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new:true,
                runValidators: true
            })
            if(!user) {
                return res.status(404).json({ message: 'No user found!' });
            }
            res.json({ message: 'User updated successfully', user} )
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete(req.params.id);
    
            if (!user) {
                return res.status(404).json({ message: 'No user found!' });
            }
    
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
    
            res.json({ message: 'User and associated thoughts deleted successfully', user });
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    async addFriend({ params}, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: params.userId },
                { $addToSet: { friends: params.friendId } },
                { new: true, runValidators: true }
            )

            if (!user) {
                return res.status(404).json({ message: 'No user found!' });
            }

            res.json({ message: 'Friend added successfully!', user })
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    async deleteFriend({ params }, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { friends: params.friendId } },
                { new: true }
            )

            if(!user) {
                return res.status(404).json({ message: 'No user found!' });
            }

            res.json(user)
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }
}
