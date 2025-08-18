import { Role } from 'src/modules/user/schemas/user.schema';
import { UserService } from '../modules/user/user.service';

export async function seedAdmin(userService: UserService) {
  const adminEmail = 'admin@gmail.com';

  const existingAdmin = await userService.findByEmail(adminEmail, true);

  if (!existingAdmin) {
    await userService.create(
      {
        email: 'admin@gmail.com',
        password: '123456',
        fullName: 'Admin',
        role: Role.Admin,
      },
      'https://res.cloudinary.com/dymow3weu/image/upload/v1709999999/default_admin_image.png',
    );
    console.log('✅ Admin created successfully!');
  } else {
    console.log('ℹ️ Admin already exists!');
  }
}
