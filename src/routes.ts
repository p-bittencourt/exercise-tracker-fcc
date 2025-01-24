import { Application, Request, Response } from 'express';
import { v4 } from 'uuid';
import { User } from './types/users';
import { Exercise } from './types/exercise';

const users: User[] = [];

export const createRoutes = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/views/index.html');
  });

  app.post('/api/users', (req: Request, res: Response) => {
    const username = req.body.username;
    const _id = v4();

    const newUser: User = {
      username,
      count: 0,
      _id,
      log: [],
    };

    users.push(newUser);
    res.json({
      username,
      _id,
    });
  });

  app.post('/api/users/:_id/exercises', (req: Request, res: Response) => {
    const _id = req.params._id;
    const { description, duration, date } = req.body;
    let exerciseDate;
    if (date) {
      exerciseDate = new Date(date).toDateString();
    } else {
      exerciseDate = new Date().toDateString();
    }

    const exercise: Exercise = { description, duration, date: exerciseDate };
    addExercise(_id, exercise);

    const username = getUserName(_id);

    res.json({
      username,
      description,
      duration,
      exerciseDate,
      _id,
    });
  });

  app.get('/api/users/:_id/logs', (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const { from, to, limit } = req.query;

      const user = findUser(_id);
      if (!user) {
        res.json({ error: 'User not found ' });
      }

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

const addExercise = (id: string, exercise: Exercise): void => {
  const user = findUser(id);
  if (user) {
    user.count += 1;
    user.log.push(exercise);
  }
};

const findUser = (id: string): User | undefined => {
  return users.find((user) => user._id === id);
};

const getUserName = (id: string): string | undefined => {
  const user = findUser(id);
  return user?.username;
};

const getUserLogs = (
  user: User,
  from?: string,
  to?: string,
  limit?: string
) => {};
