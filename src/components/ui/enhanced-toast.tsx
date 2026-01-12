/**
 * @fileoverview Enhanced Toast Components with animations
 * Premium toast notifications with rich content and animations
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { toast as sonnerToast, ExternalToast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  Bell,
  
  Trophy,
  Rocket,
  PartyPopper,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ToastOptions extends ExternalToast {
  icon?: ReactNode;
  progress?: number;
  actionLabel?: string;
  onAction?: () => void;
}

// Enhanced toast functions with animations
export const enhancedToast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      icon: <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <CheckCircle2 className="h-5 w-5 text-success" />
      </motion.div>,
      className: "border-success/20 bg-success/5",
      ...options,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      icon: <motion.div
        animate={{ 
          x: [0, -3, 3, -3, 3, 0],
        }}
        transition={{ duration: 0.4 }}
      >
        <XCircle className="h-5 w-5 text-destructive" />
      </motion.div>,
      className: "border-destructive/20 bg-destructive/5",
      ...options,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      icon: <motion.div
        animate={{ 
          rotate: [0, -10, 10, -10, 10, 0],
        }}
        transition={{ duration: 0.5 }}
      >
        <AlertTriangle className="h-5 w-5 text-warning" />
      </motion.div>,
      className: "border-warning/20 bg-warning/5",
      ...options,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      icon: <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Info className="h-5 w-5 text-info" />
      </motion.div>,
      className: "border-info/20 bg-info/5",
      ...options,
    });
  },

  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, {
      icon: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
      ...options,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: ToastOptions
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      ...options,
    });
  },

  // Special celebration toasts
  celebration: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom(() => (
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30 shadow-lg"
      >
        <motion.div
          animate={{ 
            rotate: [0, 15, -15, 15, 0],
            scale: [1, 1.2, 1, 1.2, 1],
          }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
        >
          <PartyPopper className="h-8 w-8 text-primary" />
        </motion.div>
        <div>
          <p className="font-medium text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">Parabéns! 🎉</p>
        </div>
      </motion.div>
    ), {
      duration: 5000,
      ...options,
    });
  },

  achievement: (title: string, description: string, options?: ToastOptions) => {
    return sonnerToast.custom(() => (
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotateX: -90 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 shadow-lg"
      >
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            rotateY: [0, 360],
          }}
          transition={{ 
            y: { duration: 0.5, repeat: Infinity, repeatDelay: 0.5 },
            rotateY: { duration: 1, delay: 0.3 }
          }}
        >
          <Trophy className="h-8 w-8 text-yellow-500" />
        </motion.div>
        <div>
          <p className="font-bold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </motion.div>
    ), {
      duration: 6000,
      ...options,
    });
  },

  levelUp: (level: number, options?: ToastOptions) => {
    return sonnerToast.custom(() => (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-accent via-primary to-accent border-2 border-white/20 shadow-2xl"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 360],
          }}
          transition={{ 
            scale: { duration: 0.5, repeat: 2 },
            rotate: { duration: 1 }
          }}
        >
          <Rocket className="h-10 w-10 text-white" />
        </motion.div>
        <div>
          <motion.p 
            className="text-2xl font-black text-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3, repeat: 3 }}
          >
            NÍVEL {level}!
          </motion.p>
          <p className="text-sm text-white/80">Você subiu de nível! 🚀</p>
        </div>
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-white/40" />
        </motion.div>
      </motion.div>
    ), {
      duration: 5000,
      ...options,
    });
  },

  // Progress toast
  progress: (
    message: string, 
    progress: number, 
    options?: ToastOptions
  ) => {
    return sonnerToast.custom(() => (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="flex flex-col gap-2 p-4 rounded-xl bg-card border shadow-lg min-w-[300px]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="font-medium">{message}</span>
          </div>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </motion.div>
    ), options);
  },

  // Action toast with button
  action: (
    message: string,
    actionLabel: string,
    onAction: () => void,
    options?: ToastOptions
  ) => {
    return sonnerToast.custom((id) => (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card border shadow-lg min-w-[350px]"
      >
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-primary" />
          <span className="font-medium">{message}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              onAction();
              sonnerToast.dismiss(id);
            }}
          >
            {actionLabel}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => sonnerToast.dismiss(id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    ), {
      duration: 10000,
      ...options,
    });
  },

  // Dismiss toast
  dismiss: sonnerToast.dismiss,
};

// Toast with avatar (for notifications about users)
interface UserToastProps {
  userName: string;
  userAvatar?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showUserToast = ({ userName, userAvatar, message, action }: UserToastProps) => {
  return sonnerToast.custom((id) => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-card border shadow-lg"
    >
      <div className="flex-shrink-0">
        {userAvatar ? (
          <img 
            src={userAvatar} 
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{userName}</p>
        <p className="text-sm text-muted-foreground truncate">{message}</p>
      </div>
      {action && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            action.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  ), {
    duration: 5000,
  });
};

export default enhancedToast;
