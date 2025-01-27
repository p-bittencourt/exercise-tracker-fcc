import { Application, Request, Response } from 'express';
import { v4 } from 'uuid';
import { User } from './types/users';
import { Exercise } from './types/exercise';

const users: User[] = [];

export const createRoutes = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/views/index.html');
  });

  app.get('/api/users', (req: Request, res: Response) => {
    const output = users.map(
      (user) => `"_id:${user._id}, "username":${user.username}`
    );
    res.send(output);
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

    const username = getUserName(_id);

    if (!username) {
      res.json({ error: 'User not found' });
      return;
    }

    const exercise: Exercise = {
      description,
      duration: parseInt(duration),
      date: exerciseDate,
    };
    addExercise(_id, exercise);

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
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;
      const limit = req.query.limit as string | undefined;

      const user = findUser(_id);
      if (!user) {
        res.json({ error: 'User not found ' });
        return;
      }

      const logs = getUserLogs(user, from, to, limit);

      res.json({
        username: user.username,
        count: user.count,
        _id: user._id,
        log: logs,
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
) => {
  let logs = user.log;
  if (from) {
    logs = logs.filter((log) => {
      const logDate = new Date(log.date);
      const fromDate = new Date(from);
      if (logDate > fromDate) return log;
    });
  }
  if (to) {
    logs = logs.filter((log) => {
      const logDate = new Date(log.date);
      const toDate = new Date(to);
      if (logDate < toDate) return log;
    });
  }
  if (limit) {
    const intLimit = parseInt(limit);
    logs.length > intLimit ? (logs = logs.slice(0, intLimit)) : logs;
  }
  return logs;
};
