import express from 'express';
import cors from 'cors';
import path from 'path';
import { createRoutes } from './routes';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded());
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
const viewsPath = path.join(__dirname, 'views');
const publicPath = path.join(__dirname, 'public');

app.use(express.static(viewsPath));
app.use(express.static(publicPath));

createRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Your app is listening on port ' + PORT);
});
