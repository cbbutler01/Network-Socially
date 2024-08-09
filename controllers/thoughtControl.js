const { Thought, User } = require('../models');

module.exports = {
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find({})
                .populate({
                    path: 'reactions',
                    select: '-__v',
                })
                .select('-__v')
                .sort({ _id: -1 });
    
            res.json(thoughts);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    async getOneThought({ params }, res) {
        try {
            const thought = await Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
                if (!thought) {
                    return res.status(404).json({ message:'No thought found!' });
                }
                res.json(thought);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err)
        }
    },
    async createThought({params, body},res) {
        try {
            const thought = await Thought.create(body);
            const dbThoughtData = await User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
        
        
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'No user found!' });
            }

            res.json({ message: 'Thought created succesfully!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    async updateThought({ params, body }, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: params.id }, 
                body,
                {
                    new: true,
                    runValidators: true,
                }
            );

            if(!thought) {
                return res.status(404).json({ message: 'No thought found!'});
            }

            res.json(thought)
        } catch (err) {
            console.error(err)
            return res.status(500).json(err)
        }
    },
    async deleteThought({ params }, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: params.id });
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought found!' });
            }
    
            // Remove the thought from the associated user's thoughts array
            await User.findOneAndUpdate(
                { _id: thought.userId },
                { $pull: { thoughts: thought._id } },
                { new: true }
            );
    
            res.json({ message: 'Thought deleted successfully!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    async addReaction({ params, body }, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $addToSet: { reactions: body } },
                { new: true, runValidators: true }
            );
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id' });
            }
    
            res.json(thought);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    async removeReaction({ params }, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactions: { reactionId: params.reactionId } } },
                { new: true }
            );
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id' });
            }
    
            res.json(thought);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }
}