// import mongoose from "mongoose";

// let isConnected: boolean = false;

// export const connectToDatabase = async () => {
//   // prevent unknown field queries
//   mongoose.set("strictQuery", true);

//   if (!process.env.MONGODB_URI) return console.log("missing url");

//   if (isConnected) {
//     return console.log("MongoDB is already connected");
//   }
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "dev-overflow",
//     });
//     isConnected = true;
//   } catch (error) {
//     console.log("Error connecting to Mongo");
//   }
// };

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

type MongooseCache = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

// extend global scope
declare global {
	// eslint-disable-next-line no-var
	var mongooseCache: MongooseCache | undefined;
}

const cached =
	global.mongooseCache ||
	(global.mongooseCache = {
		conn: null,
		promise: null,
	});

export async function connectToDatabase() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		mongoose.set("strictQuery", true);

		cached.promise = mongoose.connect(MONGODB_URI, {
			dbName: "dev-overflow",
		});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
