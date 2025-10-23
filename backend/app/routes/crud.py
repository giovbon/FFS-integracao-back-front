from flask import Blueprint, request, jsonify
from app.models.endereco import Endereco
from app.database import db
import requests # Para o ViaCEP

# Cria um "Blueprint", que é um conjunto de rotas modular
# Todas as rotas aqui terão o prefixo /api
crud_bp = Blueprint('crud', __name__, url_prefix='/api')


# ROTA AUXILIAR PARA O VIACEP (o front-end vai usar isso)
# Rota: GET /api/viacep/<cep>
@crud_bp.route('/viacep/<string:cep>', methods=['GET'])
def buscar_viacep(cep):
    try:
        response = requests.get(f'https://viacep.com.br/ws/{cep}/json/')
        response.raise_for_status() # Lança erro se a requisição falhar
        data = response.json()
        if data.get('erro'):
            return jsonify({"message": "CEP não encontrado"}), 404
        return jsonify(data), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Erro ao buscar CEP: {e}"}), 500


# --- INÍCIO DO CRUD DE ENDEREÇOS NO NOSSO BD ---

# Rota: POST /api/enderecos (CREATE)
@crud_bp.route('/enderecos', methods=['POST'])
def create_endereco():
    data = request.json
    
    # Validação simples
    if not data.get('cep') or not data.get('nome_pessoa') or not data.get('numero_casa'):
        return jsonify({"message": "CEP, Nome e Número são obrigatórios"}), 400

    novo_endereco = Endereco(
        cep=data['cep'],
        logradouro=data.get('logradouro'),
        bairro=data.get('bairro'),
        localidade=data.get('localidade'),
        uf=data.get('uf'),
        nome_pessoa=data['nome_pessoa'],
        numero_casa=data['numero_casa']
    )
    db.session.add(novo_endereco)
    db.session.commit()
    
    return jsonify(novo_endereco.to_dict()), 201 # 201 = Created

# Rota: GET /api/enderecos (READ - All)
@crud_bp.route('/enderecos', methods=['GET'])
def get_all_enderecos():
    enderecos = Endereco.query.all()
    return jsonify([endereco.to_dict() for endereco in enderecos]), 200

# Rota: PUT /api/enderecos/<id> (UPDATE)
@crud_bp.route('/enderecos/<int:id>', methods=['PUT'])
def update_endereco(id):
    endereco = Endereco.query.get_or_404(id)
    data = request.json
    
    # Validação simples para evitar salvar dados incompletos (opcional, mas recomendado)
    if not data.get('cep') or not data.get('nome_pessoa') or not data.get('numero_casa'):
        return jsonify({"message": "CEP, Nome e Número são obrigatórios"}), 400

    # --- CAMPOS QUE ESTAVAM FALTANDO: ---
    endereco.cep = data.get('cep', endereco.cep)
    endereco.logradouro = data.get('logradouro', endereco.logradouro)
    endereco.bairro = data.get('bairro', endereco.bairro)
    endereco.localidade = data.get('localidade', endereco.localidade)
    endereco.uf = data.get('uf', endereco.uf)
    # ------------------------------------
    
    # Campos originais (já estavam aqui)
    endereco.nome_pessoa = data.get('nome_pessoa', endereco.nome_pessoa)
    endereco.numero_casa = data.get('numero_casa', endereco.numero_casa)
    
    db.session.commit()
    return jsonify(endereco.to_dict()), 200

# Rota: DELETE /api/enderecos/<id> (DELETE)
@crud_bp.route('/enderecos/<int:id>', methods=['DELETE'])
def delete_endereco(id):
    endereco = Endereco.query.get_or_404(id)
    db.session.delete(endereco)
    db.session.commit()
    return jsonify({"message": "Endereço deletado com sucesso"}), 200