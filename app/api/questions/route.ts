import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const ALLOWED_IPS = ['127.0.0.1']; // Add your IP addresses

async function checkIP(ip: string) {
  return ALLOWED_IPS.includes(ip);
}

export async function GET() {
  try {
    const questions = await prisma.question.findMany();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1';

  if (!await checkIP(ip)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { question, options, answer } = body;

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