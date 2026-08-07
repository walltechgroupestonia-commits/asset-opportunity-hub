import { evaluateOpportunity } from "@/lib/walltech";
import { walltechCoreDemo } from "@/data/walltechCoreDemo";

export function CoreDecisionPreview() {
  const decision = evaluateOpportunity(walltechCoreDemo);
  return (
    <section className="border border-slate-700 bg-slate-950 p-6 text-slate-100">
      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-amber-400">Walltech Intelligence Engine™ Core</p>
      <h2 className="mb-6 text-2xl font-semibold">Decisione operativa</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Condition" value={decision.condition} />
        <Metric label="Readiness" value={decision.readiness} />
        <Metric label="Outcome" value={decision.outcome} />
        <Metric label="Priority" value={decision.priority} />
      </div>
      <div className="mt-6 border border-amber-500/40 bg-amber-500/5 p-4">
        <p className="text-sm font-semibold text-amber-300">Next Action</p>
        <p className="mt-2 text-sm text-slate-300">{decision.nextAction}</p>
      </div>
      {decision.warnings.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold">Warnings</p>
          <ul className="space-y-2 text-sm text-slate-400">
            {decision.warnings.map((warning) => <li key={warning.code}>{warning.blocking ? "BLOCK — " : ""}{warning.message}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="border border-slate-800 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold">{value}</p></div>;
}
