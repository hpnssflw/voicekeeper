import mongoose from 'mongoose';

let connected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectMongo(): Promise<typeof mongoose> {
  // Если уже подключены, возвращаем сразу
  if (connected && mongoose.connection.readyState === 1) {
    return mongoose;
  }
  
  // Если есть незавершенное подключение, ждем его
  if (connectionPromise) {
    return connectionPromise;
  }
  
  const mongoUri = process.env.MONGO_URI || process.env.NEXT_PUBLIC_MONGO_URI;
  
  if (!mongoUri) {
    // Не выбрасываем ошибку, а возвращаем null или пустой объект
    // Это позволит приложению работать без MongoDB
    console.warn('MONGO_URI is not configured. MongoDB operations will be disabled.');
    throw new Error('MONGO_URI_NOT_CONFIGURED');
  }
  
  // Создаем promise для подключения
  connectionPromise = (async () => {
    try {
      // Проверяем, не подключены ли мы уже
      if (mongoose.connection.readyState === 1) {
        connected = true;
        connectionPromise = null;
        return mongoose;
      }
      
      mongoose.set('strictQuery', true);
      
      // Настраиваем таймауты
      const connectOptions = {
        serverSelectionTimeoutMS: 5000, // 5 секунд вместо 10
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      };
      
      await mongoose.connect(mongoUri, connectOptions);
      connected = true;
      connectionPromise = null;
      
      // Обработчики событий подключения
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        connected = false;
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
        connected = false;
      });
      
      return mongoose;
    } catch (error) {
      connected = false;
      connectionPromise = null;
      console.error('Failed to connect to MongoDB:', error);
      throw new Error(`MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check MONGO_URI in .env.local`);
    }
  })();
  
  return connectionPromise;
}

export async function disconnectMongo(): Promise<void> {
  if (!connected || mongoose.connection.readyState === 0) return;
  try {
    await mongoose.disconnect();
    connected = false;
    connectionPromise = null;
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
}

