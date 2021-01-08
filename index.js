let http = require("http");
let fs = require("fs");
let mime = require("mime");
const { Console } = require("console");

http
  .createServer((request, response) => {
    if (request.method === "GET") {
      switch (request.url) {
        case "/contacto":
          readFile("/rutas/contact.html", response);
          break;
        case "/":
          readFile("/rutas/index.html", response);
          break;
        case "/nosotros":
          readFile("/rutas/about.html", response);
          break;
        case "/proyectos":
          readFile("/rutas/projects.html", response);
          break;
        case "/favicon.ico":
          response.setHeader("Content-Type", "image/x-icon");
          readFile("/favicon.ico", response);
          break;
        case "/favicon":
          response.setHeader("Content-Type", "image/x-icon");
          readFile("/rutas/favicon.html", response);
          break;
        
        case "/usuarios":
          readFile("/usuarios.txt", response);
          break;
        default:
          readFile(request.url, response);
          break;
      }
    } else if (request.method === "POST") {
      let data = "";
      let j;
      
      //Cuando se estén recibiendo datos
      request.on("data", (chunk) => {
          
          data += chunk;

      });

      // Cuando se terminen de procesar los datos
      request.on("end", () => {
       let datos = data.toString();
       let usuario=
            {
            Nombre: datos.split("&")[0].split("=")[1],
            Apellidos: datos.split("&")[1].split("=")[1],
            email: datos.split("&")[2].split("=")[1],
            password: datos.split("&")[3].split("=")[1],
            }

      let repair=usuario.Nombre.replace('+',' ');
      usuario.Nombre=repair;

      repair=usuario.Apellidos.replace('+',' ');
      usuario.Apellidos=repair;

      repair=usuario.email.replace('%','@');
      usuario.email=repair;
        fs.appendFile("usuarios.txt",JSON.stringify(usuario), (error) => {
          if (error) {
            console.log(error);
          }
          
        });
        fs.appendFile("usuarios.txt",",\n", (error) => {
          if (error) {
            console.log(error);
          }
          
        });
      });

      request.on("error", (error) => {
        console.log(error);
      });
    }
  })
  .listen(8080);

const readFile = (url, response) => {
  let urlF = __dirname + url;
  console.log(__dirname, url);
  fs.readFile(urlF, (error, content) => {
    if (!error) {
      response.setHeader("Content-Type", mime.getType(urlF));
      response.end(content);
    } else {
      response.writeHead(404);
      response.end("<h1>404</h1>");
    }
  });
};
