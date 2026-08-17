import { useState, useCallback } from 'react';
import Toast from './shared/Toast';
import { PlaygroundBox, ActionBtn } from './shared/PlaygroundBox';

interface CartItem { name: string; price: number; emoji: string }
interface User { name: string; email: string }
interface NgrxState { user: User | null; cart: CartItem[]; cartTotal: number }
interface LogEntry { type: string; time: string }

type Route = 'home' | 'shop' | 'checkout';
type ActionType = 'LOGIN' | 'LOGOUT' | 'ADD_LAPTOP' | 'ADD_PHONE' | 'ADD_HEADPHONES' | 'REMOVE_LAST' | 'CLEAR_CART';

const NAMES  = ['John Doe', 'Jane Smith', 'Alex Kumar', 'Sara Chen', 'Mike Johnson', 'Lisa Park', 'Tom Wilson'];
const EMAILS = ['john@dev.io', 'jane@tech.co', 'alex@code.in', 'sara@app.io', 'mike@web.com', 'lisa@ui.dev', 'tom@ng.io'];
const INITIAL_STATE: NgrxState = { user: null, cart: [], cartTotal: 0 };
const BTN_COLOR = 'rgb(10, 102, 194)';

function ngrxReducer(state: NgrxState, action: ActionType): NgrxState {
  const s: NgrxState = JSON.parse(JSON.stringify(state));
  switch (action) {
    case 'LOGIN': {
      let idx = Math.floor(Math.random() * NAMES.length);
      if (s.user && s.user.name === NAMES[idx]) idx = (idx + 1) % NAMES.length;
      s.user = { name: NAMES[idx], email: EMAILS[idx] };
      break;
    }
    case 'LOGOUT':         s.user = null; break;
    case 'ADD_LAPTOP':     s.cart.push({ name: 'Laptop',     price: 999, emoji: '💻' }); s.cartTotal += 999; break;
    case 'ADD_PHONE':      s.cart.push({ name: 'Phone',      price: 699, emoji: '📱' }); s.cartTotal += 699; break;
    case 'ADD_HEADPHONES': s.cart.push({ name: 'Headphones', price: 149, emoji: '🎧' }); s.cartTotal += 149; break;
    case 'REMOVE_LAST':
      if (s.cart.length > 0) { const r = s.cart.pop()!; s.cartTotal -= r.price; } break;
    case 'CLEAR_CART': s.cart = []; s.cartTotal = 0; break;
  }
  return s;
}

function getFlashIds(prev: NgrxState, next: NgrxState): string[] {
  const ids: string[] = [];
  if (JSON.stringify(prev.user) !== JSON.stringify(next.user))
    ids.push('home-navbar', 'home-welcome', 'shop-greeting', 'checkout-shipping');
  if (JSON.stringify(prev.cart) !== JSON.stringify(next.cart))
    ids.push('shop-minicart', 'checkout-summary');
  if (prev.cartTotal !== next.cartTotal)
    ids.push('checkout-summary', 'checkout-total');
  return ids;
}

function buildToast(action: ActionType, state: NgrxState): { title: string; body: string } {
  const u = state.user;
  const c = state.cart;
  switch (action) {
    case 'LOGIN': return {
      title: '🎬 Action: LOGIN dispatched',
      body: `<b style="color:#ffeb3b">Payload:</b> { name: "${u?.name}", email: "${u?.email}" }<br><br><b style="color:#81d4fa">📝 Code:</b><br><code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">store.dispatch({ type: 'LOGIN', payload: userData })</code><br><br><b style="color:#a5d6a7">🔄 Flow:</b> dispatch → Reducer creates new state → Store saves → selectUser fires → Navbar + Welcome Banner re-render`,
    };
    case 'LOGOUT': return {
      title: '🚪 Action: LOGOUT dispatched',
      body: `<b style="color:#81d4fa">📝 Code:</b> <code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">store.dispatch({ type: 'LOGOUT' })</code><br><br><b style="color:#a5d6a7">🔄 Flow:</b> dispatch → Reducer sets user = null → Store saves → selectUser fires → components re-render`,
    };
    case 'ADD_LAPTOP': case 'ADD_PHONE': case 'ADD_HEADPHONES': {
      const item = c[c.length - 1];
      return {
        title: `🛒 Action: ${action} dispatched`,
        body: `<b style="color:#ffeb3b">Payload:</b> { name: "${item?.name}", price: ${item?.price} }<br><br><b style="color:#a5d6a7">🔄 Flow:</b> dispatch → Reducer pushes to cart[] + updates cartTotal → Store saves → selectCart + selectCartTotal fire → Mini Cart + Total re-render`,
      };
    }
    case 'REMOVE_LAST': return {
      title: '❌ Action: REMOVE_LAST dispatched',
      body: `<b style="color:#a5d6a7">🔄 Flow:</b> dispatch → Reducer pops last item, subtracts price → Store saves → selectCart + selectCartTotal update → components re-render`,
    };
    case 'CLEAR_CART': return {
      title: '🗑️ Action: CLEAR_CART dispatched',
      body: `<b style="color:#a5d6a7">🔄 Flow:</b> dispatch → Reducer resets cart=[], cartTotal=0 → Store saves → all cart selectors fire → empty state shown`,
    };
  }
}

function StorePanel({ state }: { state: NgrxState }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <h4 className="font-bold text-sm mb-1 text-gray-700">🗃️ NgRx STORE</h4>
      <p className="text-xs text-gray-400 mb-2">Single JS object — only the Reducer can update it.</p>
      <pre className="bg-[#1a1a2e] text-green-400 p-3 rounded-lg text-xs font-mono leading-relaxed"
        style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}

function SelectorsPanel({ state }: { state: NgrxState }) {
  const { user, cart, cartTotal } = state;
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-orange-400">
      <h4 className="font-bold text-sm mb-3 text-orange-700">📊 SELECTORS</h4>
      <div className="space-y-2 font-mono text-xs">
        {[
          ['selectUser',      user ? user.name : 'null',           'border-orange-400', 'bg-amber-50', 'text-orange-700'],
          ['selectCart',      '[' + cart.map(i => i.emoji).join(' ') + ']', 'border-orange-400', 'bg-amber-50', 'text-orange-700'],
          ['selectCartTotal', '$' + cartTotal,                     'border-orange-400', 'bg-amber-50', 'text-orange-700'],
        ].map(([label, val, border, bg, text]) => (
          <div key={label} className={`${bg} border-l-4 ${border} px-3 py-2 rounded`}>
            <span className="text-gray-500">{label} →</span> <span className={`font-bold ${text}`}>{val}</span>
          </div>
        ))}
        <div className="bg-pink-50 border-l-4 border-pink-500 px-3 py-2 rounded">
          <span className="text-gray-500">selectCartCount</span>
          <span className="text-pink-600 text-[10px] ml-1">(computed)</span>
          <span className="text-gray-500"> → </span>
          <span className="font-bold text-pink-700">{cart.length} items</span>
        </div>
      </div>
    </div>
  );
}

function LogPanel({ log }: { log: LogEntry[] }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 max-h-40 overflow-y-auto">
      <h4 className="font-bold text-sm mb-2 text-gray-700">📜 Action History</h4>
      {log.length === 0
        ? <p className="text-xs text-gray-400 italic">Dispatch actions to see history...</p>
        : log.map((e, i) => (
          <div key={i} className="text-xs font-mono border-b border-gray-50 py-1">
            <span className="text-gray-400">{e.time}</span> → <strong style={{ color: BTN_COLOR }}>{e.type}</strong>
          </div>
        ))
      }
    </div>
  );
}

function HomePage({ state, flash, onDispatch }: { state: NgrxState; flash: Set<string>; onDispatch: (a: ActionType) => void }) {
  const u = state.user;
  return (
    <>
      <PlaygroundBox title="Navbar" subtitle="(selectUser, selectCartCount)" flash={flash.has('home-navbar')}
        body={`User: ${u ? u.name : 'null'} | Cart: ${state.cart.length} items`}>
        <ActionBtn label="👤 Login"  onClick={() => onDispatch('LOGIN')} />
        <ActionBtn label="🚪 Logout" onClick={() => onDispatch('LOGOUT')} />
      </PlaygroundBox>
      <PlaygroundBox title="Welcome Banner" subtitle="(selectUser)" flash={flash.has('home-welcome')}
        body={u ? `Welcome back, ${u.name}! Ready to shop?` : 'Hello! Please login to shop.'} />
      <PlaygroundBox title="Promo Banner" subtitle="(NO selector — static)" noSelector flash={false}
        body="🎉 Free shipping on orders over $500!" />
    </>
  );
}

function ShopPage({ state, flash, onDispatch }: { state: NgrxState; flash: Set<string>; onDispatch: (a: ActionType) => void }) {
  const u = state.user;
  const c = state.cart;
  return (
    <>
      <PlaygroundBox title="Product List" subtitle="(NO selector — dispatch only)" noSelector flash={false} body="">
        <ActionBtn label="💻 Laptop $999"     onClick={() => onDispatch('ADD_LAPTOP')} />
        <ActionBtn label="📱 Phone $699"      onClick={() => onDispatch('ADD_PHONE')} />
        <ActionBtn label="🎧 Headphones $149" onClick={() => onDispatch('ADD_HEADPHONES')} />
      </PlaygroundBox>
      <PlaygroundBox title="Mini Cart" subtitle="(selectCart, selectCartCount)" flash={flash.has('shop-minicart')}
        body={c.length === 0 ? 'Cart is empty' : `${c.map(i => `${i.emoji} ${i.name}`).join(', ')} (${c.length} items)`}>
        <ActionBtn label="❌ Remove Last" onClick={() => onDispatch('REMOVE_LAST')} />
      </PlaygroundBox>
      <PlaygroundBox title="User Greeting" subtitle="(selectUser)" flash={flash.has('shop-greeting')}
        body={u ? `Hi ${u.name}! Happy shopping!` : 'Not logged in'} />
    </>
  );
}

function CheckoutPage({ state, flash, onDispatch }: { state: NgrxState; flash: Set<string>; onDispatch: (a: ActionType) => void }) {
  const u = state.user;
  const c = state.cart;
  const t = state.cartTotal;
  return (
    <>
      <PlaygroundBox title="Order Summary" subtitle="(selectCart, selectCartTotal)" flash={flash.has('checkout-summary')}
        body={c.length === 0 ? 'No items. Go to Shop!' : `${c.map(i => `${i.emoji} $${i.price}`).join(' | ')} → Total: $${t}`} />
      <PlaygroundBox title="Shipping Info" subtitle="(selectUser)" flash={flash.has('checkout-shipping')}
        body={u ? `Ship to: ${u.name} (${u.email})` : 'Please login first'}>
        <ActionBtn label="🗑️ Clear Cart" onClick={() => onDispatch('CLEAR_CART')} />
      </PlaygroundBox>
      <PlaygroundBox title="Total Display" subtitle="(selectCartTotal)" flash={flash.has('checkout-total')}
        body={`Total: $${t}`} />
    </>
  );
}

export default function NgRxPlayground() {
  const [state, setState] = useState<NgrxState>(INITIAL_STATE);
  const [log, setLog]     = useState<LogEntry[]>([]);
  const [route, setRoute] = useState<Route>('home');
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  const dispatch = useCallback((action: ActionType) => {
    setState(prev => {
      const next = ngrxReducer(prev, action);
      const ids = getFlashIds(prev, next);
      if (ids.length > 0) {
        setTimeout(() => { setFlash(new Set(ids)); setTimeout(() => setFlash(new Set()), 600); }, 0);
      }
      setTimeout(() => setToast(buildToast(action, next)), 0);
      setTimeout(() => setLog(l => [{ type: action, time: new Date().toLocaleTimeString() }, ...l]), 0);
      return next;
    });
  }, []);

  const tabs: { id: Route; label: string }[] = [
    { id: 'home',     label: '🏠 /home' },
    { id: 'shop',     label: '🛒 /shop' },
    { id: 'checkout', label: '💳 /checkout' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <StorePanel state={state} />
          <SelectorsPanel state={state} />
          <LogPanel log={log} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="text-center px-4 pt-4 pb-2">
            <h4 className="font-bold text-sm text-gray-700">🖥️ UI COMPONENTS — Active Route View</h4>
            <p className="text-xs text-gray-400 mt-1">Each tab simulates a route. Only components on the active route exist in the DOM.</p>
          </div>
          <div className="p-4">
            <div className="flex gap-2 mb-4">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setRoute(t.id)}
                  style={route === t.id ? { backgroundColor: BTN_COLOR, borderColor: BTN_COLOR } : {}}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                    route === t.id ? 'text-white' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
            {route === 'home'     && <HomePage     state={state} flash={flash} onDispatch={dispatch} />}
            {route === 'shop'     && <ShopPage     state={state} flash={flash} onDispatch={dispatch} />}
            {route === 'checkout' && <CheckoutPage state={state} flash={flash} onDispatch={dispatch} />}
            <div className="mt-4 text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 <strong>Only active-route components exist in the DOM.</strong> Switch routes to see components mount with the latest store state.
            </div>
          </div>
        </div>
      </div>

      {/* 6-concept table */}
      <div className="bg-amber-50 border-2 border-orange-400 rounded-xl p-4">
        <h4 className="font-bold text-orange-800 mb-3">🧠 The 6 Key Players — Kitchen 🍳 + Tap Water 🚰</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-orange-100">
                {['Term','What it does','🍳 Kitchen','🚰 Tap Water'].map(h => (
                  <th key={h} className="p-2 text-left border-b-2 border-orange-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Action',     'Message: WHAT happened',         'Order slip',           'Turning the tap handle'],
                ['Reducer',    'Old state + action → new state', 'Chef processes order',  'Water heater/mixer'],
                ['Store',      'Single object: ALL app data',    'Kitchen counter',       'Water tank'],
                ['Selector',   'Extracts one slice of state',    'Waiter picks your dish','Tap on the tank'],
                ['Observable', 'Live data pipe, auto-updates',   'Conveyor belt',         'Water pipe to glass'],
                ['Component',  'UI — re-renders on change',      "Customer's plate",      'Glass of water'],
              ].map(([term, what, kitchen, tap]) => (
                <tr key={term} className="border-b border-orange-100 hover:bg-orange-50">
                  <td className="p-2 font-bold text-[#1a1a2e]">{term}</td>
                  <td className="p-2 text-gray-600">{what}</td>
                  <td className="p-2 text-gray-600">{kitchen}</td>
                  <td className="p-2 text-gray-600">{tap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-600">
          <strong>🔗 Chain:</strong> Action → Reducer → Store → Selector → Observable → Component
        </p>
      </div>

      {toast && <Toast title={toast.title} body={toast.body} onClose={() => setToast(null)} />}
    </div>
  );
}
