import { Router } from "express";
import CartManager from "../manager/CartsManager.js";

const CartRouter = Router();

const manager = new CartManager("Carts.json")

CartRouter.post("/", async (req,res) => {
    try {
        let newCart = await manager.createCart(); 
        res.status(200).send({ msg: "Carrito creado", newCart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error al crear el carrito" });
    }
});

CartRouter.get("/:cid", async (req, res) => {
    try {
        let cid = req.params.cid;
        let product = await manager.getProductsOfCart(cid);

        if (product) {
            res.send({ status: "success", payload: product });
        } else {
            res.status(404).send({ status: "error", msg: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", msg: "Ocurrió un error inesperado" });
    }
});


CartRouter.post("/:cid/products/:pid", async(req, res) => {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        let addProduct = await manager.AddProductToCart(cid, pid);

        if (addProduct) {
            res.send({ status: "success", msg: "Product Added" });
        } else {
            res.status(404).send({ status: "error", msg: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", msg: "Ocurrio un error inesperado" });
    }
});


export default CartRouter