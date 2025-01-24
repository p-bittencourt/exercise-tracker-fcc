import { Exercise } from './exercise';

export interface User {
  username: string;
  count: number;
  id: string;
  log: Exercise[];
}
