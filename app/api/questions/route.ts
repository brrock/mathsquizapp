import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const questions = await prisma.question.findMany();
    // Shuffle questions using Fisher-Yates algorithm
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    return NextResponse.json(shuffledQuestions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { question, options, answer, imageUrl } = body;

    if (!question || !options || answer === undefined || options.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newQuestion = await prisma.question.create({
      data: {
        question,
        options,
        answer,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(newQuestion);
  } catch (error) {
    console.error('Failed to create question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}