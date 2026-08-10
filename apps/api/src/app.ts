import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import routes from './routes'
import { sendError } from './utils/response'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.use((_req: Request, res: Response) => {
  sendError(res, 404, { code: 'COMMON_404', message: '요청한 리소스를 찾을 수 없습니다.' })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  sendError(res, 500, { code: 'COMMON_001', message: '서버 오류가 발생했습니다.' })
})

export default app
