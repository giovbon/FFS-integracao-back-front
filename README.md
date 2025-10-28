# Integração entre Backend e FrontEnd

# Back

API em Flask que busca dados da API ViaCEP para pré-preencher os campos. Depois, após incluir o nome do morador e seu número da casa permite salvar dados em banco de dados sqlite usando ORM SQLAlchemy. As rotas da API permitem o CRUD dos endereços.

Para rodar API:

```
cd backend

source venv/bin/activate
.\venv\Scripts\activate

pip install -r requirements.txt
python run.py
```

## Endpoints da API
- `http://127.0.0.1:5000/api/enderecos` com `GET` e `POST`
- `http://127.0.0.1:5000/api/enderecos/id` com `PUT` e `DELETE`

# Front

Front em React (Preact), utiliza Axios (veja `/frontend/src/api.js`) para fazer a integração com o back, fazendo as requisições à API.

Para rodar o front, em outro terminal:
```
cd frontend
npm run install
npm run dev
```

- `http://localhost:5173/`
