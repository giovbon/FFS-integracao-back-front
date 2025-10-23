from app.database import db

class Endereco(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    # Dados do ViaCEP
    cep = db.Column(db.String(9), nullable=False)
    logradouro = db.Column(db.String(200))
    bairro = db.Column(db.String(100))
    localidade = db.Column(db.String(100))
    uf = db.Column(db.String(2))
    
    # Dados do usuário
    nome_pessoa = db.Column(db.String(150), nullable=False)
    numero_casa = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        """Converte o objeto Endereco para um dicionário (JSON)."""
        return {
            "id": self.id,
            "cep": self.cep,
            "logradouro": self.logradouro,
            "bairro": self.bairro,
            "localidade": self.localidade,
            "uf": self.uf,
            "nome_pessoa": self.nome_pessoa,
            "numero_casa": self.numero_casa
        }