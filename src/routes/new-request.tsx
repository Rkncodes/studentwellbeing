import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, SendHorizontal } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { triageService } from '../services';

export function NewRequestPage() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (description.trim().length < 10) {
      setError('Please describe your issue in a bit more detail (at least 10 characters).');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const triage = await triageService.triage(description.trim());
      navigate('/new-request/triage', { state: { description: description.trim(), triage } });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="New Support Request"
        description="Describe what's going on in your own words. We'll route it to the right campus service."
      />

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6">
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
          What's going on?
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="e.g. I'm really stressed about my tuition bill and I'm not sure how to keep up with classes right now..."
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">This information is used only to route your request.</p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <SendHorizontal className="h-4 w-4" /> Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
