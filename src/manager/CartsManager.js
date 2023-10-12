import fs from 'fs'

class CartManager {

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
                let carts = await this.getCarts();
                if (carts.length > 0) {
                    const maxId = Math.max(...carts.map(cart => cart.id));
                    this.autoId = maxId + 1;
                }
            }
        } else {
            fs.writeFileSync(this.path, '[]');
        }
    }
    

    async getCarts(){
        try {
            let data = await fs.promises.readFile(this.path);
            let carts = JSON.parse(data);
            return carts;
        } catch (error) {
            console.error('Error al leer o parsear el archivo:', error);
            throw new Error('Error al obtener los carritos');
        }
    }
    
    async createCart(){
        try {
            let newCart = {
                id : ++this.autoId,
                products : []
            }
            let carts = await this.getCarts();
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw new Error('Error al crear el carrito'); 
        }
    }
    

    async getProductsOfCart(id){
        try {
            let carts = await this.getCarts();
            let idCart = carts.find(cart => cart.id == id);
            if (idCart) {
                return idCart;
            } else {
                throw new Error("Carrito no encontrado");
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener productos del carrito");
        }
    }
    

    async AddProductToCart(cid, pid) {
        try {
            let cart;
            let carts = await this.getCarts();
            let index = carts.findIndex(cart => cart.id == cid);
    
            if (index === -1) {
                return cart;
            }
    
            let product = {
                id : parseInt(pid),
                quantity: 1
            }
    
            let cartProducts = carts[index].products;
            let ProductExist = cartProducts.find(cartProduct => cartProduct.id == product.id);
    
            if (ProductExist) {
                ProductExist.quantity++;
            } else {
                cartProducts.push(product);
            }
    
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return carts[index];
        } catch (error) {
            console.error(error);
            throw new Error("Error al añadir el producto al carrito");
        }
    }

}

export default CartManager;