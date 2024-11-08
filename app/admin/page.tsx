"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { QuestionForm } from '@/components/admin/question-form';
import { ModeToggle } from '@/components/theme-toggler';

export default function AdminPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Question added successfully!",
    });
    router.refresh();
  };

  return (
    <><div className="top-left"><ModeToggle /></div><div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </div></>
  );
}