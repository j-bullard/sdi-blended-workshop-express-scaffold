const express = require('express');
const cookieParser = require('cookie-parser');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(cookieParser());
