import express from 'express';
import knex from '../database/connection';
import {Request,Response} from 'express';

class ColetaController{
    async salvar(request: Request ,response : Response){

        const trx =  await knex.transaction();
        const {nome,email,whatsapp,latitude,longitude,cidade,uf,itens} = request.body;

        const coleta = {
            imagem : "https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
            nome,
            email,
            whatsapp,
            latitude,
            longitude,
            cidade,
            uf
        };

        const retorno =  await trx('coleta').insert(coleta);
        const idColeta = retorno[0]; 

    
        const coletaItens = itens.map((item_id : number) => {
            return {
                item_id,
                coleta_id : idColeta 
            }
        });
        
        await trx('coleta_item').insert(coletaItens);

        await trx.commit();

        return response.json({
            "idColeta" : idColeta,
            ...coleta
        });
    }

    async carregar(request : Request, response : Response){
        const { id } = request.params;

        const coleta = await knex('coleta').where('id',id).first();

        const itens= await knex("item")
        .join("coleta_item","item.id","=","coleta_item.item_id")
        .where("coleta_item.coleta_id",id)
        .select("item.titulo");

        if(!coleta){
            return response.status(400).json({mensagem: "Coleta não encontrada"});
        }
        
        return response.json({coleta, itens});        
    }

    async listar(request : Request, response : Response){
        const {cidade, uf, itens } = request.query;

        const itensRecebidos = String(itens).split(',').map(item => Number(item.trim()));

        console.log(itensRecebidos);

        const coletas = await knex("coleta")
        .join("coleta_item","coleta.id","=","coleta_item.coleta_id")
        .whereIn("coleta_item.item_id",itensRecebidos)
        .where("cidade",String(cidade))
        .where("uf",String(uf))
        .distinct()
        .select("coleta.*");

        return response.json(coletas);
    }

}

export default ColetaController;