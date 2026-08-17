import { useState, useCallback } from 'react';
import Toast from './shared/Toast';

const BTN_COLOR = 'rgb(10, 102, 194)';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Product { id: number; name: string; price: number }
interface AppState {
  products: Product[];
  status: Status;
  error: string | null;
  selectedId: number | null;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop Pro', price: 999 },
  { id: 2, name: 'Wireless Mouse', price: 49 },
  { id: 3, name: 'Mechanical Keyboard', price: 129 },
];

function Btn({ label, onClick, color, disabled }: { label: string; onClick: () => void; color?: string; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ backgroundColor: disabled ? '#9ca3af' : (color || BTN_COLOR) }}
      className="px-3 py-1.5 text-white rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed">
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map = {
    idle:    'bg-gray-100 text-gray-600',
    loading: 'bg-yellow-100 text-yellow-700 animate-pulse',
    success: 'bg-green-100 text-green-700',
    error:   'bg-red-100 text-red-700',
  };
  const icons = { idle:'⏸', loading:'⏳', success:'✅', error:'❌' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[status]}`}>
      {icons[status]} {status.toUpperCase()}
    </span>
  );
}

export default function EffectsPlayground() {
  const [state, setState] = useState<AppState>({
    products: [], status: 'idle', error: null, selectedId: null,
  });
  const [log, setLog] = useState<string[]>([]);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  const addLog = useCallback((msg: string) => {
    setLog(l => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l].slice(0, 12));
  }, []);

  const loadProducts = useCallback(() => {
    setState(s => ({ ...s, status: 'loading', error: null }));
    addLog('Effect triggered → dispatched loadProducts action');
    addLog('Effect calling HTTP GET /api/products...');
    setToast({
      title: '🚚 Effect: loadProducts$ triggered',
      body: `<b style="color:#ffeb3b">What happened:</b> Component dispatched <code style="background:#2d2d2d;padding:2px 6px;border-radius:3px">loadProducts()</code><br><br><b style="color:#81d4fa">📝 Code (Effect):</b><br><code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">loadProducts$ = createEffect(() => actions$.pipe(<br>&nbsp;&nbsp;ofType(loadProducts),<br>&nbsp;&nbsp;switchMap(() => this.http.get('/api/products').pipe(<br>&nbsp;&nbsp;&nbsp;&nbsp;map(products => loadProductsSuccess({ products })),<br>&nbsp;&nbsp;&nbsp;&nbsp;catchError(err => of(loadProductsFailure({ error: err })))<br>&nbsp;&nbsp;))<br>))</code><br><br><b style="color:#a5d6a7">🔄 Flow:</b> Action → Effect → HTTP call → Success/Failure action → Reducer → Store`,
    });
    setTimeout(() => {
      const shouldFail = Math.random() < 0.2; // 20% chance of error
      if (shouldFail) {
        setState(s => ({ ...s, status: 'error', error: 'Network error: could not reach /api/products' }));
        addLog('❌ HTTP failed → dispatched loadProductsFailure');
      } else {
        setState(s => ({ ...s, status: 'success', products: MOCK_PRODUCTS }));
        addLog('✅ HTTP success → dispatched loadProductsSuccess');
        addLog(`✅ Reducer processed → store.products updated with ${MOCK_PRODUCTS.length} items`);
      }
    }, 1800);
  }, [addLog]);

  const selectProduct = useCallback((id: number) => {
    setState(s => ({ ...s, selectedId: s.selectedId === id ? null : id }));
    addLog(`selectProduct(${id}) dispatched → reducer updated selectedId`);
  }, [addLog]);

  const clearProducts = useCallback(() => {
    setState({ products: [], status: 'idle', error: null, selectedId: null });
    addLog('clearProducts() dispatched → reducer reset state');
  }, [addLog]);

  const selected = state.products.find(p => p.id === state.selectedId);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT: Store state */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-bold text-sm mb-1 text-gray-700">🗃️ Store State</h4>
            <p className="text-xs text-gray-400 mb-2">Effects live OUTSIDE the store — they call the API then dispatch a new action back in.</p>
            <pre className="bg-[#1a1a2e] text-green-400 p-3 rounded-lg text-xs font-mono leading-relaxed" style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>

          {/* Effect log */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 max-h-52 overflow-y-auto">
            <h4 className="font-bold text-sm mb-2 text-gray-700">📜 Effect + Action Log</h4>
            {log.length === 0
              ? <p className="text-xs text-gray-400 italic">Dispatch actions to see the effect pipeline...</p>
              : log.map((e, i) => (
                <div key={i} className="text-xs font-mono border-b border-gray-50 py-1 text-gray-600">{e}</div>
              ))
            }
          </div>
        </div>

        {/* RIGHT: UI components */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="text-center px-4 pt-4 pb-2">
            <h4 className="font-bold text-sm text-gray-700">🖥️ UI COMPONENTS</h4>
            <p className="text-xs text-gray-400 mt-1">Components dispatch actions. Effects handle the HTTP. Reducer updates the store.</p>
          </div>
          <div className="p-4 space-y-3">

            {/* Product List Component */}
            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3">
              <p className="font-bold text-sm text-[#1a1a2e] mb-1">Product List Component</p>
              <p className="text-xs text-orange-500 font-semibold mb-3">(dispatches: loadProducts, clearProducts)</p>
              <div className="flex gap-2 mb-3 flex-wrap">
                <Btn label="🔄 Load Products" onClick={loadProducts} disabled={state.status === 'loading'} color="rgb(22,163,74)" />
                <Btn label="🗑️ Clear" onClick={clearProducts} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">HTTP Status:</span>
                <StatusBadge status={state.status} />
              </div>
              {state.error && <p className="mt-2 text-xs text-red-600 bg-red-50 rounded p-2">⚠️ {state.error}</p>}
            </div>

            {/* Products Display Component */}
            <div className={`rounded-xl border-2 p-3 transition-all ${state.products.length > 0 ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <p className="font-bold text-sm text-[#1a1a2e] mb-1">Product Display Component</p>
              <p className="text-xs text-orange-500 font-semibold mb-3">(selectProducts, dispatches: selectProduct)</p>
              {state.products.length === 0
                ? <p className="text-xs text-gray-400 italic">No products loaded yet.</p>
                : <div className="space-y-2">
                    {state.products.map(p => (
                      <div key={p.id}
                        onClick={() => selectProduct(p.id)}
                        className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                          state.selectedId === p.id ? 'bg-blue-100 border-2 border-blue-400' : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                        }`}>
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-gray-500">${p.price}</span>
                      </div>
                    ))}
                  </div>
              }
            </div>

            {/* Selected Product Component */}
            <div className={`rounded-xl border-2 p-3 transition-all ${selected ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
              <p className="font-bold text-sm text-[#1a1a2e] mb-1">Selected Product Component</p>
              <p className="text-xs text-orange-500 font-semibold mb-2">(selectSelectedProduct — computed selector)</p>
              <div className="text-xs bg-white rounded px-2 py-1.5 text-gray-700">
                {selected ? `✅ ${selected.name} — $${selected.price} (click again to deselect)` : 'No product selected'}
              </div>
            </div>

          </div>
        </div>
      </div>

      {toast && <Toast title={toast.title} body={toast.body} onClose={() => setToast(null)} />}
    </div>
  );
}
