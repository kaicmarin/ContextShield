import type { Merchant } from '../types/domain'
import { cnpjFromBase } from '../utils/cnpj'
import { IDS } from './ids'
export const merchants: Merchant[] = [
  {
    id: IDS.nexa,
    name: 'NEXA',
    legalName: 'NEXA Comércio Digital Ltda.',
    domain: 'nexa.example',
    cnpj: cnpjFromBase('418329050001'),
    city: 'São Paulo',
    category: 'Marketplace de tecnologia e casa',
    mcc: '5399',
    since: '2016-05-02',
    verified: true,
    marketplace: true,
  },
  {
    id: IDS.lumen,
    name: 'Lumen Tech',
    legalName: 'Lumen Tecnologia e Varejo Ltda.',
    domain: 'lumentech.example',
    cnpj: cnpjFromBase('274410380001'),
    city: 'Curitiba',
    category: 'Eletrônicos',
    mcc: '5732',
    since: '2014-09-15',
    verified: true,
    marketplace: false,
  },
  {
    id: IDS.alto,
    name: 'Livraria Alto',
    legalName: 'Alto Livros e Papelaria S.A.',
    domain: 'livrariaalto.example',
    cnpj: cnpjFromBase('093315720001'),
    city: 'São Paulo',
    category: 'Livros e vale-presente',
    mcc: '5942',
    since: '2011-03-08',
    verified: true,
    marketplace: false,
  },
  {
    id: IDS.vertice,
    name: 'Casa Vértice',
    legalName: 'Vértice Casa e Decoração Ltda.',
    domain: 'casavertice.example',
    cnpj: cnpjFromBase('331027640001'),
    city: 'Belo Horizonte',
    category: 'Casa e decoração',
    mcc: '5712',
    since: '2017-11-21',
    verified: true,
    marketplace: false,
  },
]

// a constante/variável map e atribui a ela o resultado da expressão desta linha.
const map = new Map(merchants.map((m) => [m.id, m]))
export const getMerchant = (id: string) => map.get(id)
