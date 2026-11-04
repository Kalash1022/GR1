import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('Public registration', () => {
  it('rejects an admin role before account lookup or creation', async () => {
    const users = { findByEmail: jest.fn(), create: jest.fn() };
    const service = new AuthService(users as unknown as UsersService, {} as JwtService);
    await expect(service.register({
      name: 'New user', email: 'new@example.com', password: 'password123', role: UserRole.ADMIN,
    })).rejects.toBeInstanceOf(ForbiddenException);
    expect(users.findByEmail).not.toHaveBeenCalled();
    expect(users.create).not.toHaveBeenCalled();
  });
});
