const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5502;

app.use(cors());

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Database connected"))
  .catch(err => console.error("Error connecting to database:", err));

app.use(express.json());

const administratorsRouter = require('./routes/Administrators');
const commandsRouter = require('./routes/Commands');
const usersRouter = require('./routes/Users');
const productsRouter = require('./routes/Products');
const deliveryMenRouter = require('./routes/DeliveryMen');


app.use('/api', administratorsRouter);
app.use('/api', commandsRouter);
app.use('/api', usersRouter);
app.use('/api', productsRouter);
app.use('/api', deliveryMenRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));