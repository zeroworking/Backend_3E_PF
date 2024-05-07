import { productModel } from "../dao/models/product.model.js";

// METODO PARA LISTAR TODOS LOS PRODUCTOS
export const getAllProductsController = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || 'asc'; // Asignar un valor por defecto 'asc' si no se proporciona
        const category = req.query.category;
        const searchQuery = {};
        if (category) {
            searchQuery.category = category;
        }
        const sortQuery = {};
        if (sort === 'asc' || sort === 'desc') {
            sortQuery.price = sort === 'asc' ? 1 : -1;
        }
        let products;
        try {
            products = await productModel.paginate(searchQuery, {
                limit: limit,
                page: page,
                sort: sortQuery,
                lean: true
            });
            const result = {
                products: products.docs,
                totalPages: products.totalPages,
                hasNextPage: products.hasNextPage,
                hasPrevPage: products.hasPrevPage,
                nextPage: products.nextPage,
                prevPage: products.prevPage,
                isValidPage: page >= 1 && page <= products.totalPages
            };
            result.prevLink = result.hasPrevPage ? `http://localhost:8080/?page=${result.prevPage}` : '';
            result.nextLink = result.hasNextPage ? `http://localhost:8080/?page=${result.nextPage}` : '';
            res.json({
                message: "Lista de productos",
                data: result
            });
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({ message: "Solicitud incorrecta" });
    }
};

// METODO PARA AGREGAR UN PRODUCTO
export const createProductController = async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;    
        try {           
            let newProduct = new productModel({ title, description, code, price, status, stock, category, thumbnails });
            let result = await newProduct.save();    
            res.status(200).send({ status: "success", message: "El producto fue agregado correctamente.", product: result });       
        } catch (error) {
            console.log('Error al crear el producto', error);
        }
};

// METODO PARA LISTAR UN PRODUCTO POR SU ID
export const getProductByIdController = async (req, res) => {
    const pid = req.params.pid; 
    try {    
        const product = await productModel.findById(pid);    
        if (!product) {
            return res.status(404).json({ status: "error", message: "El producto no fue encontrado." });
        }
        // No es necesario enviar el mensaje de éxito si el producto se encuentra, ya es implícito
        res.status(200).json({ status: "success", message: "Detalle del producto por su ID.", product });
    } catch (error) {
        console.error("Error: ", error); // Cambiado a console.error para resaltar los errores
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// METODO PARA ACTUALIZAR UN PRODUCTO POR SU ID
export const updateProductController = async (req, res) => {
    const pid = req.params.pid;    
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {        
        console.log(pid);
        const existingProduct = await productModel.findById(pid);
        console.log(existingProduct);
        if (!existingProduct) {
            return res.status(404).send({ status: "error", message: "El producto no fue encontrado." });
        }     
        const updatedProduct = { title, description, code, price, status, stock, category, thumbnails };
        const product = await productModel.findByIdAndUpdate(pid, updatedProduct);
        res.status(200).send({ status: "success", message: "El producto fue actualizado correctamente.", product: product });  
    } catch (error) {
        console.log("Error actualizando el producto", error);
        res.status(500).json({ message: "Error al actualizar el producto." });
    };
};

// RUTA PARA ELIMINAR UN PRODUCTO POR SU ID
export const deleteProductController = async (req, res) => {
    const pid = req.params.pid;
    try { 
        const product = await productModel.findById(pid);
        if (!product) {
            return res.status(404).send({ status: "error", message: "El producto no fue encontrado." });
        }       
        const response = await productModel.findByIdAndDelete(pid)
        res.status(200).send({ status: "success", message: "El producto fue eliminado correctamente.", product: response });          
    } catch (error) {
        console.log("Error eliminando el producto", error);
        res.status(500).send({ status: "error", message: "Error eliminando el producto." });
    }
};