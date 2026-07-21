import "dotenv/config";
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import levelRouter from './routes/level';
import lessonRouter from './routes/lesson';
import vocabRouter from './routes/vocabulary';
import exampleRouter from './routes/example';
import grammarRouter from './routes/grammar';
import commentRouter from './routes/comment';
import radicalRouter from './routes/radical';
import excersiseRouter from './routes/excersise';
import myVocabularyRouter from './routes/myVocabulary';
import dialogueRouter from './routes/dialogue';
import writingSheetRouter from './routes/writingSheet';
import scoreRouter from './routes/score';



const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
))

app.use(session({
  secret: 'ducthanh',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true
  }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/levels', levelRouter);
app.use('/lessons', lessonRouter);
app.use('/vocabularies', vocabRouter);
app.use('/examples', exampleRouter);
app.use('/grammars', grammarRouter);
app.use('/comments', commentRouter);
app.use('/radicals', radicalRouter);
app.use('/excersises', excersiseRouter);
app.use('/my-vocabularies', myVocabularyRouter);
app.use('/dialogues', dialogueRouter);
app.use('/writing-sheets', writingSheetRouter);
app.use('/score', scoreRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
