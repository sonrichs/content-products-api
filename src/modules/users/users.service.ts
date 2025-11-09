import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  fakeUsers: User[] = [
    {
      id: '1',
      username: 'user1@example.com',
      password: 'password1',
    },
    {
      id: '2',
      username: 'user2@example.com',
      password: 'password2',
    },
  ];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByUsername(user.username);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    return this.userRepository.save(user);
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  fakeFindOneByUsername(username: string): User | null {
    return this.fakeUsers.find((user) => user.username === username) || null;
  }
}
