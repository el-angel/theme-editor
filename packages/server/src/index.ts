import express from 'express';
import { parser } from '@anche/semantic-tokens-utilities';

const app = express();

const cors = (_, res, next): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(cors);
app.use(express.json());

app.get('/ping', (_, res) => {
    res.json({
        success: true,
    });
});

app.post('/sh', (req, res) => {
    const body = req.body;
    const code = body.code || '';

    const result = parser({ code, language: 'tsx' });

    res.send(result);
});

app.listen(3001, () => console.log('listening on http://localhost:3001'));
