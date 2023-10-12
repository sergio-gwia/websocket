import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const ViewsRouter = Router();

const manager = new ProductManager("Products.json")

ViewsRouter.get("/", async (req, res)=>{
    try {
        let products = await manager.getProducts();
        let { limit } = req.query;
        let limitProducts = limit ? products.slice(0, limit) : products;
        res.render("home", { limitProducts, style:"style.css" })
    } catch (error) {
        res.status(500).send({ error: "Error al obtener productos" });
    } 
  });

  ViewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", {style:"style.css"});
  });

export default ViewsRouter