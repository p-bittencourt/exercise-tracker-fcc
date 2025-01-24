import { Exercise } from './exercise';

export interface User {
  username: string;
  count: number;
  _id: string;
  log: Exercise[];
}
