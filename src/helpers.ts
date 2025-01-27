import { users } from './routes';
import { Exercise } from './types/exercise';
import { User } from './types/users';

export const addExercise = (id: string, exercise: Exercise): void => {
  const user = findUser(id);
  if (user) {
    user.count += 1;
    user.log.push(exercise);
  }
};

export const findUser = (id: string): User | undefined => {
  return users.find((user) => user._id === id);
};

export const getUserName = (id: string): string | undefined => {
  const user = findUser(id);
  return user?.username;
};

export const getUserLogs = (
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
