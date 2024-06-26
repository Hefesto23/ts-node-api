import User from '../models/userModelMysql';

export const getAllUsers = async (): Promise<User[]> => {
  try {
    console.log('findAll called');
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error('Error in findAll:', error);
    throw error;
  }
};

export default { getAllUsers };
