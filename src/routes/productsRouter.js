import  { Router } from "express"
import ProductManager from "../manager/ProductManager.js"

const manager = new ProductManager("Products.json")

const ProductsRouter = Router();

ProductsRouter.get("/", async (req, res) => {
    try {
        let products = await manager.getProducts();
        let { limit } = req.query;
        let limitProducts = limit ? products.slice(0, limit) : products;
        res.status(200).send({ limitProducts });
    } catch (error) {
        res.status(500).send({ error: "Error al obtener productos" });
    }
});

ProductsRouter.get("/:id", async (req, res) => {
    try {
        let products = await manager.getProducts();
        let id = req.params.id;
        let idProduct = products.find(prod => prod.id == id);
        if (idProduct) {
            res.send(idProduct);
        } else {
            res.status(404).send({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ error: "Error al obtener el producto" });
    }
});

ProductsRouter.post("/", async (req, res) => {
    try {
        let newProduct = req.body
        if (newProduct) {
            let addedProduct = await manager.addProduct(newProduct.title, newProduct.description, newProduct.price, 
                newProduct.thumbnail, newProduct.code, newProduct.stock);
            if (addedProduct) {
                res.status(200).send({ msg: "Producto agregado", product: addedProduct });
            } else {
                res.status(400).send({ error: "El producto ya existe o faltan campos obligatorios" });
            }
        } else {
            res.status(400).send({ error: "El cuerpo de la solicitud está vacío" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error al crear el producto" });
    }
});

ProductsRouter.put("/:id", async (req, res) => {
    try {
        let products = await manager.getProducts();
        let id = req.params.id;
        let idProduct = products.find(prod => prod.id == id);
        if (idProduct) {
            let updatedProduct = await manager.updateProduct(id, req.body);
            if (updatedProduct) {
                res.send(updatedProduct);
            } else {
                res.status(400).send({ error: "Error al actualizar el producto" });
            }
        } else {
            res.status(404).send({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error al obtener el producto" });
    }
});

ProductsRouter.delete("/:pid", async (req, res) => {
    try {
        let pid = req.params.pid;
    
        let productDelete = await manager.deleteProduct(pid);
        
        if (productDelete) {
            res.send({ status: "success", msg: "Product deleted" });
        } else {
            res.status(404).send({ status: "error", msg: "Product not found" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", msg: "An unexpected error occurred" });
    }
});




export default ProductsRouter