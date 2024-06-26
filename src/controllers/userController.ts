import { Request, Response } from 'express';
import userService from '../services/userService';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {getAllUsers}
