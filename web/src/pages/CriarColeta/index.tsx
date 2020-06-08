import React, { useEffect, useState, ChangeEvent} from 'react';
import './style.css';
import logo from '../../assets/logo.svg';
import {Link} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import {Map,TileLayer,Marker} from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import {LeafletMouseEvent} from 'leaflet';


const CriarColeta = () =>{
    

    interface Item{
        id: number;
        titulo: string;
        imagem_url : string;
    }

    interface IBGEUFResponse{
        sigla : string;
    }

    interface IBGECidadeResponse{
        nome : string;
    }

    const [items, setItems] = useState<Item[]>([]);
    const [ufs,setUfs] = useState<string[]>([]);
    const [cidades,setCidades] = useState<string[]>([]);

    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCidade, setSelectedCidade] = useState('0');
    const [selectedItens, setSelectedItens] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);

    const [posicaoGPS, setPosicaoGPS] = useState<[number,number]>([0,0]);

    const [formData,setFormData] = useState({name: '',email :'', whatsapp: ''});

    useEffect(() =>{
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setPosicaoGPS([latitude,longitude]);
        });
    },[]);

    useEffect(() => {
        api.get("itens").then(
            response => {
                setItems(response.data);
            }
        )
    },[]);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(response => {
            const siglas = response.data.map(uf => uf.sigla);
            setUfs(siglas);            
        });
    },[]);

    useEffect(() =>{
        if(selectedUF === '0'){
            return;
        }

        axios.get<IBGECidadeResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            const cidadesNome = response.data.map(cidade => cidade.nome);
            setCidades(cidadesNome);           
        });

    },[selectedUF]);

    function handleSelectUF(event : ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUF(uf);
    }

    function handleSelectCidade(event : ChangeEvent<HTMLSelectElement>){
        const cidade = event.target.value;
        setSelectedCidade(cidade);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name,value} = event.target;
        setFormData({...formData,[name] : value})
    }

    function handleClickMap(event : LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleItemSelect(id : number){
        const itemSelecionado = selectedItens.findIndex(item => item === id);

        if(itemSelecionado >= 0){

        } else{}

        setSelectedItens([...selectedItens, id]);
    }


    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="EColeta"></img>
            
            <Link to="/">
            <FiArrowLeft/>
                Voltar para home
            </Link>
            </header>
            <form>
                <h1>Cadastro do 
                    <br/>ponto de coleta</h1>
            <fieldset>
                <legend>
                    <h2>Dados</h2>
                </legend>
                <div className="field">
                    <label htmlFor="name">Nome da entidade</label>
                    <input
                        type = "text"
                        name = "nome"
                        id = "nome"
                        onChange = {handleInputChange}
                    />
                </div>

                <div className="field-group">
                <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type = "email"
                        name = "email"
                        id = "email"
                        onChange = {handleInputChange}
                    />
                </div>

                <div className="field">
                    <label htmlFor="whatsapp">Whatsapp</label>
                    <input
                        type = "text"
                        name = "whatsapp"
                        id = "whatsapp"
                        onChange = {handleInputChange}
                    />
                </div>


                </div>
            </fieldset>

            <fieldset>
                <legend>
                    <h2>Endereço</h2>
                    <span>
                        Selecione o endereço no mapa
                    </span>
                </legend>

                <Map center={posicaoGPS}
                     zoom={15}
                     onClick={handleClickMap}
                >
                    <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

                    <Marker position={selectedPosition}/>
                </Map>
                
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">Estado (UF)</label>
                        <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUF}>
                            <option value="0">Selecione uma UF</option>
                            {ufs.map(uf => (
                               <option key={uf} value={uf}>{uf}</option>
                            ))};
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="cidade">Cidade</label>
                        <select name="cidade" id="cidade" value={selectedCidade} onChange={handleSelectCidade}>
                            <option value="0">Selecione uma cidade</option>
                        {cidades.map(cidade => (
                               <option key={cidade} value={cidade}>{cidade}</option>
                            ))};
                        </select>
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>
                    <h2>Ítens de coleta</h2>
                    <span>Selecione um ou mais itens abaixo</span>
                </legend>

                    <ul className="items-grid">

                    {items.map((item) =>(
                        <li 
                        key={item.id} 
                        className={selectedItens.includes(item.id) ? 'selected' : ''}
                        onClick={() => handleItemSelect(item.id)}>
                        <img src={item.imagem_url} alt={item.titulo}></img>
                        <span>{item.titulo}</span>
                        </li>
                    ))}
                        
                
                </ul>
            </fieldset>
            <button type="submit">
                Cadastrar ponto de coleta
            </button>
            </form>
        </div>
    );
};

export default CriarColeta;