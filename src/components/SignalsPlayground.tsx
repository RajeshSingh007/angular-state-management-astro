import { useState, useCallback, useRef, useEffect } from 'react';
import Toast from './shared/Toast';

const BTN_COLOR = 'rgb(10, 102, 194)';

interface EffectLog { msg: string; type: 'info' | 'success' | 'error' }

function Btn({ label, onClick, color }: { label: string; onClick: () => void; color?: string }) {
  return (
    <button onClick={onClick}
      style={{ backgroundColor: color || BTN_COLOR }}
      className="px-3 py-1.5 text-white rounded-lg text-xs font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95">
      {label}
    </button>
  );
}

export default function SignalsPlayground() {
  const [count, setCount] = useState(0);
  const [step, setStep]   = useState(1);
  const [name, setName]   = useState('Angular');
  const [log, setLog]     = useState<EffectLog[]>([]);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  const prevCount = useRef(count);

  // Simulated effect() — runs whenever count changes
  useEffect(() => {
    if (count === prevCount.current) return;
    const doubled = count * 2;
    const entry: EffectLog = {
      msg: `effect() fired → count changed to ${count}, doubled = ${doubled}`,
      type: 'info',
    };
    setLog(l => [entry, ...l].slice(0, 10));
    prevCount.current = count;
  }, [count]);

  const increment = useCallback(() => {
    setCount(c => {
      setToast({
        title: '⚡ signal(count).set(count + step)',
        body: `<b style="color:#a5d6a7">Signals are synchronous</b> — no Observable, no subscription, no async pipe.<br><br><b style="color:#81d4fa">📝 Code:</b><br><code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">count.set(count() + ${step})</code><br><br>Any <code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">computed()</code> or template that reads this signal <strong>automatically re-evaluates</strong>.`,
      });
      return c + step;
    });
  }, [step]);

  const decrement = useCallback(() => {
    setCount(c => Math.max(0, c - step));
  }, [step]);

  const reset = useCallback(() => {
    setCount(0);
    setLog([]);
  }, []);

  const doubled  = count * 2;
  const isEven   = count % 2 === 0;
  const greeting = `Hello, ${name}! Count is ${count}.`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT: Signal state */}
        <div className="space-y-4">
          {/* signal() */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-bold text-sm mb-1 text-gray-700">⚡ signal()</h4>
            <p className="text-xs text-gray-400 mb-3">A writable reactive value. Setting it notifies all readers automatically.</p>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-4">
              {[
                ['count()',  String(count),  'bg-green-50 border-green-400 text-green-700'],
                ['step()',   String(step),   'bg-blue-50 border-blue-400 text-blue-700'],
                ['name()',   name,           'bg-purple-50 border-purple-400 text-purple-700'],
              ].map(([label, val, cls]) => (
                <div key={label} className={`${cls} border-2 rounded-xl p-3 text-center`}>
                  <p className="font-bold text-lg">{val}</p>
                  <p className="text-[10px] opacity-70 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Btn label={`➕ +${step}`} onClick={increment} color="rgb(22,163,74)" />
              <Btn label={`➖ -${step}`} onClick={decrement} color="rgb(220,38,38)" />
              <Btn label="🔄 Reset"      onClick={reset} />
              <select value={step} onChange={e => setStep(Number(e.target.value))}
                className="px-2 py-1.5 rounded-lg text-xs border-2 border-gray-300 font-semibold cursor-pointer">
                {[1,2,5,10].map(n => <option key={n} value={n}>step = {n}</option>)}
              </select>
            </div>
          </div>

          {/* computed() */}
          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-amber-400">
            <h4 className="font-bold text-sm mb-1 text-amber-700">🔢 computed()</h4>
            <p className="text-xs text-gray-400 mb-3">Derived values — auto-recompute when their signal dependencies change. Read-only.</p>
            <div className="space-y-2 font-mono text-xs">
              {[
                ['doubled()',  String(doubled),   'bg-amber-50 border-amber-400 text-amber-700',  'count * 2'],
                ['isEven()',   String(isEven),    'bg-orange-50 border-orange-400 text-orange-700','count % 2 === 0'],
                ['greeting()', greeting,          'bg-yellow-50 border-yellow-400 text-yellow-700','`Hello, ${name()}! Count is ${count()}.`'],
              ].map(([label, val, cls, formula]) => (
                <div key={label} className={`${cls} border-l-4 px-3 py-2 rounded flex justify-between items-center`}>
                  <span>{label} <span className="text-gray-400 text-[10px]">= {formula}</span></span>
                  <span className="font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: effect() log */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-green-400">
            <h4 className="font-bold text-sm mb-1 text-green-700">🔁 effect() Log</h4>
            <p className="text-xs text-gray-400 mb-3">effect() runs automatically whenever a signal it reads changes. Like a side-effect watcher.</p>
            {log.length === 0
              ? <p className="text-xs text-gray-400 italic">Change the count to see effect() fire...</p>
              : log.map((e, i) => (
                <div key={i} className="text-xs font-mono border-b border-gray-50 py-1.5 text-green-700">{e.msg}</div>
              ))
            }
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-bold text-sm mb-3 text-gray-700">✏️ Update name signal</h4>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-400 focus:outline-none"
              placeholder="Type a name..."
            />
            <p className="mt-2 text-xs text-gray-400">greeting() computed value updates live ↑</p>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-green-800 mb-2">💡 Signals vs Observable</h4>
            <p>✅ <strong>Synchronous</strong> — no async, no pipe, no subscribe/unsubscribe</p>
            <p>✅ <strong>Fine-grained</strong> — only components that read the signal re-render</p>
            <p>✅ <strong>No Zone.js</strong> — works with Angular's new zoneless change detection</p>
            <p>⚠️ <strong>Angular 17+</strong> — use BehaviorSubject or NgRx for older projects</p>
          </div>
        </div>
      </div>

      {toast && <Toast title={toast.title} body={toast.body} onClose={() => setToast(null)} />}
    </div>
  );
}
