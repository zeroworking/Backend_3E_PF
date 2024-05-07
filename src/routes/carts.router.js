import { Router } from "express";
const router = Router();

import {
  getCartsController,
  getCartByIdController,
  createCartController,
  addProductToCartController,
  deleteAllProductsToCartController,
  deleteProductToCartController,
  updateQuantityProductToCartController,
  updateProductsToCartController
} from '../controllers/cart.controller.js'

router.get('/', getCartsController); // LISTA TODOS LOS CARROS
router.get('/:cid', getCartByIdController); // LISTA UN CARRO POR SU ID
router.post('/', createCartController); // CREA UN CARRO
router.post('/:cid/product/:pid', addProductToCartController); // AGREGA UN PRODUCTO A UN CARRO
router.delete('/:cid', deleteAllProductsToCartController); // ELIMINA TODOS LOS PRODUCTOS DE UN CARRO
router.delete('/:cid/product/:pid', deleteProductToCartController); // ELIMINA UN PRODUCTO DE UN CARRO
router.put('/:cid/product/:pid', updateQuantityProductToCartController); // ACTUALIZA LA CANTIDAD DE UNIDADES DE UN PRODUCTO DE UN CARRO
router.put('/:cid', updateProductsToCartController); // ACTUALIZA UN CARRO CON UN ARREGLO DE PRODUCTOS

export default router;