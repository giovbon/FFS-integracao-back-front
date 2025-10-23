from flask_sqlalchemy import SQLAlchemy

# Cria a instância do SQLAlchemy, mas não a liga a nenhum app ainda
db = SQLAlchemy()

def init_db(app):
    """Inicializa o banco de dados com a aplicação Flask."""
    db.init_app(app)
    with app.app_context():
        db.create_all()