/**
 * @fileoverview Banco de questões para testes de personalidade
 * 80+ questões para cada framework: Big Five, MBTI e Eneagrama
 */

import { PersonalityQuestion } from '@/types/personality';

// ================================
// OPÇÕES PADRÃO LIKERT
// ================================

const LIKERT_5 = [
  { value: 1, label: 'Discordo totalmente' },
  { value: 2, label: 'Discordo' },
  { value: 3, label: 'Neutro' },
  { value: 4, label: 'Concordo' },
  { value: 5, label: 'Concordo totalmente' },
];

const LIKERT_7 = [
  { value: 1, label: 'Discordo totalmente' },
  { value: 2, label: 'Discordo muito' },
  { value: 3, label: 'Discordo pouco' },
  { value: 4, label: 'Neutro' },
  { value: 5, label: 'Concordo pouco' },
  { value: 6, label: 'Concordo muito' },
  { value: 7, label: 'Concordo totalmente' },
];

// ================================
// BIG FIVE - 90 QUESTÕES
// ================================

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

// ================================
// MBTI - 88 QUESTÕES
// ================================

export const MBTI_QUESTIONS: PersonalityQuestion[] = [
  // EXTROVERSÃO vs INTROVERSÃO (22 questões)
  { id: 'mbti_ei_1', text: 'Em uma festa, prefiro conversar com muitas pessoas diferentes.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_2', text: 'Preciso de tempo sozinho para recarregar minhas energias.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_3', text: 'Penso melhor quando falo em voz alta.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_4', text: 'Prefiro refletir antes de compartilhar minhas ideias.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_5', text: 'Me sinto energizado após interações sociais longas.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_6', text: 'Multidões e ambientes barulhentos me drenam.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_7', text: 'Sou geralmente a pessoa que inicia conversas.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_8', text: 'Prefiro ouvir a falar em grupos.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_9', text: 'Trabalho melhor em ambientes colaborativos.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_10', text: 'Produzo mais quando trabalho sozinho.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_11', text: 'Gosto de ser o centro das atenções.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_12', text: 'Prefiro ficar nos bastidores.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_13', text: 'Processo informações conversando com outros.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_14', text: 'Preciso de silêncio para pensar claramente.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_15', text: 'Tenho um círculo amplo de conhecidos.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_16', text: 'Tenho poucos amigos, mas muito próximos.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_17', text: 'Expresso facilmente o que estou sentindo.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_18', text: 'Sou reservado sobre meus sentimentos.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_19', text: 'Aprendo melhor em discussões em grupo.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_20', text: 'Aprendo melhor estudando sozinho.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },
  { id: 'mbti_ei_21', text: 'Fico entediado facilmente quando estou sozinho.', framework: 'mbti', dimension: 'EI', options: LIKERT_7 },
  { id: 'mbti_ei_22', text: 'Aprecio momentos de solidão.', framework: 'mbti', dimension: 'EI', reverse: true, options: LIKERT_7 },

  // SENSAÇÃO vs INTUIÇÃO (22 questões)
  { id: 'mbti_sn_1', text: 'Confio mais em fatos concretos que em teorias.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_2', text: 'Confio em minha intuição para entender situações.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_3', text: 'Prefiro instruções detalhadas e passo a passo.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_4', text: 'Prefiro ter liberdade para criar minha própria abordagem.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_5', text: 'Foco no presente e no que é real agora.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_6', text: 'Penso constantemente em possibilidades futuras.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_7', text: 'Valorizo experiência prática acima de tudo.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_8', text: 'Valorizo inovação e novas ideias.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_9', text: 'Sou muito atento a detalhes.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_10', text: 'Prefiro ver o quadro geral antes dos detalhes.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_11', text: 'Prefiro métodos comprovados e testados.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_12', text: 'Gosto de experimentar novas abordagens.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_13', text: 'Descrevo as coisas de forma literal e direta.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_14', text: 'Uso metáforas e analogias para me expressar.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_15', text: 'Gosto de rotina e previsibilidade.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_16', text: 'Fico entediado com tarefas repetitivas.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_17', text: 'Sou realista sobre o que pode ser alcançado.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_18', text: 'Sou otimista sobre o que é possível.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_19', text: 'Lembro de detalhes específicos de eventos.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_20', text: 'Lembro de impressões gerais, não detalhes.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },
  { id: 'mbti_sn_21', text: 'Prefiro trabalhar com dados e números.', framework: 'mbti', dimension: 'SN', options: LIKERT_7 },
  { id: 'mbti_sn_22', text: 'Prefiro trabalhar com conceitos e significados.', framework: 'mbti', dimension: 'SN', reverse: true, options: LIKERT_7 },

  // PENSAMENTO vs SENTIMENTO (22 questões)
  { id: 'mbti_tf_1', text: 'Tomo decisões baseado em lógica e análise.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_2', text: 'Considero como as decisões afetam as pessoas.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_3', text: 'Valorizo justiça e imparcialidade.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_4', text: 'Valorizo harmonia e compaixão.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_5', text: 'Prefiro ser honesto do que diplomático.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_6', text: 'Prefiro ser gentil do que brutalmente honesto.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_7', text: 'Críticas construtivas não me ofendem.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_8', text: 'Levo críticas de forma pessoal.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_9', text: 'Debato ideias de forma impessoal.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_10', text: 'Evito conflitos para preservar relacionamentos.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_11', text: 'Problemas devem ser resolvidos objetivamente.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_12', text: 'Problemas devem considerar todos os sentimentos.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_13', text: 'Sou visto como assertivo e direto.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_14', text: 'Sou visto como caloroso e empático.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_15', text: 'Questiono a lógica por trás das regras.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_16', text: 'Questiono como as regras afetam as pessoas.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_17', text: 'Prefiro feedback objetivo e analítico.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_18', text: 'Prefiro feedback encorajador e positivo.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_19', text: 'Respeito é conquistado por competência.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_20', text: 'Respeito é conquistado por bondade.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },
  { id: 'mbti_tf_21', text: 'Priorizo eficiência sobre sentimentos.', framework: 'mbti', dimension: 'TF', options: LIKERT_7 },
  { id: 'mbti_tf_22', text: 'Priorizo o bem-estar das pessoas envolvidas.', framework: 'mbti', dimension: 'TF', reverse: true, options: LIKERT_7 },

  // JULGAMENTO vs PERCEPÇÃO (22 questões)
  { id: 'mbti_jp_1', text: 'Gosto de ter as coisas decididas e finalizadas.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_2', text: 'Prefiro manter minhas opções em aberto.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_3', text: 'Planejo com antecedência e sigo o plano.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_4', text: 'Adapto meus planos conforme as coisas acontecem.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_5', text: 'Cumprir prazos é muito importante para mim.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_6', text: 'Vejo prazos como sugestões flexíveis.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_7', text: 'Gosto de ter uma rotina estruturada.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_8', text: 'Prefiro espontaneidade e flexibilidade.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_9', text: 'Termino tarefas antes de relaxar.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_10', text: 'Trabalho bem sob pressão de última hora.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_11', text: 'Gosto de listas e organização.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_12', text: 'Prefiro ir com o fluxo.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_13', text: 'Tomo decisões rapidamente.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_14', text: 'Demoro para me comprometer com decisões.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_15', text: 'Mudanças inesperadas me incomodam.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_16', text: 'Abraço mudanças e novas possibilidades.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_17', text: 'Gosto de ter controle sobre meu ambiente.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_18', text: 'Sou confortável com incertezas.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_19', text: 'Prefiro finalizar projetos a começar novos.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_20', text: 'Adoro começar novos projetos.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
  { id: 'mbti_jp_21', text: 'Sou metódico e sistemático.', framework: 'mbti', dimension: 'JP', options: LIKERT_7 },
  { id: 'mbti_jp_22', text: 'Sou casual e descontraído.', framework: 'mbti', dimension: 'JP', reverse: true, options: LIKERT_7 },
];

// ================================
// ENEAGRAMA - 81 QUESTÕES (9 por tipo)
// ================================

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

// ================================
// EXPORTAÇÃO CONSOLIDADA
// ================================

export const ALL_PERSONALITY_QUESTIONS = [
  ...BIG_FIVE_QUESTIONS,
  ...MBTI_QUESTIONS,
  ...ENNEAGRAM_QUESTIONS,
];

export function getQuestionsByFramework(framework: 'bigfive' | 'mbti' | 'enneagram'): PersonalityQuestion[] {
  switch (framework) {
    case 'bigfive':
      return BIG_FIVE_QUESTIONS;
    case 'mbti':
      return MBTI_QUESTIONS;
    case 'enneagram':
      return ENNEAGRAM_QUESTIONS;
    default:
      return [];
  }
}

export function shuffleQuestions(questions: PersonalityQuestion[]): PersonalityQuestion[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp!;
  }
  return shuffled;
}
