import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/users.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ─── SIGNUP ────────────────────────────────────────────────────────────────
  async signup(dto: SignupDto) {
    // Check for duplicate email
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });

    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create & save user (default role = Customer)
    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      passwordHash: hashedPassword,
      role: 'Customer',
    });

    const saved = await this.userRepo.save(user);
    return this.buildResponse(saved);
  }

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildResponse(user);
  }

  // ─── HELPERS ───────────────────────────────────────────────────────────────

  /** Build the UserDto response the React frontend expects */
  private buildResponse(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
