import { Router, Request, Response } from 'express';
import { buildCORSHeaders, ImageProxyError, resolveImageProxyRequest } from './imageProxyUtils';

const router = Router();

function errorResponse(res: Response, status: number, message: string) {
  return res
    .status(status)
    .set({
      'Content-Type': 'text/plain; charset=utf-8',
      ...buildCORSHeaders(),
    })
    .send(message);
}

// Handle OPTIONS request
router.options('/', (req: Request, res: Response) => {
  res
    .status(204)
    .set(buildCORSHeaders())
    .send();
});

// Handle GET request
router.get('/', async (req: Request, res: Response) => {
  const target = req.query.url as string | undefined;

  try {
    const { upstream, headers } = await resolveImageProxyRequest(target);
    res.set(headers);

    if (upstream.body) {
      const reader = upstream.body.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          res.write(value);
        }
        res.end();
      } catch (error) {
        console.error('Error streaming response:', error);
        res.destroy();
      }
    } else {
      const buffer = Buffer.from(await upstream.arrayBuffer());
      res.end(buffer);
    }
  } catch (error) {
    if (error instanceof ImageProxyError) {
      return errorResponse(res, error.status, error.message);
    }

    console.error('Unexpected image proxy error:', error);
    return errorResponse(res, 500, 'Internal proxy error');
  }
});

export default router;
