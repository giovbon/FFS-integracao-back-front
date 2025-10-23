import os
from flask import Flask
from flask_cors import CORS
from .database import init_db
from .routes.crud import crud_bp

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    
    # Caminho para o banco de dados SQLite
    # Ele ficará em /backend/instance/enderecos.db
    db_path = os.path.join(app.instance_path, 'enderecos.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Garante que a pasta /instance exista
    os.makedirs(app.instance_path, exist_ok=True)

    # Configura o CORS para permitir requisições do seu front-end Preact
    # Em produção, restrinja para a URL do seu front-end
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}) # 5173 é a porta padrão do Vite

    # Inicializa o DB
    init_db(app)

    # Registra o Blueprint (nosso controller)
    app.register_blueprint(crud_bp)

    return app