import authRouter from './routes/auth.routes';

// ... 기존 미들웨어 아래에 추가
app.use('/api/auth', authRouter);