import 'dotenv/config';

import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT;

app.listen(port, async () => {
  try {
    app.use(cors());
    app.use(express.json());

    console.log(`✅ Server is listening at http://localhost:${port}`);
  } catch (err: any) {
    console.error(err);
    process.exit(1);
  }
});
