import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

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
        port: process.env.DB_PORT,
      });
      await this.pool.connect();

      const checkTable = await this.pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'User'
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
          );
        `;
        await this.pool.query(createTable);
        console.log('Yeni tablo başarıyla oluşturuldu');
      } else {
        console.log('Tablo zaten mevcut');
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
}
