import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../api/auth/jwt-auth.guard';
import { User } from './users.entity';

@Controller('user')
export class UserController {
  /**
   * GET /api/user/profile
   * Returns the logged-in user's profile data.
   * Protected by JWT — the React frontend sends Bearer token via apiClient interceptor.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: { user: User }) {
    const user = req.user;
    // Never return password
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
