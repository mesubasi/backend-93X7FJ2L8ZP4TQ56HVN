import {
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
  created_at: Date;
  updated_at: Date;
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
            name VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255),
            phone VARCHAR(20),
            age VARCHAR(10),
            country VARCHAR(255),
            district VARCHAR(255),  
            role VARCHAR(50),       
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
          );
        `;
        await this.pool.query(createTable);
        console.log('Yeni tablo başarıyla oluşturuldu');
      } else {
        console.log('Tablo zaten mevcut');
      }

      for (let i = 0; i < 10; i++) {
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
        RETURNING id, name, surname, email, phone, age, country, district, role, created_at
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
      id, 
      name, 
      surname, 
      email, 
      phone, 
      age, 
      country, 
      district, 
      role, 
      created_at, 
      updated_at 
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
      password: chance.string({ length: 8 }),
      phone: chance.phone(),
      age: chance.age(),
      country: chance.country({ full: true }),
      district: chance.city(),
      role: chance.pickone(['admin', 'user']),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const query = `
    INSERT INTO users (name, surname, email, password, phone, age, country, district, role, created_at, updated_at)
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
      mockUser.created_at,
      mockUser.updated_at,
    ];

    await this.pool.query(query, values);
  }
}
