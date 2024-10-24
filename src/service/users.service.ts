import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { UserList } from 'src/controller/users.controller';
import * as Chance from 'chance';
dotenv.config();

const chance = new Chance();

interface MockUser {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  country: string;
  district: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  async onModuleInit() {
    try {
      this.pool = new Pool({
        user: process.env.DB_USERNAME,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: +process.env.DB_PORT,
      });
      await this.pool.connect();

      const checkTable = await this.pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'users'
        );
      `);
      const tableExists = checkTable.rows[0].exists;
      if (!tableExists) {
        const createTable = `
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            surname VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            phone VARCHAR(20),
            age VARCHAR(10),
            country VARCHAR(255),
            district VARCHAR(255),  
            role VARCHAR(50),       
            createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
            updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
          );
        `;
        await this.pool.query(createTable);
        console.log('Yeni tablo başarıyla oluşturuldu');
      } else {
        console.log('Tablo zaten mevcut');
      }

      for (let i = 0; i < 5; i++) {
        await this.randomMockUser();
      }
    } catch (err) {
      console.log("DB'ye bağlanırken bir sorun oluştu!", err);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.pool) {
        await this.pool.end();
        console.log('DB Bağlantısı Kapatıldı!');
      }
    } catch (err) {
      console.log('DB Bağlantısı kesilirken bir sorun oluştu!', err);
    }
  }

  async createUser(userData: UserList) {
    const emailCheck = await this.pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [userData.email],
    );

    if (emailCheck.rows.length > 0) {
      return {
        statusCode: 403,
        message: 'Bu Email Adresi Kullanımda!',
      };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const query = `
        INSERT INTO users (
          name,
          surname,
          email,
          password,
          phone,
          age,
          country,
          district,
          role
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, name, surname, email, phone, age, country, district, role, createdAt
      `;

    const values = [
      userData.name,
      userData.surname,
      userData.email,
      hashedPassword,
      userData.phone || null,
      userData.age || null,
      userData.country || null,
      userData.district || null,
      userData.role || 'user',
    ];

    const result = await this.pool.query(query, values);

    return {
      message: 'Kullanıcı başarıyla kaydedildi',
    };
  }

  async getOnlyUser(id: string) {
    try {
      const query = `
    SELECT 
     *
    FROM users 
    WHERE id = $1
  `;

      const result = await this.pool.query(query, [id]);

      if (result.rows.length === 0) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Böyle Bir Kullanıcı Bulunamadı!',
        };
      }

      return {
        status: HttpStatus.OK,
        data: result.rows[0],
      };
    } catch (err) {
      console.log(err);
    }
  }

  async randomMockUser() {
    const mockUser: MockUser = {
      name: chance.first(),
      surname: chance.last(),
      email: chance.email(),
      password: chance.string(),
      phone: chance.phone({ formatted: false, mobile: true }),
      age: chance.age(),
      country: chance.country({ full: true }),
      district: chance.city(),
      role: chance.pickone(['admin', 'user']),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const emailCheck = await this.pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [mockUser.email],
    );

    if (emailCheck.rows.length > 0) {
      return {
        statusCode: 403,
        message: 'Bu Email Adresi Kullanımda!',
      };
    }

    const query = `
    INSERT INTO users (name, surname, email, password, phone, age, country, district, role, createdAt, updatedAt)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `;

    const values = [
      mockUser.name,
      mockUser.surname,
      mockUser.email,
      await bcrypt.hash(mockUser.password, 10),
      mockUser.phone,
      mockUser.age,
      mockUser.country,
      mockUser.district,
      mockUser.role,
      mockUser.createdAt,
      mockUser.updatedAt,
    ];

    await this.pool.query(query, values);
  }

  async updateUser(id: string, userData: UserList) {
    try {
      const query = `
    UPDATE users
    SET 
      name = COALESCE($1, name),
        surname = COALESCE($2, surname),
        email = COALESCE($3, email),
        password = COALESCE($4, password),
        phone = COALESCE($5, phone),
        age = COALESCE($6, age),
        country = COALESCE($7, country),
        district = COALESCE($8, district),
        role = COALESCE($9, role),
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = $10
    RETURNING id, name, surname, email, password, phone, age, country, district, role, updatedAt
  `;

      const values = [
        userData.name,
        userData.surname,
        userData.email,
        await bcrypt.hash(userData.password, 10),
        userData.phone,
        userData.age,
        userData.country,
        userData.district,
        userData.role,
        id,
      ];

      const result = await this.pool.query(query, values);

      if (result.rowCount === 0) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Kullanıcı Bulunamadı',
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'Kullanıcı başarıyla güncellendi',
      };
    } catch (error) {
      console.log(error);
    }
  }
}
