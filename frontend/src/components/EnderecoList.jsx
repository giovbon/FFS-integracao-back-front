import { h } from 'preact';
import { deleteEndereco } from '../api';

export function EnderecoList({ enderecos, onEdit, onDelete }) {
  
  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar este endereço?')) {
      try {
        await deleteEndereco(id);
        onDelete(); // Avisa o App.jsx para recarregar a lista
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  if (enderecos.length === 0) {
    return <p class="text-gray-400">Nenhum endereço salvo ainda.</p>;
  }

  return (
    <div class="space-y-4">
      {enderecos.map(end => (
        <div key={end.id} class="p-4 bg-gray-800 rounded-lg shadow flex justify-between items-start">
          <div>
            <h4 class="text-xl font-bold">{end.nome_pessoa}</h4>
            <p class="text-gray-300">{end.logradouro || 'CEP sem logradouro'}, {end.numero_casa}</p>
            <p class="text-gray-400">{end.bairro} - {end.localidade}/{end.uf}</p>
            <p class="text-gray-400 font-mono">{end.cep}</p>
          </div>
          <div class="flex flex-col md:flex-row gap-2">
            <button onClick={() => onEdit(end)} class="p-2 px-4 bg-yellow-600 rounded text-sm hover:bg-yellow-500">
              Editar
            </button>
            <button onClick={() => handleDelete(end.id)} class="p-2 px-4 bg-red-600 rounded text-sm hover:bg-red-500">
              Deletar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}