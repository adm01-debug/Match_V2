import type { PersonalityQuestion } from '@/types/personality';
import { LIKERT_5, LIKERT_7 } from './likert';

export const BIG_FIVE_QUESTIONS: PersonalityQuestion[] = [
  // ABERTURA À EXPERIÊNCIA (18 questões)
  // Faceta: Imaginação
  { id: 'bf_o_1', text: 'Tenho uma imaginação muito ativa e vívida.', framework: 'bigfive', dimension: 'openness', facet: 'imagination', options: LIKERT_5 },
  { id: 'bf_o_2', text: 'Costumo sonhar acordado e criar cenários imaginários.', framework: 'bigfive', dimension: 'openness', facet: 'imagination', options: LIKERT_5 },
  { id: 'bf_o_3', text: 'Prefiro focar no que é real e prático.', framework: 'bigfive', dimension: 'openness', facet: 'imagination', reverse: true, options: LIKERT_5, validationPair: 'bf_o_1' },
  
  // Faceta: Interesses Artísticos
  { id: 'bf_o_4', text: 'Aprecio arte, música e literatura.', framework: 'bigfive', dimension: 'openness', facet: 'artistic', options: LIKERT_5 },
  { id: 'bf_o_5', text: 'Visitar museus e galerias me entedia.', framework: 'bigfive', dimension: 'openness', facet: 'artistic', reverse: true, options: LIKERT_5 },
  { id: 'bf_o_6', text: 'Sou sensível à beleza em todas as suas formas.', framework: 'bigfive', dimension: 'openness', facet: 'artistic', options: LIKERT_5 },
  
  // Faceta: Emotividade
  { id: 'bf_o_7', text: 'Experimento emoções intensas e profundas.', framework: 'bigfive', dimension: 'openness', facet: 'emotionality', options: LIKERT_5 },
  { id: 'bf_o_8', text: 'Sou tocado facilmente por filmes e livros.', framework: 'bigfive', dimension: 'openness', facet: 'emotionality', options: LIKERT_5 },
  { id: 'bf_o_9', text: 'Raramente me deixo levar por emoções.', framework: 'bigfive', dimension: 'openness', facet: 'emotionality', reverse: true, options: LIKERT_5 },
  
  // Faceta: Aventura
  { id: 'bf_o_10', text: 'Gosto de experimentar coisas novas e diferentes.', framework: 'bigfive', dimension: 'openness', facet: 'adventurousness', options: LIKERT_5 },
  { id: 'bf_o_11', text: 'Prefiro a segurança da rotina conhecida.', framework: 'bigfive', dimension: 'openness', facet: 'adventurousness', reverse: true, options: LIKERT_5 },
  { id: 'bf_o_12', text: 'Busco ativamente novas experiências.', framework: 'bigfive', dimension: 'openness', facet: 'adventurousness', options: LIKERT_5 },
  
  // Faceta: Intelecto
  { id: 'bf_o_13', text: 'Gosto de resolver problemas complexos e abstratos.', framework: 'bigfive', dimension: 'openness', facet: 'intellect', options: LIKERT_5 },
  { id: 'bf_o_14', text: 'Filosofia e debates teóricos me interessam.', framework: 'bigfive', dimension: 'openness', facet: 'intellect', options: LIKERT_5 },
  { id: 'bf_o_15', text: 'Prefiro questões práticas a teóricas.', framework: 'bigfive', dimension: 'openness', facet: 'intellect', reverse: true, options: LIKERT_5 },
  
  // Faceta: Liberalismo
  { id: 'bf_o_16', text: 'Questiono valores tradicionais e autoridade.', framework: 'bigfive', dimension: 'openness', facet: 'liberalism', options: LIKERT_5 },
  { id: 'bf_o_17', text: 'Tradições devem ser respeitadas e mantidas.', framework: 'bigfive', dimension: 'openness', facet: 'liberalism', reverse: true, options: LIKERT_5 },
  { id: 'bf_o_18', text: 'Estou aberto a diferentes perspectivas e culturas.', framework: 'bigfive', dimension: 'openness', facet: 'liberalism', options: LIKERT_5 },

  // CONSCIENCIOSIDADE (18 questões)
  // Faceta: Autoeficácia
  { id: 'bf_c_1', text: 'Sou competente e capaz de alcançar meus objetivos.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'self-efficacy', options: LIKERT_5 },
  { id: 'bf_c_2', text: 'Confio na minha capacidade de resolver problemas.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'self-efficacy', options: LIKERT_5 },
  { id: 'bf_c_3', text: 'Frequentemente duvido das minhas habilidades.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'self-efficacy', reverse: true, options: LIKERT_5 },
  
  // Faceta: Ordem
  { id: 'bf_c_4', text: 'Mantenho meu espaço de trabalho organizado.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'orderliness', options: LIKERT_5 },
  { id: 'bf_c_5', text: 'Tenho dificuldade em manter as coisas organizadas.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'orderliness', reverse: true, options: LIKERT_5 },
  { id: 'bf_c_6', text: 'Sigo rotinas e sistemas bem estabelecidos.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'orderliness', options: LIKERT_5 },
  
  // Faceta: Senso de Dever
  { id: 'bf_c_7', text: 'Cumpro minhas promessas e compromissos.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'dutifulness', options: LIKERT_5 },
  { id: 'bf_c_8', text: 'Às vezes deixo de cumprir responsabilidades.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'dutifulness', reverse: true, options: LIKERT_5 },
  { id: 'bf_c_9', text: 'Sinto-me obrigado a fazer o que é certo.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'dutifulness', options: LIKERT_5 },
  
  // Faceta: Busca por Realização
  { id: 'bf_c_10', text: 'Estabeleço metas ambiciosas para mim mesmo.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'achievement', options: LIKERT_5 },
  { id: 'bf_c_11', text: 'Trabalho duro para alcançar a excelência.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'achievement', options: LIKERT_5 },
  { id: 'bf_c_12', text: 'Estou satisfeito com resultados medianos.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'achievement', reverse: true, options: LIKERT_5 },
  
  // Faceta: Autodisciplina
  { id: 'bf_c_13', text: 'Consigo me manter focado em tarefas longas.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'self-discipline', options: LIKERT_5 },
  { id: 'bf_c_14', text: 'Procrastino frequentemente em tarefas importantes.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'self-discipline', reverse: true, options: LIKERT_5 },
  { id: 'bf_c_15', text: 'Termino o que começo, mesmo quando é difícil.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'self-discipline', options: LIKERT_5 },
  
  // Faceta: Cautela
  { id: 'bf_c_16', text: 'Penso cuidadosamente antes de tomar decisões.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'cautiousness', options: LIKERT_5 },
  { id: 'bf_c_17', text: 'Tomo decisões por impulso frequentemente.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'cautiousness', reverse: true, options: LIKERT_5 },
  { id: 'bf_c_18', text: 'Avalio consequências antes de agir.', framework: 'bigfive', dimension: 'conscientiousness', facet: 'cautiousness', options: LIKERT_5 },

  // EXTROVERSÃO (18 questões)
  // Faceta: Amigabilidade
  { id: 'bf_e_1', text: 'Faço amigos com facilidade.', framework: 'bigfive', dimension: 'extraversion', facet: 'friendliness', options: LIKERT_5 },
  { id: 'bf_e_2', text: 'Sou reservado com pessoas que não conheço.', framework: 'bigfive', dimension: 'extraversion', facet: 'friendliness', reverse: true, options: LIKERT_5 },
  { id: 'bf_e_3', text: 'Gosto de conhecer pessoas novas.', framework: 'bigfive', dimension: 'extraversion', facet: 'friendliness', options: LIKERT_5 },
  
  // Faceta: Gregário
  { id: 'bf_e_4', text: 'Prefiro estar em grupos grandes de pessoas.', framework: 'bigfive', dimension: 'extraversion', facet: 'gregariousness', options: LIKERT_5 },
  { id: 'bf_e_5', text: 'Prefiro interações um-a-um ou em pequenos grupos.', framework: 'bigfive', dimension: 'extraversion', facet: 'gregariousness', reverse: true, options: LIKERT_5 },
  { id: 'bf_e_6', text: 'Festas e eventos sociais me energizam.', framework: 'bigfive', dimension: 'extraversion', facet: 'gregariousness', options: LIKERT_5 },
  
  // Faceta: Assertividade
  { id: 'bf_e_7', text: 'Assumo a liderança naturalmente em grupos.', framework: 'bigfive', dimension: 'extraversion', facet: 'assertiveness', options: LIKERT_5 },
  { id: 'bf_e_8', text: 'Prefiro seguir do que liderar.', framework: 'bigfive', dimension: 'extraversion', facet: 'assertiveness', reverse: true, options: LIKERT_5 },
  { id: 'bf_e_9', text: 'Expresso minhas opiniões com confiança.', framework: 'bigfive', dimension: 'extraversion', facet: 'assertiveness', options: LIKERT_5 },
  
  // Faceta: Nível de Atividade
  { id: 'bf_e_10', text: 'Tenho um ritmo de vida acelerado e ocupado.', framework: 'bigfive', dimension: 'extraversion', facet: 'activity-level', options: LIKERT_5 },
  { id: 'bf_e_11', text: 'Prefiro um ritmo de vida calmo e relaxado.', framework: 'bigfive', dimension: 'extraversion', facet: 'activity-level', reverse: true, options: LIKERT_5 },
  { id: 'bf_e_12', text: 'Estou sempre envolvido em várias atividades.', framework: 'bigfive', dimension: 'extraversion', facet: 'activity-level', options: LIKERT_5 },
  
  // Faceta: Busca por Emoções
  { id: 'bf_e_13', text: 'Busco atividades que me dão adrenalina.', framework: 'bigfive', dimension: 'extraversion', facet: 'excitement-seeking', options: LIKERT_5 },
  { id: 'bf_e_14', text: 'Evito situações arriscadas ou intensas.', framework: 'bigfive', dimension: 'extraversion', facet: 'excitement-seeking', reverse: true, options: LIKERT_5 },
  { id: 'bf_e_15', text: 'Gosto de emoções fortes e experiências intensas.', framework: 'bigfive', dimension: 'extraversion', facet: 'excitement-seeking', options: LIKERT_5 },
  
  // Faceta: Alegria
  { id: 'bf_e_16', text: 'Sou uma pessoa geralmente alegre e animada.', framework: 'bigfive', dimension: 'extraversion', facet: 'cheerfulness', options: LIKERT_5 },
  { id: 'bf_e_17', text: 'Raramente demonstro entusiasmo.', framework: 'bigfive', dimension: 'extraversion', facet: 'cheerfulness', reverse: true, options: LIKERT_5 },
  { id: 'bf_e_18', text: 'Transmito energia positiva para os outros.', framework: 'bigfive', dimension: 'extraversion', facet: 'cheerfulness', options: LIKERT_5 },

  // AMABILIDADE (18 questões)
  // Faceta: Confiança
  { id: 'bf_a_1', text: 'Acredito que as pessoas são geralmente bem-intencionadas.', framework: 'bigfive', dimension: 'agreeableness', facet: 'trust', options: LIKERT_5 },
  { id: 'bf_a_2', text: 'Desconfio das intenções dos outros.', framework: 'bigfive', dimension: 'agreeableness', facet: 'trust', reverse: true, options: LIKERT_5 },
  { id: 'bf_a_3', text: 'Dou às pessoas o benefício da dúvida.', framework: 'bigfive', dimension: 'agreeableness', facet: 'trust', options: LIKERT_5 },
  
  // Faceta: Moralidade
  { id: 'bf_a_4', text: 'Sou honesto mesmo quando é difícil.', framework: 'bigfive', dimension: 'agreeableness', facet: 'morality', options: LIKERT_5 },
  { id: 'bf_a_5', text: 'Às vezes manipulo situações a meu favor.', framework: 'bigfive', dimension: 'agreeableness', facet: 'morality', reverse: true, options: LIKERT_5 },
  { id: 'bf_a_6', text: 'Trato os outros como gostaria de ser tratado.', framework: 'bigfive', dimension: 'agreeableness', facet: 'morality', options: LIKERT_5 },
  
  // Faceta: Altruísmo
  { id: 'bf_a_7', text: 'Gosto de ajudar os outros sem esperar retorno.', framework: 'bigfive', dimension: 'agreeableness', facet: 'altruism', options: LIKERT_5 },
  { id: 'bf_a_8', text: 'Priorizo meus interesses acima dos outros.', framework: 'bigfive', dimension: 'agreeableness', facet: 'altruism', reverse: true, options: LIKERT_5 },
  { id: 'bf_a_9', text: 'Me preocupo genuinamente com o bem-estar alheio.', framework: 'bigfive', dimension: 'agreeableness', facet: 'altruism', options: LIKERT_5 },
  
  // Faceta: Cooperação
  { id: 'bf_a_10', text: 'Evito conflitos e busco consenso.', framework: 'bigfive', dimension: 'agreeableness', facet: 'cooperation', options: LIKERT_5 },
  { id: 'bf_a_11', text: 'Não hesito em confrontar os outros quando necessário.', framework: 'bigfive', dimension: 'agreeableness', facet: 'cooperation', reverse: true, options: LIKERT_5 },
  { id: 'bf_a_12', text: 'Prefiro ceder a criar desentendimentos.', framework: 'bigfive', dimension: 'agreeableness', facet: 'cooperation', options: LIKERT_5 },
  
  // Faceta: Modéstia
  { id: 'bf_a_13', text: 'Não gosto de chamar atenção para minhas conquistas.', framework: 'bigfive', dimension: 'agreeableness', facet: 'modesty', options: LIKERT_5 },
  { id: 'bf_a_14', text: 'Gosto de ser reconhecido e elogiado.', framework: 'bigfive', dimension: 'agreeableness', facet: 'modesty', reverse: true, options: LIKERT_5 },
  { id: 'bf_a_15', text: 'Sou humilde sobre minhas habilidades.', framework: 'bigfive', dimension: 'agreeableness', facet: 'modesty', options: LIKERT_5 },
  
  // Faceta: Simpatia
  { id: 'bf_a_16', text: 'Sinto empatia profunda pelo sofrimento dos outros.', framework: 'bigfive', dimension: 'agreeableness', facet: 'sympathy', options: LIKERT_5 },
  { id: 'bf_a_17', text: 'Mantenho distância emocional dos problemas alheios.', framework: 'bigfive', dimension: 'agreeableness', facet: 'sympathy', reverse: true, options: LIKERT_5 },
  { id: 'bf_a_18', text: 'O sofrimento dos outros me afeta pessoalmente.', framework: 'bigfive', dimension: 'agreeableness', facet: 'sympathy', options: LIKERT_5 },

  // NEUROTICISMO (18 questões)
  // Faceta: Ansiedade
  { id: 'bf_n_1', text: 'Me preocupo frequentemente com o futuro.', framework: 'bigfive', dimension: 'neuroticism', facet: 'anxiety', options: LIKERT_5 },
  { id: 'bf_n_2', text: 'Raramente me sinto ansioso ou preocupado.', framework: 'bigfive', dimension: 'neuroticism', facet: 'anxiety', reverse: true, options: LIKERT_5 },
  { id: 'bf_n_3', text: 'Fico nervoso facilmente em situações incertas.', framework: 'bigfive', dimension: 'neuroticism', facet: 'anxiety', options: LIKERT_5 },
  
  // Faceta: Raiva
  { id: 'bf_n_4', text: 'Me irrito com facilidade.', framework: 'bigfive', dimension: 'neuroticism', facet: 'anger', options: LIKERT_5 },
  { id: 'bf_n_5', text: 'Mantenho a calma mesmo sob pressão.', framework: 'bigfive', dimension: 'neuroticism', facet: 'anger', reverse: true, options: LIKERT_5 },
  { id: 'bf_n_6', text: 'Pequenas frustrações me deixam com raiva.', framework: 'bigfive', dimension: 'neuroticism', facet: 'anger', options: LIKERT_5 },
  
  // Faceta: Depressão
  { id: 'bf_n_7', text: 'Às vezes me sinto triste sem motivo aparente.', framework: 'bigfive', dimension: 'neuroticism', facet: 'depression', options: LIKERT_5 },
  { id: 'bf_n_8', text: 'Raramente me sinto desanimado ou para baixo.', framework: 'bigfive', dimension: 'neuroticism', facet: 'depression', reverse: true, options: LIKERT_5 },
  { id: 'bf_n_9', text: 'Tenho dificuldade em me sentir satisfeito.', framework: 'bigfive', dimension: 'neuroticism', facet: 'depression', options: LIKERT_5 },
  
  // Faceta: Autoconsciência
  { id: 'bf_n_10', text: 'Me preocupo muito com o que os outros pensam de mim.', framework: 'bigfive', dimension: 'neuroticism', facet: 'self-consciousness', options: LIKERT_5 },
  { id: 'bf_n_11', text: 'Não me importo com julgamentos alheios.', framework: 'bigfive', dimension: 'neuroticism', facet: 'self-consciousness', reverse: true, options: LIKERT_5 },
  { id: 'bf_n_12', text: 'Fico constrangido facilmente em situações sociais.', framework: 'bigfive', dimension: 'neuroticism', facet: 'self-consciousness', options: LIKERT_5 },
  
  // Faceta: Imoderação
  { id: 'bf_n_13', text: 'Tenho dificuldade em resistir a tentações.', framework: 'bigfive', dimension: 'neuroticism', facet: 'immoderation', options: LIKERT_5 },
  { id: 'bf_n_14', text: 'Tenho bom autocontrole sobre meus desejos.', framework: 'bigfive', dimension: 'neuroticism', facet: 'immoderation', reverse: true, options: LIKERT_5 },
  { id: 'bf_n_15', text: 'Às vezes exagero em coisas que me dão prazer.', framework: 'bigfive', dimension: 'neuroticism', facet: 'immoderation', options: LIKERT_5 },
  
  // Faceta: Vulnerabilidade
  { id: 'bf_n_16', text: 'Sob pressão, sinto que vou perder o controle.', framework: 'bigfive', dimension: 'neuroticism', facet: 'vulnerability', options: LIKERT_5 },
  { id: 'bf_n_17', text: 'Lido bem com crises e situações estressantes.', framework: 'bigfive', dimension: 'neuroticism', facet: 'vulnerability', reverse: true, options: LIKERT_5 },
  { id: 'bf_n_18', text: 'Me sinto sobrecarregado quando muita coisa acontece.', framework: 'bigfive', dimension: 'neuroticism', facet: 'vulnerability', options: LIKERT_5 },
];

