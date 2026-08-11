import { useUpdateEntrevista } from "@/hooks/useEntrevistas";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useConfetti } from "@/components/ui/confetti";
import { enhancedToast } from "@/components/ui/enhanced-toast";

export function useAgendaActions() {
  const updateEntrevista = useUpdateEntrevista();
  const { playSuccess, playError, playNotification } = useSoundEffects();
  const { fireCelebration } = useConfetti();

  const handleConfirmar = async (id: string) => {
    try {
      await updateEntrevista.mutateAsync({ id, status: "confirmada" });
      playSuccess();
      enhancedToast.success("Entrevista confirmada!");
    } catch {
      playError();
      enhancedToast.error("Erro ao confirmar entrevista");
    }
  };

  const handleCancelar = async (id: string) => {
    if (!confirm("Deseja cancelar esta entrevista?")) return;
    try {
      await updateEntrevista.mutateAsync({ id, status: "cancelada" });
      playNotification();
      enhancedToast.warning("Entrevista cancelada");
    } catch {
      playError();
      enhancedToast.error("Erro ao cancelar");
    }
  };

  const handleNoShow = async (id: string) => {
    try {
      await updateEntrevista.mutateAsync({
        id,
        status: "realizada",
        feedback_resultado: "pendente",
      });
      playError();
      enhancedToast.error("No-show registrado");
    } catch {
      enhancedToast.error("Erro ao registrar no-show");
    }
  };

  const handleRegistrarFeedback = async (
    id: string,
    feedback: string,
    avaliacao: number,
  ): Promise<boolean> => {
    try {
      await updateEntrevista.mutateAsync({
        id,
        status: "realizada",
        feedback_comentarios: feedback,
        feedback_nota: avaliacao,
        feedback_resultado: avaliacao >= 3 ? "aprovado" : "reprovado",
        feedback_avaliado_em: new Date().toISOString(),
      });

      if (avaliacao >= 4) {
        fireCelebration();
        enhancedToast.celebration("Excelente feedback registrado!");
      } else {
        playSuccess();
        enhancedToast.success("Feedback registrado com sucesso");
      }
      return true;
    } catch {
      playError();
      enhancedToast.error("Erro ao registrar feedback");
      return false;
    }
  };

  return { handleConfirmar, handleCancelar, handleNoShow, handleRegistrarFeedback };
}
