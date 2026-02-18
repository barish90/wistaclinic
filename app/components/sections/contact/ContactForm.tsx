'use client';

import { FormEvent, useState } from 'react';
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
  successTitle?: string;
  successMessage?: string;
  successButton?: string;
}

interface ContactFormProps {
  labels: FormLabels;
  className?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FieldErrors {
  name?: string[];
  email?: string[];
  phone?: string[];
  message?: string[];
  _form?: string[];
}

export function ContactForm({ labels, className }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      procedure: formData.get('procedure') as string,
      message: formData.get('message') as string,
      honeypot: formData.get('_hp') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setStatus('error');
        setErrors(result.errors || { _form: ['Something went wrong. Please try again.'] });
        return;
      }

      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
      setErrors({ _form: ['Network error. Please check your connection and try again.'] });
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
      onSubmit={handleSubmit}
      className={cn('space-y-6 bg-card rounded-xl p-8 border border-bronze/20', className)}
    >
      {/* Honeypot - hidden from users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      {errors._form && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errors._form[0]}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="font-semibold">
          {labels.name}
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          className={cn('border-bronze/20 focus:border-bronze', errors.name && 'border-destructive')}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="font-semibold">
          {labels.email}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className={cn('border-bronze/20 focus:border-bronze', errors.email && 'border-destructive')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email[0]}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="font-semibold">
          {labels.phone}
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          className={cn('border-bronze/20 focus:border-bronze', errors.phone && 'border-destructive')}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone[0]}</p>}
      </div>

      {/* Procedure of Interest */}
      <div className="space-y-2">
        <Label htmlFor="procedure" className="font-semibold">
          {labels.procedure}
        </Label>
        <Select name="procedure">
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
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="font-semibold">
          {labels.message}
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={labels.messagePlaceholder}
          className={cn('border-bronze/20 focus:border-bronze resize-none', errors.message && 'border-destructive')}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message[0]}</p>}
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
            Sending...
          </>
        ) : (
          labels.submit
        )}
      </Button>
    </form>
  );
}
