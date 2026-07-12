import type { PersonalityQuestion } from '@/types/personality';
import { LIKERT_5 } from './likert';

export const ENNEAGRAM_QUESTIONS: PersonalityQuestion[] = [
  // TIPO 1 - O PERFECCIONISTA (9 questões)
  { id: 'ene_1_1', text: 'Tenho um forte senso de certo e errado.', framework: 'enneagram', dimension: '1', options: LIKERT_5 },
  { id: 'ene_1_2', text: 'Me esforço para fazer as coisas da maneira certa.', framework: 'enneagram', dimension: '1', options: LIKERT_5 },
  { id: 'ene_1_3', text: 'Fico frustrado quando outros não seguem as regras.', framework: 'enneagram', dimension: '1', options: LIKERT_5 },
  { id: 'ene_1_4', text: 'Minha crítica interna é muito forte.', framework: 'enneagram', dimension: '1', options: LIKERT_5 },
  { id: 'ene_1_5', text: 'Busco constantemente melhorar a mim mesmo e ao mundo.', framework: 'enneagram', dimension: '1', options: LIKERT_5 },
  { id: 'ene_1_6', text: 'Detalhes imperfeitos me incomodam muito.', framework: 'enneagram', dimension: '1', options: LIKERT_5 },
  { id: 'ene_1_7', text: 'Tenho dificuldade em aceitar que "bom o suficiente" é aceitável.', framework: 'enneagram', dimension: '1', options: LIKERT_5 },
  { id: 'ene_1_8', text: 'Sinto-me responsável por corrigir injustiças.', framework: 'enneagram', dimension: '1', options: LIKERT_5 },
  { id: 'ene_1_9', text: 'Reprimo minha raiva, mas ela ferve por dentro.', framework: 'enneagram', dimension: '1', options: LIKERT_5 },

  // TIPO 2 - O PRESTATIVO (9 questões)
  { id: 'ene_2_1', text: 'Sinto grande satisfação em ajudar os outros.', framework: 'enneagram', dimension: '2', options: LIKERT_5 },
  { id: 'ene_2_2', text: 'Frequentemente coloco as necessidades dos outros antes das minhas.', framework: 'enneagram', dimension: '2', options: LIKERT_5 },
  { id: 'ene_2_3', text: 'Me sinto bem quando sou necessário e apreciado.', framework: 'enneagram', dimension: '2', options: LIKERT_5 },
  { id: 'ene_2_4', text: 'Tenho dificuldade em dizer "não" a pedidos.', framework: 'enneagram', dimension: '2', options: LIKERT_5 },
  { id: 'ene_2_5', text: 'Percebo rapidamente o que os outros precisam.', framework: 'enneagram', dimension: '2', options: LIKERT_5 },
  { id: 'ene_2_6', text: 'Às vezes me sinto ressentido por não ser apreciado.', framework: 'enneagram', dimension: '2', options: LIKERT_5 },
  { id: 'ene_2_7', text: 'Adapto meu comportamento para agradar diferentes pessoas.', framework: 'enneagram', dimension: '2', options: LIKERT_5 },
  { id: 'ene_2_8', text: 'Minha autoestima depende de me sentir útil.', framework: 'enneagram', dimension: '2', options: LIKERT_5 },
  { id: 'ene_2_9', text: 'Tenho dificuldade em pedir ajuda para mim mesmo.', framework: 'enneagram', dimension: '2', options: LIKERT_5 },

  // TIPO 3 - O REALIZADOR (9 questões)
  { id: 'ene_3_1', text: 'Sucesso e reconhecimento são muito importantes para mim.', framework: 'enneagram', dimension: '3', options: LIKERT_5 },
  { id: 'ene_3_2', text: 'Sou muito orientado a objetivos e resultados.', framework: 'enneagram', dimension: '3', options: LIKERT_5 },
  { id: 'ene_3_3', text: 'Me adapto facilmente a diferentes situações sociais.', framework: 'enneagram', dimension: '3', options: LIKERT_5 },
  { id: 'ene_3_4', text: 'A imagem que projeto para os outros é importante.', framework: 'enneagram', dimension: '3', options: LIKERT_5 },
  { id: 'ene_3_5', text: 'Sou eficiente e produtivo no que faço.', framework: 'enneagram', dimension: '3', options: LIKERT_5 },
  { id: 'ene_3_6', text: 'Às vezes perco contato com meus verdadeiros sentimentos.', framework: 'enneagram', dimension: '3', options: LIKERT_5 },
  { id: 'ene_3_7', text: 'Comparo meu sucesso com o dos outros.', framework: 'enneagram', dimension: '3', options: LIKERT_5 },
  { id: 'ene_3_8', text: 'Tenho medo de ser visto como um fracasso.', framework: 'enneagram', dimension: '3', options: LIKERT_5 },
  { id: 'ene_3_9', text: 'Trabalhar menos me faz sentir improdutivo.', framework: 'enneagram', dimension: '3', options: LIKERT_5 },

  // TIPO 4 - O INDIVIDUALISTA (9 questões)
  { id: 'ene_4_1', text: 'Sinto que sou diferente da maioria das pessoas.', framework: 'enneagram', dimension: '4', options: LIKERT_5 },
  { id: 'ene_4_2', text: 'Experimento emoções de forma muito intensa.', framework: 'enneagram', dimension: '4', options: LIKERT_5 },
  { id: 'ene_4_3', text: 'Busco significado profundo em tudo na vida.', framework: 'enneagram', dimension: '4', options: LIKERT_5 },
  { id: 'ene_4_4', text: 'Às vezes me sinto incompreendido pelos outros.', framework: 'enneagram', dimension: '4', options: LIKERT_5 },
  { id: 'ene_4_5', text: 'Valorizo autenticidade acima de tudo.', framework: 'enneagram', dimension: '4', options: LIKERT_5 },
  { id: 'ene_4_6', text: 'Tenho tendência à melancolia e nostalgia.', framework: 'enneagram', dimension: '4', options: LIKERT_5 },
  { id: 'ene_4_7', text: 'Invejo qualidades que vejo em outros.', framework: 'enneagram', dimension: '4', options: LIKERT_5 },
  { id: 'ene_4_8', text: 'Sou atraído pelo que é único e diferente.', framework: 'enneagram', dimension: '4', options: LIKERT_5 },
  { id: 'ene_4_9', text: 'Sinto que algo essencial me falta.', framework: 'enneagram', dimension: '4', options: LIKERT_5 },

  // TIPO 5 - O INVESTIGADOR (9 questões)
  { id: 'ene_5_1', text: 'Preciso de muito tempo sozinho para recarregar.', framework: 'enneagram', dimension: '5', options: LIKERT_5 },
  { id: 'ene_5_2', text: 'Tenho um forte desejo de entender como as coisas funcionam.', framework: 'enneagram', dimension: '5', options: LIKERT_5 },
  { id: 'ene_5_3', text: 'Prefiro observar antes de participar.', framework: 'enneagram', dimension: '5', options: LIKERT_5 },
  { id: 'ene_5_4', text: 'Valorizo minha privacidade e independência.', framework: 'enneagram', dimension: '5', options: LIKERT_5 },
  { id: 'ene_5_5', text: 'Tenho dificuldade em compartilhar meus sentimentos.', framework: 'enneagram', dimension: '5', options: LIKERT_5 },
  { id: 'ene_5_6', text: 'Conhecimento e competência são muito importantes para mim.', framework: 'enneagram', dimension: '5', options: LIKERT_5 },
  { id: 'ene_5_7', text: 'Demandas emocionais dos outros me drenam.', framework: 'enneagram', dimension: '5', options: LIKERT_5 },
  { id: 'ene_5_8', text: 'Prefiro pensar sobre problemas a agir sobre eles.', framework: 'enneagram', dimension: '5', options: LIKERT_5 },
  { id: 'ene_5_9', text: 'Guardo meus recursos (tempo, energia, dinheiro) cuidadosamente.', framework: 'enneagram', dimension: '5', options: LIKERT_5 },

  // TIPO 6 - O LEAL (9 questões)
  { id: 'ene_6_1', text: 'Frequentemente imagino cenários de "e se..." negativos.', framework: 'enneagram', dimension: '6', options: LIKERT_5 },
  { id: 'ene_6_2', text: 'Sou muito leal às pessoas e grupos em que confio.', framework: 'enneagram', dimension: '6', options: LIKERT_5 },
  { id: 'ene_6_3', text: 'Tenho dificuldade em confiar em pessoas novas.', framework: 'enneagram', dimension: '6', options: LIKERT_5 },
  { id: 'ene_6_4', text: 'Procuro orientação e segurança em autoridades.', framework: 'enneagram', dimension: '6', options: LIKERT_5 },
  { id: 'ene_6_5', text: 'Sou um bom solucionador de problemas e antecipo riscos.', framework: 'enneagram', dimension: '6', options: LIKERT_5 },
  { id: 'ene_6_6', text: 'Questiono as intenções dos outros frequentemente.', framework: 'enneagram', dimension: '6', options: LIKERT_5 },
  { id: 'ene_6_7', text: 'Valorizo segurança e estabilidade.', framework: 'enneagram', dimension: '6', options: LIKERT_5 },
  { id: 'ene_6_8', text: 'Tenho tendência a adiar decisões por medo de errar.', framework: 'enneagram', dimension: '6', options: LIKERT_5 },
  { id: 'ene_6_9', text: 'Às vezes desafio autoridades para testar sua confiabilidade.', framework: 'enneagram', dimension: '6', options: LIKERT_5 },

  // TIPO 7 - O ENTUSIASTA (9 questões)
  { id: 'ene_7_1', text: 'Tenho muitos interesses e projetos simultâneos.', framework: 'enneagram', dimension: '7', options: LIKERT_5 },
  { id: 'ene_7_2', text: 'Evito sentimentos negativos ou dolorosos.', framework: 'enneagram', dimension: '7', options: LIKERT_5 },
  { id: 'ene_7_3', text: 'Sou otimista e focado em possibilidades futuras.', framework: 'enneagram', dimension: '7', options: LIKERT_5 },
  { id: 'ene_7_4', text: 'Tenho dificuldade em me comprometer com uma coisa.', framework: 'enneagram', dimension: '7', options: LIKERT_5 },
  { id: 'ene_7_5', text: 'Busco novas experiências e aventuras.', framework: 'enneagram', dimension: '7', options: LIKERT_5 },
  { id: 'ene_7_6', text: 'Fico impaciente com rotina e tarefas tediosas.', framework: 'enneagram', dimension: '7', options: LIKERT_5 },
  { id: 'ene_7_7', text: 'Tenho medo de perder oportunidades ou ficar limitado.', framework: 'enneagram', dimension: '7', options: LIKERT_5 },
  { id: 'ene_7_8', text: 'Sou espontâneo e energético.', framework: 'enneagram', dimension: '7', options: LIKERT_5 },
  { id: 'ene_7_9', text: 'Replanejar e racionalizar são formas que uso para evitar dor.', framework: 'enneagram', dimension: '7', options: LIKERT_5 },

  // TIPO 8 - O DESAFIADOR (9 questões)
  { id: 'ene_8_1', text: 'Sou direto e assertivo em minhas comunicações.', framework: 'enneagram', dimension: '8', options: LIKERT_5 },
  { id: 'ene_8_2', text: 'Não gosto de ser controlado ou dominado.', framework: 'enneagram', dimension: '8', options: LIKERT_5 },
  { id: 'ene_8_3', text: 'Protejo os que considero mais fracos.', framework: 'enneagram', dimension: '8', options: LIKERT_5 },
  { id: 'ene_8_4', text: 'Tomo decisões rapidamente e com confiança.', framework: 'enneagram', dimension: '8', options: LIKERT_5 },
  { id: 'ene_8_5', text: 'Fraqueza e vulnerabilidade são difíceis de mostrar.', framework: 'enneagram', dimension: '8', options: LIKERT_5 },
  { id: 'ene_8_6', text: 'Confronto injustiças sem hesitação.', framework: 'enneagram', dimension: '8', options: LIKERT_5 },
  { id: 'ene_8_7', text: 'Intensidade e paixão caracterizam minha abordagem.', framework: 'enneagram', dimension: '8', options: LIKERT_5 },
  { id: 'ene_8_8', text: 'Controle do meu ambiente é importante para mim.', framework: 'enneagram', dimension: '8', options: LIKERT_5 },
  { id: 'ene_8_9', text: 'Posso ser intimidante sem perceber.', framework: 'enneagram', dimension: '8', options: LIKERT_5 },

  // TIPO 9 - O PACIFICADOR (9 questões)
  { id: 'ene_9_1', text: 'Evito conflitos e busco harmonia.', framework: 'enneagram', dimension: '9', options: LIKERT_5 },
  { id: 'ene_9_2', text: 'Tenho dificuldade em saber o que realmente quero.', framework: 'enneagram', dimension: '9', options: LIKERT_5 },
  { id: 'ene_9_3', text: 'Fico indeciso quando há múltiplas opções.', framework: 'enneagram', dimension: '9', options: LIKERT_5 },
  { id: 'ene_9_4', text: 'Prefiro ir junto com o grupo do que causar discordância.', framework: 'enneagram', dimension: '9', options: LIKERT_5 },
  { id: 'ene_9_5', text: 'Consigo ver todos os lados de uma questão.', framework: 'enneagram', dimension: '9', options: LIKERT_5 },
  { id: 'ene_9_6', text: 'Às vezes me "desligo" para evitar situações desconfortáveis.', framework: 'enneagram', dimension: '9', options: LIKERT_5 },
  { id: 'ene_9_7', text: 'Minha raiva se manifesta como resistência passiva.', framework: 'enneagram', dimension: '9', options: LIKERT_5 },
  { id: 'ene_9_8', text: 'Rotinas e conforto são importantes para mim.', framework: 'enneagram', dimension: '9', options: LIKERT_5 },
  { id: 'ene_9_9', text: 'Tenho dificuldade em me priorizar.', framework: 'enneagram', dimension: '9', options: LIKERT_5 },
];

