import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import {
  createMongooseCatalogService,
  InvalidSelectionError,
  ProductNotFoundError,
  type CatalogService,
} from './catalog-service.js';
import {
  checkoutIntentSchema,
  emiPlanQuerySchema,
  slugSchema,
} from './validation.js';

export interface AppDependencies {
  catalogService?: CatalogService;
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function createApp(dependencies: AppDependencies = {}) {
  const app = express();
  const catalogService =
    dependencies.catalogService ?? createMongooseCatalogService();

  app.disable('x-powered-by');
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()) ?? [
        'http://localhost:5173',
      ],
    }),
  );
  app.use(express.json({ limit: '20kb' }));

  const apiRouter = express.Router();

  apiRouter.get('/health', (_request, response) => {
    response.json({ success: true, data: { status: 'ok' } });
  });

  apiRouter.get('/products', async (request, response) => {
    const category = typeof request.query.category === 'string' ? request.query.category : undefined;
    const search = typeof request.query.q === 'string' ? request.query.q : undefined;
    const products = await catalogService.listProducts(category, search);
    response.json({ success: true, data: products });
  });

  apiRouter.get('/products/:slug/emi-plans', async (request, response) => {
    const slug = slugSchema.parse(firstParam(request.params.slug));
    const query = emiPlanQuerySchema.parse(request.query);
    const plans = await catalogService.getEmiPlans(slug, query.variantId);
    response.json({ success: true, data: plans });
  });

  apiRouter.get('/products/:slug', async (request, response) => {
    const slug = slugSchema.parse(firstParam(request.params.slug));
    const product = await catalogService.getProduct(slug);

    if (!product) {
      response.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'We could not find that product.' },
      });
      return;
    }

    response.json({ success: true, data: product });
  });

  apiRouter.post('/checkout/intent', async (request, response) => {
    const input = checkoutIntentSchema.parse(request.body);
    const intent = await catalogService.createCheckoutIntent(input);
    response.status(201).json({ success: true, data: intent });
  });

  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  app.use((_request, response) => {
    response.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'The requested endpoint does not exist.' },
    });
  });

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof ZodError) {
      response.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please check the supplied information.',
          details: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
      });
      return;
    }

    if (error instanceof ProductNotFoundError) {
      response.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: error.message },
      });
      return;
    }

    if (error instanceof InvalidSelectionError) {
      response.status(400).json({
        success: false,
        error: { code: 'INVALID_SELECTION', message: error.message },
      });
      return;
    }

    console.error('Unhandled API error', error);
    response.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong while processing your request. Please try again.',
      },
    });
  };

  app.use(errorHandler);
  return app;
}
