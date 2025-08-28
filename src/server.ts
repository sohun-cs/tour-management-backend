import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import seedSuperAdmin from "./app/utils/seedSuperAdmin";

let server: Server;



const startServer = async () => {

    await mongoose.connect(envVars.DB_API);
    console.log('Mongodb connected with mongoose')
    server = app.listen(envVars.PORT, () => {
        console.log(`Server is running on ${envVars.PORT}`)
    })

}

(async() => {
    await startServer();
    await seedSuperAdmin();
})()

process.on("unhandledRejection", (err) => {

    console.log("Facing unhandledRejection error, server is shutting down", err)

    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
});



process.on("uncaughtException", (err) => {

    console.log("Facing uncaughtException error, server is shutting down", err)

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    };

    process.exit(1);
});


process.on("SIGINT", () => {

    console.log("Facing SIGINT error, server is shutting down");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1);
});


process.on("SIGTERM", () => {

    console.log("Facing SIGTERM error, server is shutting down");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    };

    process.exit(1);
});