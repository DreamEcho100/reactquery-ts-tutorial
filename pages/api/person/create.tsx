import { NextApiRequest, NextApiResponse } from 'next';
import { IPerson } from '@src/lib/interfaces/IPerson';

const api = (req: NextApiRequest, res: NextApiResponse<IPerson>): void => {
	const data: IPerson = JSON.parse(req.body);
	res.status(200).json(data);
};

export default api;
