import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { getViaCep, createEndereco, updateEndereco } from '../api';

export function EnderecoForm({ initialData = null, onSave, onCancel }) {
  
  // 'initialData' é o endereço vindo da lista para edição
  const [isEditing, setIsEditing] = useState(!!initialData);
  
  // Estado principal do formulário
  const [formData, setFormData] = useState({
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    nome_pessoa: '',
    numero_casa: ''
  });

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Se 'initialData' mudar (ex: usuário clicou em "Editar"),
  // preenchemos o formulário com os dados.
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    } else {
      // Limpa o formulário se não for edição
      setFormData({
        cep: '', logradouro: '', bairro: '', localidade: '', uf: '',
        nome_pessoa: '', numero_casa: ''
      });
      setIsEditing(false);
    }
  }, [initialData]);

  // Lida com a mudança em qualquer input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para buscar o CEP (no nosso backend, que chama o ViaCEP)
  const handleBuscaCep = async () => {
    if (formData.cep.length < 8) return;
    
    setCepLoading(true);
    setCepError(null);
    try {
      const response = await getViaCep(formData.cep);
      const { logradouro, bairro, localidade, uf } = response.data;
      // Preenche o formulário com os dados do ViaCEP
      setFormData(prev => ({
        ...prev,
        logradouro,
        bairro,
        localidade,
        uf,
      }));
    } catch (error) {
      console.error(error);
      setCepError("CEP não encontrado ou falha na busca.");
    } finally {
      setCepLoading(false);
    }
  };

  // Função de SUBMIT (Salvar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (isEditing) {
        // Modo UPDATE
        await updateEndereco(formData.id, formData);
      } else {
        // Modo CREATE
        await createEndereco(formData);
      }
      onSave(); // Avisa o App.jsx que salvou (para recarregar a lista)
      
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
    } finally {
      setFormLoading(false);
    }
  };
  
  // Função para limpar e cancelar
  const handleCancel = () => {
    if (onCancel && isEditing) {
      onCancel(); // Avisa o App.jsx para "fechar" o form de edição
    }
    // Limpa o formulário
    setFormData({
      cep: '', logradouro: '', bairro: '', localidade: '', uf: '',
      nome_pessoa: '', numero_casa: ''
    });
    setIsEditing(false);
  }

  return (
    <form onSubmit={handleSubmit} class="p-6 bg-gray-800 rounded-lg shadow-lg space-y-4">
      <h3 class="text-2xl font-semibold mb-4">
        {isEditing ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
      </h3>
      
      {/* --- CAMPOS DO USUÁRIO --- */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="nome_pessoa" value={formData.nome_pessoa} onChange={handleChange} placeholder="Nome da Pessoa" class="p-2 rounded bg-gray-700" required />
        <input name="numero_casa" value={formData.numero_casa} onChange={handleChange} placeholder="Número da Casa" class="p-2 rounded bg-gray-700" required />
      </div>

      {/* --- BUSCA CEP --- */}
      <div class="flex gap-2">
        <input name="cep" value={formData.cep} onChange={handleChange} placeholder="CEP (só números)" maxLength={8} class="p-2 rounded bg-gray-700 w-full" required />
        <button type="button" onClick={handleBuscaCep} disabled={cepLoading} class="p-2 bg-blue-600 rounded hover:bg-blue-500 disabled:bg-gray-500">
          {cepLoading ? '...' : 'Buscar'}
        </button>
      </div>
      {cepError && <p class="text-red-400 text-sm">{cepError}</p>}

      {/* --- CAMPOS DO VIACEP (auto-preenchidos) --- */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="logradouro" value={formData.logradouro} onChange={handleChange} placeholder="Logradouro" class="p-2 rounded bg-gray-700" />
        <input name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro" class="p-2 rounded bg-gray-700" />
        <input name="localidade" value={formData.localidade} onChange={handleChange} placeholder="Cidade" class="p-2 rounded bg-gray-700" />
        <input name="uf" value={formData.uf} onChange={handleChange} placeholder="UF" class="p-2 rounded bg-gray-700 w-20" />
      </div>
      
      {/* --- BOTÕES DE AÇÃO --- */}
      <div class="flex gap-4 pt-4">
        <button type="submit" disabled={formLoading} class="p-2 px-6 bg-green-600 rounded hover:bg-green-500 disabled:bg-gray-500">
          {formLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
        </button>
        <button type="button" onClick={handleCancel} class="p-2 px-6 bg-gray-600 rounded hover:bg-gray-500">
          Cancelar
        </button>
      </div>
    </form>
  );
}