"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/theme-toggler";
import Image from "next/image";

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number;
  imageUrl?: string; // Changed from image to imageUrl
  createdAt: string;
  updatedAt: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`/api/questions?t=${timestamp}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((error) => {
        console.error("Failed to fetch questions:", error);
        toast({
          title: "Error",
          description: "Failed to load quiz questions. Please try again later.",
          variant: "destructive",
        });
      });
  }, []);

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done! Keep going!",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${
          questions[currentQuestion].options[questions[currentQuestion].answer]
        }`,
        variant: "destructive",
      });
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Quiz Complete!
            </CardTitle>
            <CardDescription className="text-xl text-center mt-4">
              Your score: {score} out of {questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <Progress
              value={(score / questions.length) * 100}
              className="w-full h-4"
            />
            <p className="text-center mt-4 text-muted-foreground">
              {score === questions.length
                ? "Perfect score! Outstanding!"
                : score >= questions.length * 0.7
                ? "Great job! Keep it up!"
                : "Good effort! Try again to improve your score!"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="w-full max-w-xs"
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              Score: {score}
            </span>
          </div>
          <Progress
            value={(currentQuestion / questions.length) * 100}
            className="mb-4"
          />
          <CardTitle className="text-2xl">
            {questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions[currentQuestion].imageUrl && (
            <div className="relative w-full h-60 rounded-lg overflow-hidden">
              <Image
                src={questions[currentQuestion].imageUrl}
                alt="Question image"
                fill
                className="object-contain bg-neutral-100 dark:bg-neutral-900"
                priority
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  const target = e.target as HTMLElement;
                  if (target.parentElement) {
                    target.parentElement.style.display = "none";
                  }
                }}
              />
            </div>
          )}
          <RadioGroup
            value={selectedAnswer !== null ? selectedAnswer.toString() : ""}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-4"
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-4 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="text-lg cursor-pointer w-full"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            onClick={handleAnswer}
            disabled={selectedAnswer === null}
            className="w-full"
          >
            {currentQuestion === questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
