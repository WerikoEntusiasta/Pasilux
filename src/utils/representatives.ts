import { Representative as DataRep } from '../types';

export interface Representative {
  region: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  showroom: string;
  estimatedDays: string;
  avatar: string;
  states: string[];
  cepRanges?: string[];
}

export const defaultRepresentativesList: Representative[] = [
  {
    region: 'São Paulo (Capital, Grande SP e Interior)',
    name: 'Carlos Eduardo Silveira',
    role: 'Engenheiro de Aplicação & Consultor Regional',
    company: 'Pasilux SP Regional Hub',
    phone: '(11) 3840-9100',
    whatsapp: '5511987654321',
    email: 'sp.vendas@pasilux.com.br',
    showroom: 'Av. das Nações Unidas, 12901 - Pinheiros, São Paulo/SP',
    estimatedDays: '1 a 2 dias úteis (Pronta entrega)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    states: ['SP'],
    cepRanges: ['01000-000 à 19999-999']
  },
  {
    region: 'Minas Gerais e Centro-Oeste',
    name: 'Rodrigo Alcantara',
    role: 'Especialista Luminotécnico',
    company: 'Pasilux Minas & Cerrado',
    phone: '(31) 3261-8800',
    whatsapp: '5531998765432',
    email: 'mg.vendas@pasilux.com.br',
    showroom: 'Av. do Contorno, 6500 - Savassi, Belo Horizonte/MG',
    estimatedDays: '2 a 3 dias úteis',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    states: ['MG', 'GO', 'DF', 'MT', 'MS'],
    cepRanges: ['30000-000 à 39999-999', '70000-000 à 79999-999']
  },
  {
    region: 'Rio de Janeiro e Espírito Santo',
    name: 'Mariana Fontes',
    role: 'Consultora de Projetos Arquitetônicos',
    company: 'Pasilux Litoral Sudeste',
    phone: '(21) 2512-4000',
    whatsapp: '5521988776655',
    email: 'rj.vendas@pasilux.com.br',
    showroom: 'Av. das Américas, 4200 - Barra da Tijuca, Rio de Janeiro/RJ',
    estimatedDays: '2 a 3 dias úteis',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    states: ['RJ', 'ES'],
    cepRanges: ['20000-000 à 28999-999', '29000-000 à 29999-999']
  },
  {
    region: 'Região Sul (PR, SC, RS)',
    name: 'Henrique Becker',
    role: 'Diretor Comercial Regional Sul',
    company: 'Pasilux Sul Distribuidora',
    phone: '(41) 3020-5500',
    whatsapp: '5541991238899',
    email: 'sul.vendas@pasilux.com.br',
    showroom: 'Rua Marechal Deodoro, 869 - Centro, Curitiba/PR',
    estimatedDays: '2 a 3 dias úteis',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    states: ['PR', 'SC', 'RS'],
    cepRanges: ['80000-000 à 87999-999', '88000-000 à 89999-999', '90000-000 à 99999-999']
  },
  {
    region: 'Nordeste',
    name: 'Luciana Vasconcelos',
    role: 'Gerente de Atendimento a Especificadores',
    company: 'Pasilux Nordeste Hub',
    phone: '(71) 3341-7700',
    whatsapp: '5571992345678',
    email: 'nordeste.vendas@pasilux.com.br',
    showroom: 'Av. Tancredo Neves, 1632 - Caminho das Árvores, Salvador/BA',
    estimatedDays: '3 a 4 dias úteis',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    states: ['BA', 'PE', 'CE', 'RN', 'PB', 'AL', 'SE', 'MA', 'PI'],
    cepRanges: ['40000-000 à 65999-999']
  },
  {
    region: 'Região Norte',
    name: 'Valdir Mendes',
    role: 'Supervisor de Logística e Distribuição Norte',
    company: 'Pasilux Amazonia Light',
    phone: '(92) 3622-1100',
    whatsapp: '5592984551122',
    email: 'norte.vendas@pasilux.com.br',
    showroom: 'Av. Djalma Batista, 1661 - Chapada, Manaus/AM',
    estimatedDays: '4 a 5 dias úteis',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
    states: ['AM', 'PA', 'AP', 'RR', 'RO', 'AC', 'TO'],
    cepRanges: ['66000-000 à 69999-999', '77000-000 à 77999-999']
  }
];

export const representativesList = defaultRepresentativesList;

export async function lookupRepresentativeByCep(cepInput: string, dynamicReps?: DataRep[]): Promise<{
  cep: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  representative: Representative;
} | null> {
  const cleanCep = cepInput.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return null;
  }

  let uf = 'SP';
  let cidade = 'São Paulo';
  let logradouro = '';
  let bairro = '';

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (response.ok) {
      const data = await response.json();
      if (!data.erro) {
        uf = data.uf || 'SP';
        cidade = data.localidade || '';
        logradouro = data.logradouro || '';
        bairro = data.bairro || '';
      }
    }
  } catch (err) {
    console.warn('ViaCEP API offline, using fallback state detection based on CEP prefix:', err);
    const prefix = parseInt(cleanCep.substring(0, 2), 10);
    if (prefix >= 1 && prefix <= 19) uf = 'SP';
    else if (prefix >= 20 && prefix <= 28) uf = 'RJ';
    else if (prefix >= 29 && prefix <= 29) uf = 'ES';
    else if (prefix >= 30 && prefix <= 39) uf = 'MG';
    else if (prefix >= 40 && prefix <= 48) uf = 'BA';
    else if (prefix >= 49 && prefix <= 49) uf = 'SE';
    else if (prefix >= 50 && prefix <= 56) uf = 'PE';
    else if (prefix >= 57 && prefix <= 57) uf = 'AL';
    else if (prefix >= 58 && prefix <= 58) uf = 'PB';
    else if (prefix >= 59 && prefix <= 59) uf = 'RN';
    else if (prefix >= 60 && prefix <= 63) uf = 'CE';
    else if (prefix >= 64 && prefix <= 64) uf = 'PI';
    else if (prefix >= 65 && prefix <= 65) uf = 'MA';
    else if (prefix >= 66 && prefix <= 69) uf = 'PA';
    else if (prefix >= 70 && prefix <= 73) uf = 'DF';
    else if (prefix >= 72 && prefix <= 76) uf = 'GO';
    else if (prefix >= 77 && prefix <= 77) uf = 'TO';
    else if (prefix >= 78 && prefix <= 78) uf = 'MT';
    else if (prefix >= 79 && prefix <= 79) uf = 'MS';
    else if (prefix >= 80 && prefix <= 87) uf = 'PR';
    else if (prefix >= 88 && prefix <= 89) uf = 'SC';
    else if (prefix >= 90 && prefix <= 99) uf = 'RS';
  }

  // If dynamic representatives from DataContext are provided and active
  let foundRep: Representative | undefined;

  if (dynamicReps && dynamicReps.length > 0) {
    const activeDynamic = dynamicReps.filter(r => r.active);
    const matchedDataRep = activeDynamic.find(r => r.states.includes(uf)) || activeDynamic[0];
    if (matchedDataRep) {
      foundRep = {
        region: matchedDataRep.region,
        name: matchedDataRep.name,
        role: 'Representante Oficial Pasilux',
        company: matchedDataRep.companyName || 'Pasilux Representação Regional',
        phone: matchedDataRep.phone,
        whatsapp: matchedDataRep.whatsapp || matchedDataRep.phone,
        email: matchedDataRep.email || 'atendimento@pasilux.com.br',
        showroom: matchedDataRep.address || `${matchedDataRep.city} - Showroom Regional`,
        estimatedDays: '1 a 3 dias úteis',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
        states: matchedDataRep.states,
        cepRanges: matchedDataRep.cepRanges
      };
    }
  }

  if (!foundRep) {
    foundRep = defaultRepresentativesList.find(r => r.states.includes(uf)) || defaultRepresentativesList[0];
  }

  const formattedCep = `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`;

  return {
    cep: formattedCep,
    logradouro,
    bairro,
    cidade,
    uf,
    representative: foundRep
  };
}
