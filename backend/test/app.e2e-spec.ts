import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { ProductsController } from '../src/products/products.controller';
import { ProductsService } from '../src/products/products.service';
import { RolesGuard } from '../src/common/guards/roles.guard';

// HTTP contract checks with service boundaries mocked: no database or real users are touched.
describe('API input validation (HTTP)', () => {
  let app: INestApplication;
  const products = { findAll: jest.fn().mockResolvedValue({ data: [] }), search: jest.fn(), updateStatus: jest.fn() };
  const auth = { register: jest.fn().mockResolvedValue({}), login: jest.fn() };

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      controllers: [AuthController, ProductsController],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: ProductsService, useValue: products },
      ],
    }).overrideGuard(RolesGuard).useValue({ canActivate: () => true }).compile();

    app = fixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use((req: any, _res: any, next: () => void) => { req.user = { id: 'user-1' }; next(); });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => { await app?.close(); });

  it('rejects public admin registration', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send({
      name: 'User', email: 'new@example.com', password: 'password123', role: 'ADMIN',
    }).expect(400);
    expect(auth.register).not.toHaveBeenCalled();
  });

  it.each(['/api/products?page=1.5', '/api/products?limit=101', '/api/products/search?limit=2.5'])('rejects invalid pagination %s', async (url) => {
    await request(app.getHttpServer()).get(url).expect(400);
  });

  it('passes a valid product list request to the service', async () => {
    await request(app.getHttpServer()).get('/api/products?page=2&limit=12').expect(200);
    expect(products.findAll).toHaveBeenCalledWith(expect.objectContaining({ page: 2, limit: 12 }));
  });

  it('rejects an invalid product status before the service', async () => {
    await request(app.getHttpServer()).patch('/api/products/product-1/status').send({ status: 'INVALID' }).expect(400);
    expect(products.updateStatus).not.toHaveBeenCalled();
  });
});
