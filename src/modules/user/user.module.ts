import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { CloudinaryModule } from 'src/utils/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Shop.name, schema: ShopSchema },
    ]),
    CloudinaryModule,
  ],
  providers: [UserService, CloudinaryService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
