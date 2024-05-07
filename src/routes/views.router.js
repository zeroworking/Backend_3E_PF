import {Router} from 'express';
import { productModel } from '../dao/models/product.model.js';










//CONTINGENCIA
//import productManager from '../controllers/product.controller.js';
//const products = new productManager();
//import cartManager from '../controllers/cart.controller.js';
//const carts = new cartManager();





const router = Router();



import { fork } from 'child_process';


// VISTA QUE RENDERIZA LOS PRODUCTOS PAGINADOS
// a continuacion una consulta de referencia 
// http://localhost:8080/?page=1&limit=3&sort=desc&category=cat2
router.get("/products2", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const sort = req.query.sort;
      const category = req.query.category;
      console.log(category);
      let queryOptions = { limit, page, category };   
      if (sort) {
        queryOptions.sort = sort === 'asc' ? { price: 1 } : { price: -1 };
      }
      const result = await products.getAllProducts(queryOptions);
      result.prevLink = result.hasPrevPage ? `http://localhost:8080/?page=${result.prevPage}` : '';
      result.nextLink = result.hasNextPage ? `http://localhost:8080/?page=${result.nextPage}` : '';
      result.isValid = !(page < 1 || page > result.totalPages) 
      res.render('products_paginados', result);
      console.log(result);
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  });
 
// VISTA QUE RENDERIZA LOS PRODUCTOS PAGINADOS y PERMITE AGREGAR EL PRODUCTO A UN CARRO HARDCODEDADO
router.get('/products', async (req, res) => {
    let page = parseInt(req.query.page);
    if (!page) page = 1
    let result = await productModel.paginate({}, { page, limit: 3, lean: true })
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    result.isValid = !(page < 1 || page > result.totalPages)  
    result.user = req.session.user;
    res.render('products', result);
    console.log(result);
});

// VISTA QUE RENDERIZA EL DETALLE DE PRODUCTOS DE UN CARRO
router.get('/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await carts.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.render("carts", {
            style: "index.css",
            "products": cart["products"]            
          })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// VISTA QUE REDERIZA EL CHAT
router.get("/chat", (req, res) => {    
    res.render('chat',
            {
                style: "index.css",                
            })
  });

// VISTA QUE RENDERIZA EL LOGIN
router.get("/", (req, res) => {
    res.render('login')
});

//VISTA QUE RENDERIZA EL LOGOUT
router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        } else {
            setTimeout(() => {
                res.render('login');
            }, 3000);
        }
    });
});





let count = 0
router.get('/contador', (req, res) => {
    res.render('index', { count: count++ });
});


router.get("/suma-sin-fork", (req, res) => {
    res.send(`El resultado de la operacion es: ${operacionCompleja()}`)
});

//sin Child Process - Fork 
const operacionCompleja = () => {
    let result = 0;
    for (let i = 0; i < 6e9; i++) {
        result += i;
    }
    return result;
};


/* //con Child Process - Fork 
router.get("/suma", (req, res) => {
    const child = fork("./src/forks/operations.js");
    child.send("Iniciar calculo");
    child.on("message", result => {
        res.send(`El resultado de la operacion es ${result}`);
    });
});
 */



export default router;