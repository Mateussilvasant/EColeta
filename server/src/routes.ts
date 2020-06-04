import express from 'express';
import knex from './database/connection';
import ColetaController from './controllers/ColetaController';
import ItemController from'./controllers/ItemController';

const routes = express.Router();
const controllerColeta = new ColetaController();
const itemController = new ItemController();

routes.get("/itens",itemController.listar);
routes.post("/coleta",controllerColeta.salvar);

routes.get("/coleta/:id",controllerColeta.carregar);
routes.get("/coletas",controllerColeta.listar);

export default routes;