import express from 'express';
import knex from '../database/connection';
import {Request,Response} from 'express';

class ItemController{
    async listar(request : Request, response : Response){
        const itens = await knex('item').select('*');

        const serializedItens = itens.map(item => {
            return {
                id:item.id,
                titulo: item.titulo,
                imagem_url: `http://localhost:3333/uploads/${item.imagem}`
            }
        });
    
        return response.json(serializedItens);
    }
}

export default ItemController;