import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  procedure: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (e) {
      if (e instanceof SyntaxError) {
        return NextResponse.json(
          { success: false, errors: { _form: ['Invalid JSON in request body.'] } },
          { status: 400 }
        );
      }
      throw e;
    }

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Log submission (ready for future email service integration)
    console.log('Contact form submission:', {
      procedure: result.data.procedure || 'Not specified',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will contact you soon!',
    });
  } catch (error) {
    console.error('Error in contact route:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { success: false, errors: { _form: ['An unexpected error occurred. Please try again.'] } },
      { status: 500 }
    );
  }
}
