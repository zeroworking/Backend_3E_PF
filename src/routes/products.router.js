import { Router } from "express";
const router = Router();

import { 
    getAllProductsController,
    createProductController,
    getProductByIdController,
    updateProductController,  
    deleteProductController
} from "../controllers/product.controller.js";

router.get('/', getAllProductsController);  // RUTA PARA LISTAR TODOS LOS PRODUCTOS
router.post('/', createProductController); // RUTA PARA CREAR UN PRODUCTO
router.get('/:pid', getProductByIdController); // RUTA PARA LISTAR UN PRODUCTO POR SU ID
router.put('/:pid', updateProductController); // RUTA PARA ACTUALIZAR UN PRODUCTO POR SU ID
router.delete('/:pid', deleteProductController); // RUTA PARA ELIMINAR UN PRODUCTO POR SU ID

export default router; 