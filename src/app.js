import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import ProductManager from "./manager/ProductManager.js";
import { Server } from "socket.io";
import ProductsRouter from "./routes/productsRouter.js";
import CartRouter from "./routes/cartsRouter.js";
import ViewsRouter from "./routes/viewsRouter.js"

const manager = new ProductManager("Products.json")

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"));

app.use("/", ViewsRouter)
app.use("/api/products", ProductsRouter)
app.use("/api/carts", CartRouter)


const Httpserver = app.listen(8080, ()=>{
    console.log("Server Runing on port 8080");
})

const io = new Server(Httpserver)

io.on("connection", async (socket) =>{

    console.log("New User conected!");

    const data = await manager.getProducts();
    if (data) {
      io.emit("resp-new-product", data);
    }

    socket.on("createProduct", async (data) => {
      console.log(data);
        const newProduct = await manager.addProduct(data.title, data.description, data.price, "hola", data.code, data.stock, data.category);
      });

    socket.on("deleted-product", async (pid)=>{
      let deleted = await manager.deleteProduct(pid)
    })
    
})