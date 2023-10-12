import fs from "fs"

class ProductManager {

    constructor(path) {
        this.path = path;
        this.autoId = 0;
        this.initFile()

    }

    async initFile() {
        if (fs.existsSync(this.path)) {
            const stats = fs.statSync(this.path);
            if (stats.size === 0) {
                fs.writeFileSync(this.path, '[]');
            } else {
                let products = await this.getProducts();
                if (products.length > 0) {
                    const maxId = Math.max(...products.map(product => product.id));
                    this.autoId = maxId + 1;
                }
            }
        } else {
            fs.writeFileSync(this.path, '[]');
        }
    }
    

    async getProducts(){
        let data = await fs.promises.readFile(this.path)
        let products = JSON.parse(data)
        return products
    }

    async addProduct(title, description, price, thumbnail, code, stock, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            console.log("Por favor, Completa todos los cambios");
            return null;
        }
    
        let products = await this.getProducts();
    
        const productExist = products.find(product => product.code === code);
        if (productExist) {
           console.log('Ya existe un producto con ese código');
           return null;
        }
    
        const newProduct = {
            id: ++this.autoId, 
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        }
    
        products.push(newProduct);
    
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    
        return newProduct;
    }
    

    async getProductByid(id){
        let products = await this.getProducts()
        let idProduct = products.find(product => product.id === id);
        if (!idProduct) {
            console.log("Product not Found");
        } else{
            console.log(idProduct)
            return idProduct

        }
    }

    async updateProduct(id, product){
        if (!product.title || !product.description || !product.price || !product.thumbnail 
            || !product.code || !product.stock) {
            console.log('Los campos son obligatorios');
            return null;
        }
    
        let products = await this.getProducts();
        
        let existingProduct = products.find(prod => prod.code == product.code && prod.id !== id);
        console.log(existingProduct)
        if (existingProduct) {
            console.log('Ya existe un producto con ese código');
            return null;
        }
    
        let indice = products.findIndex(prod => prod.id == id);
        if (indice !== -1) {
            products[indice].title = product.title;
            products[indice].description = product.description;
            products[indice].price = product.price;
            products[indice].thumbnail = product.thumbnail;
            products[indice].code = product.code;
            products[indice].stock = product.stock;
        }
    
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        console.log("Producto Actualizado");
        return products[indice];
    }
    
    async deleteProduct(id){
        console.log(id)
        try {
            let products = await this.getProducts()
            
            let indice = products.findIndex(product => product.id == id)
            console.log(indice)
            if (indice !== -1) {
                products.splice(indice, 1)
                await fs.promises.writeFile(this.path, JSON.stringify(products))
                console.log(`Producto Eliminado`);
                return true;
            } else {
                console.log(`Producto no encontrado`);
                return false;
            }
        } catch (error) {
            console.error(error); 
            throw new Error("Error al eliminar el producto");
        }
    }

}

// const manager = new ProductManager("Products.json")

// const Product1 = manager.addProduct("Sandias", "De las Buenas", 350, "img.jpg", 5656765, 30)

// const allProducts = manager.getProducts()

// const oneProducts = manager.getProductByid(5)

// const NewProduct = manager.updateProduct(1, {
//     title: "Sandía",
//     description: "De las buenas",
//     price: 400,
//     thumbnail: "img.jpg",
//     code: 11111,
//     stock: 50
//   });

// const deleteProduct = manager.deleteProduct(3)

export default ProductManager