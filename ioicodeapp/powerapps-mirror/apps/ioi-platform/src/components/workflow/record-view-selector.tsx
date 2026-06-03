import { ArrowRight, Eye, Shield } from 'lucide-react';

interface RecordViewSelectorProps {
  formTitle: string;
  recordTitle: string;
  stageName: string;
  onSelect: (view: 'initiator' | 'actioner') => void;
}

export function RecordViewSelector({ formTitle, recordTitle, stageName, onSelect }: RecordViewSelectorProps) {
  return (
    <div className="mt-8 max-w-lg">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{formTitle}</p>
      <h2 className="text-2xl font-bold mb-2">{recordTitle}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        You appear in this record in more than one capacity. Choose how you want to view it.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSelect('initiator')}
          className="group text-left rounded-xl border bg-card p-5 hover:border-primary hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex rounded-full bg-blue-100 p-2.5">
              <Eye className="h-5 w-5 text-blue-600" />
            </span>
            <span className="font-semibold">Requestor View</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Track the status of your submission and see where it is in the approval workflow.
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium">
            Track my submission
            <ArrowRight className="h-3.5 w-3.5 ml-0.5 transition-transform group-hover:translate-x-1" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect('actioner')}
          className="group text-left rounded-xl border border-amber-200 bg-amber-50/40 p-5 hover:border-amber-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex rounded-full bg-amber-100 p-2.5">
              <Shield className="h-5 w-5 text-amber-600" />
            </span>
            <span className="font-semibold">Actioner View</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You have a pending action on this record. Current stage:{' '}
            <span className="font-medium text-foreground">{stageName}</span>.
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm text-amber-700 font-medium">
            Take action
            <ArrowRight className="h-3.5 w-3.5 ml-0.5 transition-transform group-hover:translate-x-1" />
          </div>
        </button>
      </div>
    </div>
  );
}
