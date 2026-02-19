import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoDetails {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface ContactInfoProps {
  info: InfoDetails;
  className?: string;
}

export function ContactInfo({ info, className }: ContactInfoProps) {
  const digitsOnly = info.phone.replace(/[^\d+]/g, '');
  const sanitizedPhone = digitsOnly.startsWith('+')
    ? '+' + digitsOnly.slice(1).replace(/\+/g, '')
    : digitsOnly.replace(/\+/g, '');

  const contactItems = [
    { icon: MapPin, label: 'Address', value: info.address },
    { icon: Phone, label: 'Phone', value: info.phone, href: `tel:${sanitizedPhone}` },
    { icon: Mail, label: 'Email', value: info.email, href: `mailto:${info.email}` },
    { icon: Clock, label: 'Hours', value: info.hours },
  ];

  return (
    <div className={cn('space-y-8', className)}>
      <div className="space-y-6">
        {contactItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-bronze/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-bronze-deep" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    aria-label={`${item.label}: ${item.value}`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-muted-foreground">{item.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
