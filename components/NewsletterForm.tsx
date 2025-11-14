'use client';

import { useState, FormEvent } from 'react';

interface NewsletterFormProps {
  className?: string;
  showName?: boolean;
  placeholder?: string;
  buttonText?: string;
  inline?: boolean;
}

export function NewsletterForm({
  className = '',
  showName = false,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  inline = true,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: showName ? firstName : undefined,
          lastName: showName ? lastName : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || 'Successfully subscribed!',
        });
        setEmail('');
        setFirstName('');
        setLastName('');
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to subscribe. Please try again.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const formClasses = inline
    ? 'flex gap-2 flex-col sm:flex-row'
    : 'space-y-4';

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className={formClasses}>
        {showName && (
          <div className={inline ? 'flex gap-2 flex-1' : 'grid grid-cols-2 gap-2'}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={loading}
          className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading || !email}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Subscribing...' : buttonText}
        </button>
      </form>

      {message.type && (
        <div
          className={`mt-4 rounded-lg p-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
