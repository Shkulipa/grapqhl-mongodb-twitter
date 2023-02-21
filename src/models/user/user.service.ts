import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model, Types } from 'mongoose';
import { compare } from 'bcrypt';
import { CreateUserInput } from './dto/createUser.input';
import { User, UserDocument } from './entities/user.entity';
import { omit, pick } from 'lodash';
import { JwtService } from '../jwt/jwt.service';
import { LoginUserInput } from './dto/loginUserInput';
import { UpdateUsernameInput } from './dto/updateUsername.input';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { QueryInput } from 'src/common/dto/query.type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async findAll(query: QueryInput) {
    const { limit, page } = query;

    try {
      const users = await this.userModel
        .find()
        .skip(limit * page - limit)
        .limit(limit);
      const totalCount = await this.userModel.find().count();

      const result = {
        users,
        totalCount,
      };

      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async create(createUserInput: CreateUserInput) {
    try {
      const newUser = omit(createUserInput, ['confirmPassword']);

      const userByEmail = await this.userModel.findOne({
        email: createUserInput.email,
      });
      const userByUsername = await this.userModel.findOne({
        username: createUserInput.username,
      });
      if (userByEmail)
        throw new HttpException(
          'Email already been taken',
          HttpStatus.NOT_FOUND,
        );
      if (userByUsername)
        throw new HttpException(
          'Username already been taken',
          HttpStatus.NOT_FOUND,
        );

      const user = await this.userModel.create(newUser);

      const tokens = this.jwtService.createTokens({ _id: user._id });

      const result = {
        user: {
          ...pick(user, ['_id', 'email', 'username', 'roles']),
        },
        tokens,
      };
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async login(loginUserInput: LoginUserInput) {
    try {
      const { username, password } = loginUserInput;

      const user = await this.userModel
        .findOne()
        .or([{ username }, { email: username }]);

      if (!user)
        throw new HttpException('User wasn\t found', HttpStatus.NOT_FOUND);

      const isEqualPassword = await compare(password, user.password);
      if (!isEqualPassword)
        throw new HttpException('Password incorrect', HttpStatus.UNAUTHORIZED);

      const tokens = this.jwtService.createTokens({ _id: user._id });

      await this.userModel.findByIdAndUpdate(user._id, {
        refreshToken: tokens.refreshToken,
      });

      const result = {
        user: {
          ...pick(user, ['_id', 'email', 'username', 'roles']),
        },
        tokens,
      };
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateUsernameInput(
    updateUsernameInput: UpdateUsernameInput,
    currentUser: ICurrentUser,
  ) {
    const { newUsername } = updateUsernameInput;

    try {
      const isUsername = await this.userModel
        .findOne()
        .where({ username: newUsername });

      if (isUsername)
        throw new HttpException(
          'This username was taken already',
          HttpStatus.BAD_REQUEST,
        );

      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: currentUser._id },
        {
          $set: {
            username: newUsername,
          },
        },
        {
          new: true,
        },
      );

      const result = {
        ...pick(updatedUser, ['_id', 'email', 'username', 'roles']),
      };
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));
      if (!user)
        throw new HttpException("User wasn't found", HttpStatus.NOT_FOUND);

      return user;
    } catch (err) {
      throw err;
    }
  }
}
