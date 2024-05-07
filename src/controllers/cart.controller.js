import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";

// METODO PARA LISTAR TODOS LOS CARROS
  export const getCartsController = async (req, res) => {
    try {
      const carts = await cartModel.find().lean().exec();
      res.status(200).json({ status: "success", message: "Listado de todos los carros.", carts });
    } catch (error) {
      console.error("Hubo un error al intentar listar los carros", error);
      res.status(500).send("Error interno del servidor");
    }
  };

// METODO PARA CONSULTAR PRODUCTOS DE UN CARRO POR SU ID
export const getCartByIdController = async (req, res) => {
  try {
    const cid = req.params.cid;    
    const cart = await cartModel.findById(cid).populate('products.product').lean().exec();
    if (!cart) {
      return res.status(404).json({ status: "error", message: "El carro no fue encontrado." });
    }
    res.status(200).json({ cart });
  } catch(error) {
    console.error("Hubo un error al listar el carro por su id", error);
    res.status(500).send("Error interno del servidor");
  }
};

// METODO PARA CREAR NUEVO CARRO
export const createCartController = async (req, res) => {
  try {      
      const cart = await cartModel.create({ products: [] });    
      res.status(200).json({ status: "success", message: "El carro fue creado correctamente.", cart: cart });
  } catch (error) {
      console.error("Hubo un error al crear el carro", error);
      res.status(500).send("Error interno del servidor");
  }
};

// METODO PARA AGREGAR UN PRODUCTO A UN CARRO
export const addProductToCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;   
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "El carro no fue encontrado." });
    }    
    const product = await productModel.findById(pid); 
    if (!product) {
      return res.status(404).json({ status: "error", message: "El producto no fue encontrado." });
    }    
    const indexProduct = cart.products.findIndex((item) => item.product.toString() === pid.toString());
    if (indexProduct < 0) {     
      cart.products.push({ product: pid, quantity: 1 });
    } else {      
      cart.products[indexProduct].quantity += 1;
    }
    await cart.save();
    return res.status(200).json({ status: "success", message: "El producto fue agregado correctamente al carro." });  
  } catch(error) {
    console.error("Hubo un error al intentar agregar el producto al carro", error);
    return res.status(500).send("Error interno del servidor");
  }
};

// METODO PARA ELIMINAR TODOS LOS PRODUCTOS DE UN CARRO EXISTENTE
export const deleteAllProductsToCartController = async (req, res) => {
  try {
    const cid = req.params.cid;    
    const cart = await cartModel.findById(cid);
    if (cart) {     
      cart.products = []; 
      await cart.save(); 
      res.status(200).send({ status: "success", message: "Todos los productos fueron eliminados del carro." });    
    } else {      
      res.status(404).send({ status: "error", message: "El carro no fue encontrado." });
    }
  } catch (error) {
    console.error("Hubo un error al eliminar los productos del carro:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// METODO PARA ELIMINAR UN PRODUCTO A UN CARRO
export const deleteProductToCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;   
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ status: "error", message: "El carro no fue encontrado." });
    }
    const product = await productModel.findById(pid);    
    if (!product) {
      return res.status(404).send({ status: "error", message: "El producto no fue encontrado." });
    }
    const currentCart = await cartModel.findById(cid);
    const indexProduct = currentCart.products.findIndex((item) => item.product == pid);
    if (indexProduct >= 0) {      
      currentCart.products.splice(indexProduct, 1);
      await currentCart.save();
    }
    res.status(200).json({ status: "success", message: "El producto fue eliminado correctamente del carro." });  
  } catch(error) {
    console.error("Hubo un error al eliminar el producto del carro", error);
    res.status(500).send("Error interno del servidor");
  }
};

// METODO PARA ACTUALIZAR LA CANTIDAD DE UNIDADES DE UN PRODUCTO EN EL CARRO
export const updateQuantityProductToCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = parseInt(req.body.quantity); // Convertir a número entero
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ status: "error", message: "La cantidad de unidades debe ser un número mayor a 0." });
    }     
    const cart = await cartModel.findById(cid);   
    const product = await productModel.findById(pid);  
    if (!cart) {
      return res.status(404).json({ status: "error", message: "El carro no fue encontrado." });
    }
    if (!product) {
      return res.status(404).json({ status: "error", message: "El producto no fue encontrado." });
    }
    const cartUpdate = await cartModel.findById(cid);
      const indexProduct = cartUpdate.products.findIndex(item => item.product == pid);
      if (indexProduct < 0) {
          console.error("El producto no existe en el carrito.");
          return null;
      } else {
          cartUpdate.products[indexProduct].quantity = quantity;
      }
      await cartUpdate.save();
      return res.status(200).json({ status: "success", message: "Cantidad de unidades del producto actualizada correctamente." });  
  } catch (error) {
    console.error("Hubo un error al intentar actualizar la cantidad de productos en el carro", error);
    return res.status(500).send("Error interno del servidor");
  }
};

// METODO PARA ACTUALIZAR LOS PRODUCTOS DE UN CARRO
export const updateProductsToCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = req.body;   
    if (!Array.isArray(products)) {
      return res.status(400).json({ status: "error", message: "Los productos deben ser enviados como un arreglo." });
    }
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "El carrito no fue encontrado." });
    }     
    cart.products = products;   
    await cart.save();  
    res.status(200).json({ status: "success", message: "El carrito fue actualizado con éxito.", cart: cart });
  } catch (error) {
    console.error("Hubo un error al actualizar el carrito", error);
    res.status(500).send("Error interno del servidor");
  }
};