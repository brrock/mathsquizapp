"use client";

import { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuestionFormProps {
  onSuccess: () => void;
}

export function QuestionForm({ onSuccess }: QuestionFormProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || options.some(opt => !opt) || correctAnswer === null) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          options,
          answer: correctAnswer,
        }),
      });

      if (!response.ok) throw new Error('Failed to add question');
      
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(null);
      onSuccess();
    } catch (error) {
      console.error('Failed to add question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Options</Label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Correct Answer</Label>
        <RadioGroup
          value={correctAnswer?.toString()}
          onValueChange={(value) => setCorrectAnswer(parseInt(value))}
          className="space-y-2"
        >
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
              <Label htmlFor={`answer-${index}`}>{option || `Option ${index + 1}`}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !question || options.some(opt => !opt) || correctAnswer === null}
      >
        {isSubmitting ? 'Adding Question...' : 'Add Question'}
      </Button>
    </form>
  );
}