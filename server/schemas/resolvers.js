const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) =>{
      if(context.user){
        const userData = await User.findOne({_id: context.user._id })
          .select('-__v -password');

        return userData;
      }
      throw new AuthenticationError('Not logged in');
    }
  },
  Mutation: {
    addUser: async (parents, args) =>{
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user};
    },

    login: async (parent, {email, password}) =>{
      const user = await User.findOne({ email });

      if(!user){
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if(!correctPw){
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parents, args, context) =>{
      if(context.user){
        const updatedUser = await User.findByIdAndUpdate(
          {_id: context.user._id},
          {$push: {savedBooks: args.bookData}},
          {new: true}
        );
        return updatedUser;
      }
      throw new AuthenticationError('you need to be logged in')
    },

    removeBook: async (parents, args, context) =>{
      if(context.user){
        const UpdatedUser = await User.findByIdAndUpdate(
          {_id: context.user._id},
          {$pull:{savedBooks: {bookId: args.bookData}}},
          {new: true, runValidators: true}
        );
        return UpdatedUser;
      }
      throw new AuthenticationError('you need to be logged in')
    },
  },
};

module.exports = resolvers;