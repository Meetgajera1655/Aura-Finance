import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft, Trophy, Sparkles } from "lucide-react";

interface SkillChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  xpReward: number;
}

const ChallengePage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<SkillChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (challengeId) {
      setLoading(true);
      fetch(`/api/v1/education/skill-challenge/${challengeId}`)
        .then(res => {
          if (!res.ok) throw new Error("Challenge not found");
          return res.json();
        })
        .then(data => {
          setChallenge(data.challenge);
          setError(null);
        })
        .catch(err => {
          console.error("Error fetching challenge details:", err);
          setError(err.message || "Failed to load challenge details");
        })
        .finally(() => setLoading(false));
    }
  }, [challengeId]);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">Easy</span>;
      case "Medium":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">Medium</span>;
      case "Hard":
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-medium">Hard</span>;
      default:
        return null;
    }
  };

  const handleCompleteChallenge = () => {
    setCompleted(true);
    // Optionally trigger API update for XP tracking here if endpoints become available
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          <p className="font-medium">{error || "Challenge item could not be retrieved."}</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2 mx-auto">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Challenges
      </Button>

      <Card className="border-2 overflow-hidden shadow-sm hover:shadow transition-shadow">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-background border-b pb-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                {getDifficultyBadge(challenge.difficulty)}
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full">
                  <Trophy className="h-3 w-3" /> {challenge.xpReward} XP Reward
                </span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">{challenge.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Challenge Overview</h3>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{challenge.description}</p>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Instructions & Execution Criteria
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Review the provided concept details carefully.</li>
              <li>Apply standard portfolio optimization rules mapped to your client profile.</li>
              <li>Confirm all parameter calculations prior to completion logging.</li>
            </ul>
          </div>

          <div className="pt-4 flex justify-end border-t">
            {completed ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 px-4 py-2.5 rounded-lg font-medium">
                <CheckCircle2 className="h-5 w-5" /> Challenge Successfully Completed! (+{challenge.xpReward} XP)
              </div>
            ) : (
              <Button size="lg" onClick={handleCompleteChallenge} className="font-semibold shadow-md px-8">
                Complete Challenge
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengePage;
