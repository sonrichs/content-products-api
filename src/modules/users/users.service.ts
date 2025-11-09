import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  fakeUsers: User[] = [
    {
      id: '1',
      email: 'user1@example.com',
      password: 'password1',
    },
    {
      id: '2',
      email: 'user2@example.com',
      password: 'password2',
    },
  ];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  fakeFindOneByEmail(email: string): User | null {
    return this.fakeUsers.find((user) => user.email === email) || null;
  }
}
