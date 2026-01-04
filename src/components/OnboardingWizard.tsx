'use client';

import { useState, useEffect, useMemo } from 'react';
import { CheckCircleIcon, UserGroupIcon, ArrowPathIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

interface OnboardingWizardProps {
  playersCount: number;
  selectedPlayersCount: number;
  hasDrawnTeams: boolean;
  onOpenPlayerModal: () => void;
}

export default function OnboardingWizard({
  playersCount,
  selectedPlayersCount,
  hasDrawnTeams,
  onOpenPlayerModal
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWizard, setShowWizard] = useState(true);

  const steps = useMemo(() => [
    {
      id: 1,
      title: "Adicione Jogadores",
      description: "Comece cadastrando os jogadores que participarão dos sorteios",
      icon: UserGroupIcon,
      action: "Adicionar Jogadores",
      completed: playersCount > 0,
      actionHandler: onOpenPlayerModal,
      condition: playersCount === 0
    },
    {
      id: 2,
      title: "Selecione Participantes",
      description: "Escolha quais jogadores vão participar deste sorteio",
      icon: CheckCircleIcon,
      action: "Selecionar Jogadores",
      completed: selectedPlayersCount > 0,
      actionHandler: onOpenPlayerModal,
      condition: playersCount > 0 && selectedPlayersCount === 0
    },
    {
      id: 3,
      title: "Sorteie os Times",
      description: "Clique no botão para criar times equilibrados automaticamente",
      icon: ArrowPathIcon,
      action: "Sortear Times",
      completed: false, // Sempre disponível quando tem jogadores selecionados
      actionHandler: null,
      condition: selectedPlayersCount > 0 && !hasDrawnTeams
    },
    {
      id: 4,
      title: "Aproveite os Times",
      description: "Seus times estão prontos! Copie e compartilhe com todos",
      icon: TrophyIcon,
      action: "Ver Times",
      completed: hasDrawnTeams,
      actionHandler: null,
      condition: hasDrawnTeams
    }
  ], [playersCount, selectedPlayersCount, hasDrawnTeams, onOpenPlayerModal]);

  // Auto-avançar para o próximo passo disponível
  useEffect(() => {
    const nextIncompleteStep = steps.findIndex(step => !step.completed && step.condition);
    if (nextIncompleteStep !== -1) {
      setCurrentStep(nextIncompleteStep);
    } else if (hasDrawnTeams) {
      setCurrentStep(3); // Último passo
    }
  }, [playersCount, selectedPlayersCount, hasDrawnTeams, steps]);

  // Esconder wizard após completar todos os passos
  useEffect(() => {
    if (hasDrawnTeams) {
      const timer = setTimeout(() => setShowWizard(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasDrawnTeams]);

  if (!showWizard) return null;

  const activeStep = steps[currentStep];
  const progressPercentage = ((steps.filter(step => step.completed).length) / steps.length) * 100;

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-xl p-4 border border-blue-200 dark:border-slate-600 shadow-lg animate-fade-in-up">
      {/* Header compacto com progresso inline */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-lg">🚀</div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Vamos começar!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Siga os passos para sortear times
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {steps.filter(step => step.completed).length}/{steps.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              completo{steps.filter(step => step.completed).length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progresso compacta */}
      <div className="mb-4">
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Passos compactos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.completed;
          const isActive = index === currentStep;
          const isPast = index < currentStep;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                  : isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md'
                  : isPast
                  ? 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-1.5 rounded-md ${
                  isCompleted
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  {isCompleted ? (
                    <CheckCircleSolidIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                  ) : (
                    <Icon className={`h-3 w-3 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`} />
                  )}
                </div>
                <div className={`text-xs font-semibold ${
                  isCompleted
                    ? 'text-green-700 dark:text-green-300'
                    : isActive
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {step.id}
                </div>
              </div>
              <h4 className={`text-xs font-medium mb-1 leading-tight ${
                isCompleted
                  ? 'text-green-800 dark:text-green-200'
                  : isActive
                  ? 'text-blue-800 dark:text-blue-200'
                  : 'text-slate-700 dark:text-slate-300'
              }`}>
                {step.title}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Ação do passo atual - inline */}
      {activeStep && activeStep.actionHandler && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {activeStep.description}
          </div>
          <button
            onClick={activeStep.actionHandler}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm"
          >
            <activeStep.icon className="h-4 w-4 mr-2" />
            {activeStep.action}
          </button>
        </div>
      )}

      {/* Botão para fechar wizard - compacto */}
      <div className="text-right">
        <button
          onClick={() => setShowWizard(false)}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          ✕ Ocultar guia
        </button>
      </div>
    </div>
  );
}
