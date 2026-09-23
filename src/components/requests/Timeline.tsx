import { CheckCircle2, CircleDot } from 'lucide-react';
import type { TimelineEvent } from '../../models/request';
import { formatDateTime } from '../../lib/utils';

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative border-l border-slate-200 pl-6">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <li key={event.id} className="mb-6 last:mb-0">
            <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-white">
              {isLast ? (
                <CircleDot className="h-4 w-4 text-indigo-600" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-slate-400" />
              )}
            </span>
            <p className="text-sm font-medium text-slate-800">{event.label}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {formatDateTime(event.timestamp)} · {event.actor}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
