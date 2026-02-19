'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { procedures } from '@/lib/data/procedures';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FormLabels {
  name: string;
  email: string;
  phone: string;
  procedure: string;
  selectProcedure: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting?: string;
  successTitle?: string;
  successMessage?: string;
  successButton?: string;
  errorMessages?: {
    nameMin?: string;
    emailInvalid?: string;
    phoneMin?: string;
    messageMin?: string;
  };
}

interface ContactFormProps {
  labels: FormLabels;
  className?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const STORAGE_KEY = 'wista_contact_form';

export function ContactForm({ labels, className }: ContactFormProps) {
  const contactFormSchema = z.object({
    name: z.string().min(2, labels.errorMessages?.nameMin ?? 'Name must be at least 2 characters'),
    email: z.string().email(labels.errorMessages?.emailInvalid ?? 'Invalid email address'),
    phone: z.string().min(5, labels.errorMessages?.phoneMin ?? 'Phone number is required'),
    procedure: z.string().optional(),
    message: z.string().min(10, labels.errorMessages?.messageMin ?? 'Message must be at least 10 characters'),
    honeypot: z.string().max(0, 'Bot detected').optional(),
  });

  type ContactFormValues = z.infer<typeof contactFormSchema>;
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      procedure: '',
      message: '',
      honeypot: '',
    },
  });

  // Restore saved form values from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ContactFormValues>;
        reset({
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          procedure: parsed.procedure || '',
          message: parsed.message || '',
          honeypot: '',
        });
      }
    } catch { /* localStorage unavailable or corrupted */ }
  }, [reset]);

  // Persist form values to localStorage on change
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        const { honeypot: _, ...saveable } = values;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveable));
      } catch { /* quota or private mode */ }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('submitting');
    setFormError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        setStatus('error');
        setFormError('Something went wrong. Please try again.');
        return;
      }

      if (!response.ok || !result.success) {
        setStatus('error');
        const serverErrors = result.errors as Record<string, string[]> | undefined;
        if (serverErrors) {
          for (const [field, messages] of Object.entries(serverErrors)) {
            if (field === '_form') {
              setFormError(messages[0]);
            } else if (field in contactFormSchema.shape) {
              setError(field as keyof ContactFormValues, {
                type: 'server',
                message: messages[0],
              });
            }
          }
        } else {
          setFormError('Something went wrong. Please try again.');
        }
        return;
      }

      setStatus('success');
      reset();
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    } catch {
      setStatus('error');
      setFormError('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4 bg-card rounded-xl p-12 border border-bronze/20 text-center', className)}>
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h3 className="font-serif text-2xl font-semibold">{labels.successTitle ?? 'Thank you!'}</h3>
        <p className="text-muted-foreground max-w-md">
          {labels.successMessage ?? 'Your message has been sent successfully. Our team will get back to you within 24 hours.'}
        </p>
        <Button
          variant="outline"
          onClick={() => setStatus('idle')}
          className="mt-4"
        >
          {labels.successButton ?? 'Send Another Message'}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-6 bg-card rounded-xl p-8 border border-bronze/20', className)}
    >
      {/* Honeypot - hidden from users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
      </div>

      {formError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="font-semibold">
          {labels.name}
        </Label>
        <Input
          id="name"
          type="text"
          className={cn('border-bronze/20 focus:border-bronze', errors.name && 'border-destructive')}
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="font-semibold">
          {labels.email}
        </Label>
        <Input
          id="email"
          type="email"
          className={cn('border-bronze/20 focus:border-bronze', errors.email && 'border-destructive')}
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="font-semibold">
          {labels.phone}
        </Label>
        <Input
          id="phone"
          type="tel"
          className={cn('border-bronze/20 focus:border-bronze', errors.phone && 'border-destructive')}
          {...register('phone')}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      {/* Procedure of Interest */}
      <div className="space-y-2">
        <Label htmlFor="procedure" className="font-semibold">
          {labels.procedure}
        </Label>
        <Controller
          name="procedure"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-bronze/20 focus:border-bronze">
                  <SelectValue placeholder={labels.selectProcedure} />
                </SelectTrigger>
                <SelectContent>
                  {procedures.map((procedure) => (
                    <SelectItem key={procedure.slug} value={procedure.slug}>
                      {procedure.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="font-semibold">
          {labels.message}
        </Label>
        <Textarea
          id="message"
          rows={5}
          placeholder={labels.messagePlaceholder}
          className={cn('border-bronze/20 focus:border-bronze resize-none', errors.message && 'border-destructive')}
          {...register('message')}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-bronze hover:bg-bronze-deep text-white font-semibold py-6 text-lg"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {labels.submitting ?? 'Sending...'}
          </>
        ) : (
          labels.submit
        )}
      </Button>
    </form>
  );
}
