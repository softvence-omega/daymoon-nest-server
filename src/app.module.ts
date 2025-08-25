import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductModule } from "./modules/product/product.module";
import { VariantModule } from "./modules/variant/variant.module";
import { SubCategoryModule } from "./modules/sub-category/sub-category.module";
import { CategoryModule } from "./modules/category/category.module";
import { OrderModule } from "./modules/order/order.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { ShipmentModule } from "./modules/shipment/shipment.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    VariantModule,
    SubCategoryModule,
    CategoryModule,
    OrderModule,
    PaymentModule,
    ShipmentModule,
    
    // Load environment variables
    ConfigModule.forRoot({ isGlobal: true }),

    // use async config for MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      })
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}