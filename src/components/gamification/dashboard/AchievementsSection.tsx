import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AchievementGrid, type Achievement } from "../AchievementBadge";

interface AchievementsSectionProps {
  all: Achievement[];
  unlocked: Achievement[];
  inProgress: Achievement[];
  locked: Achievement[];
}

export function AchievementsSection({ all, unlocked, inProgress, locked }: AchievementsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Conquistas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unlocked">Desbloqueadas ({unlocked.length})</TabsTrigger>
            <TabsTrigger value="progress">Em Progresso ({inProgress.length})</TabsTrigger>
            <TabsTrigger value="locked">Bloqueadas ({locked.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <AchievementGrid achievements={all} size="md" columns={4} />
          </TabsContent>
          <TabsContent value="unlocked" className="mt-4">
            <AchievementGrid achievements={unlocked} size="md" columns={4} />
          </TabsContent>
          <TabsContent value="progress" className="mt-4">
            <AchievementGrid achievements={inProgress} size="md" columns={4} />
          </TabsContent>
          <TabsContent value="locked" className="mt-4">
            <AchievementGrid achievements={locked} size="md" columns={4} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
