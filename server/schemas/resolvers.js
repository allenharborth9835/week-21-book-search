//this file sets up the functions
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  //query that shows the user info
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
    //mutation that adds a user using args
    addUser: async (parents, args) =>{
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user};
    },

    //mutation to login that brings in args as email and password
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

    //takes in book data and adds it to users saved books
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

    //takes in book id and removes book from users saved books
    removeBook: async (parents, args, context) =>{
      if(context.user){
        const UpdatedUser = await User.findByIdAndUpdate(
          {_id: context.user._id},
          {$pull: {savedBooks: {bookId: args.bookId}}},
          {new: true, runValidators: true}
        );
        return UpdatedUser;
      }
      throw new AuthenticationError('you need to be logged in')
    },
  },
};

module.exports = resolvers;