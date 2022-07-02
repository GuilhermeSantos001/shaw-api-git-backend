import { createClient } from 'redis';
import { RedisOptions } from '../constants';

export class Redis {
  static async Save(key: string, value: string) {
    try {
      const client = createClient(RedisOptions);

      await client.connect();

      const result = await client.set(key, value);

      await client.quit();

      return result;
    } catch (error) {
      return new Error(error as string);
    }
  }

  static async Get(key: string) {
    try {
      const client = createClient(RedisOptions);

      await client.connect();

      const value = await client.get(key);

      await client.quit();

      return value;
    } catch (error) {
      return new Error(error as string);
    }
  }

  static async All(keyPattern: string) {
    try {
      const client = createClient(RedisOptions);

      await client.connect();

      const keys = await client.keys(keyPattern),
        values: string[] = [];

      for (const key of keys) {
        const value = await this.Get(key);

        if (!(value instanceof Error)) values.push(value);
      }

      await client.quit();

      return values;
    } catch (error) {
      return new Error(error as string);
    }
  }

  static async Remove(key: string) {
    try {
      const client = createClient(RedisOptions);

      await client.connect();

      const result = await client.del(key);

      await client.quit();

      return result > 0;
    } catch (error) {
      return new Error(error as string);
    }
  }
}
