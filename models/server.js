const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConection } = require("../config");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 7000;

    this.paths = {
      users: "/api/users",
      post: "/api/post",
      upload: "/api/upload",
    };

    // conectar a la base de datos
    this.conectarDb();
    // middleware: son funcionalidads para el webserver
    this.middlewares();
    // rutas de mi app
    this.routes();
  }

  async conectarDb() {
    await dbConection();
  }

  routes() {
    this.app.use(this.paths.users, require("../routes/user.routes"));
    this.app.use(this.paths.post, require("../routes/post.routes"));
    this.app.use(this.paths.upload, require("../routes/upload.routes"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`listening http://localhost:${this.port}`);
    });
  }

  middlewares() {
    const urls = process.env.URLS_WHITE_LIST.split(",");
    const whiteList = urls;
    const corsOptions = {
      origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`No esta permitido para esta url. ${origin}`));
        }
      },
    };
    // usar cors
    if (process.env.ENV_PRODUCTION == "production") {
      this.app.use(cors(corsOptions));
    } else {
      this.app.use(cors());
    }

    // parseo de la info del body
    this.app.use(express.json());
    // directorio publico
    this.app.use(express.static("public"));

    // /middleware de la suida dei magenes
    this.app.use(
      fileUpload({
        useTempFiles: true,
      })
    );
  }
}

module.exports = Server;
