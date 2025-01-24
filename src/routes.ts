import { Application, Request, Response } from 'express';

export const createRoutes = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/views/index.html');
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
