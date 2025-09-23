import { buildCORSHeaders, ImageProxyError, resolveImageProxyRequest } from '../server/routes/imageProxyUtils';

type NodeResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): NodeResponse;
  send(body?: any): any;
  end(data?: any): any;
  write(chunk: any): void;
  writableEnded?: boolean;
};

type NodeRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};

function applyHeaders(res: NodeResponse, headers: Record<string, string>) {
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
}

function sendError(res: NodeResponse, status: number, message: string) {
  applyHeaders(res, {
    'Content-Type': 'text/plain; charset=utf-8',
    ...buildCORSHeaders(),
  });
  res.status(status).send(message);
}

function normalizeTarget(param: string | string[] | undefined): string | null {
  if (!param) return null;
  if (Array.isArray(param)) {
    return param.length > 0 ? param[0] : null;
  }
  return param;
}

export default async function handler(req: NodeRequest, res: NodeResponse) {
  if (req.method === 'OPTIONS') {
    applyHeaders(res, buildCORSHeaders());
    res.status(204).send('');
    return;
  }

  if (req.method !== 'GET') {
    applyHeaders(res, {
      ...buildCORSHeaders(),
      Allow: 'GET, OPTIONS',
    });
    res.status(405).send('Method Not Allowed');
    return;
  }

  const target = normalizeTarget(req.query?.url);

  try {
    const { upstream, headers } = await resolveImageProxyRequest(target);
    applyHeaders(res, headers);

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
        console.error('Error streaming proxied image:', error);
        if (!res.writableEnded) {
          res.status(500).end();
        }
      }
    } else {
      const buffer = Buffer.from(await upstream.arrayBuffer());
      res.end(buffer);
    }
  } catch (error) {
    if (error instanceof ImageProxyError) {
      sendError(res, error.status, error.message);
      return;
    }

    console.error('Unexpected image proxy error:', error);
    sendError(res, 500, 'Internal proxy error');
  }
}
