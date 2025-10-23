import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { EnderecoList } from './components/EnderecoList';
import { EnderecoForm } from './components/EnderecoForm';
import { getEnderecos } from './api';
import './index.css'; // O Vite já importa isso

export function App() {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar qual endereço está sendo editado
  // Se for 'null', o formulário será de "Criação"
  // Se for um objeto, será de "Edição"
  const [editingEndereco, setEditingEndereco] = useState(null);

  // Função para carregar os endereços salvos da nossa API
  const fetchEnderecos = async () => {
    try {
      setLoading(true);
      const response = await getEnderecos();
      setEnderecos(response.data);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para carregar os dados quando o componente montar
  useEffect(() => {
    fetchEnderecos();
  }, []);

  // Callback chamado pelo Form quando um endereço é salvo (criado ou editado)
  const onSave = () => {
    fetchEnderecos(); // Recarrega a lista
    setEditingEndereco(null); // Fecha o formulário de edição
  };

  return (
    <div class="container mx-auto p-8">
      <h1 class="text-4xl font-bold mb-8 text-center">Meus Endereços</h1>

      {/* O Formulário de Criação/Edição */}
      <EnderecoForm 
        key={editingEndereco?.id || 'new'} // Truque para resetar o form
        initialData={editingEndereco}
        onSave={onSave}
        onCancel={() => setEditingEndereco(null)}
      />

      <hr class="my-10" />

      {/* A Lista de Endereços Salvos */}
      <h2 class="text-3xl font-bold mb-6">Endereços Salvos</h2>
      {loading ? (
        <p>Carregando endereços...</p>
      ) : (
        <EnderecoList
          enderecos={enderecos}
          onEdit={setEditingEndereco} // Passa a função para "abrir" o form de edição
          onDelete={fetchEnderecos} // Recarrega a lista após deletar
        />
      )}
    </div>
  );
}