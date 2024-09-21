import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RealEstateTransaction } from './real-estate-transaction.entity';
import { TaskService } from './task.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.NEXT_DB_USERNAME, // DB 사용자 이름
      password: process.env.NEXT_DB_PASSWORD, // DB 비밀번호
      database: 'real_estate_db',
      entities: [RealEstateTransaction],
      synchronize: true, // 개발 시에만 true, 프로덕션에서는 false로 설정해야 함
    }),
    TypeOrmModule.forFeature([RealEstateTransaction]),
  ],
  providers: [TaskService],
})
export class AppModule {}
