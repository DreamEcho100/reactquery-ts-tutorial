import { ITodo } from '../../src/lib/interfaces/ITodo';
import { NextApiRequest, NextApiResponse } from 'next';

const api = (_req: NextApiRequest, res: NextApiResponse<ITodo>): void => {
  res.status(200).json({ message: 'I am a todo' });
};

export default api;
