import { Application, Request, Response } from 'express';
import { v4 } from 'uuid';
import { User } from './types/users';

const users: User[] = [];

export const createRoutes = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/views/index.html');
  });

  app.post('/api/users', (req: Request, res: Response) => {
    const username = req.body.username;
    const id = v4();

    const newUser: User = {
      username,
      count: 0,
      id,
      log: [],
    };

    users.push(newUser);
    res.json(newUser);
  });

  app.get('/api/users/:_id/logs', (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const { from, to, limit } = req.query;

      res.json({
        _id,
        from,
        to,
        limit,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching exercise logs' });
    }
  });
};
