import { useState, useCallback } from 'react';
import Toast from './shared/Toast';
import { PlaygroundBox, ActionBtn } from './shared/PlaygroundBox';

interface BSUser { name: string; role: string }
interface BSState { user: BSUser | null; theme: 'light' | 'dark'; notifications: number }
type BSAction = 'LOGIN' | 'LOGOUT' | 'NEW_NOTIFICATION' | 'CLEAR_NOTIFICATIONS' | 'TOGGLE_THEME' | 'UPDATE_NAME';
type PageRoute = 'dashboard' | 'profile';

const NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
const INITIAL: BSState = { user: null, theme: 'light', notifications: 0 };
const SUB_MAP: Record<keyof BSState, number[]> = {
  user: [1, 3, 4, 6], theme: [1, 5, 6], notifications: [2, 4],
};

function buildToast(action: BSAction, state: BSState, prev: BSState): { title: string; body: string } | null {
  const u = state.user;
  const userChanged  = JSON.stringify(u) !== JSON.stringify(prev.user);
  const themeChanged = state.theme !== prev.theme;
  const notifChanged = state.notifications !== prev.notifications;
  if (!userChanged && !themeChanged && !notifChanged) return {
    title: '⚠️ Nothing changed — no re-render.',
    body: `Same value as before. Like <code style="background:#2d2d2d;padding:1px 4px;border-radius:3px">distinctUntilChanged()</code> in RxJS — no notification fires when the new value equals the old one.`,
  };
  switch (action) {
    case 'LOGIN': return {
      title: '👤 service.login() called',
      body: `<b style="color:#ce93d8">BehaviorSubject</b> = a stream that always holds the latest value.<br><br><b style="color:#ffcc80">New value:</b> { name: "${u?.name}", role: "${u?.role}" }<br><br><b style="color:#81d4fa">📝 Code:</b><br><code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">this.user$.next({ name: "${u?.name}", role: "Developer" })</code><br><br><b style="color:#a5d6a7">🔄 Flow (no middleman):</b> Component calls service.login() → .next() → Navbar + Sidebar + Main Content auto-notify`,
    };
    case 'LOGOUT': return {
      title: '🚪 service.logout() called',
      body: `<b style="color:#81d4fa">📝 Code:</b><br><code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">this.user$.next(null)</code><br><code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">this.notifications$.next(0)</code>`,
    };
    case 'NEW_NOTIFICATION': return {
      title: '🔔 service.addNotification() called',
      body: `<code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">this.notifications$.next(this.notifications$.value + 1)</code><br><br><b style="color:#a5d6a7">Who gets notified?</b> Only subscribers of notifications$: Bell ✓ Main Content ✓ — Navbar ✗ Sidebar ✗ Footer ✗`,
    };
    case 'CLEAR_NOTIFICATIONS': return {
      title: '🧹 service.clearNotifications() called',
      body: `<code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">this.notifications$.next(0)</code><br>Bell + Main Content re-render.`,
    };
    case 'TOGGLE_THEME': return {
      title: '🌗 service.toggleTheme() called',
      body: `<b style="color:#ffcc80">theme$: "${prev.theme}" → "${state.theme}"</b><br><br><code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">this.theme$.next("${state.theme}")</code><br>Navbar + Footer subscribed to theme$ → re-render`,
    };
    case 'UPDATE_NAME': return {
      title: '✏️ service.updateName() called',
      body: `<code style="background:#2d2d2d;padding:2px 6px;border-radius:3px;font-size:0.75rem">this.user$.next({...this.user$.value, name: "${u?.name}"})</code><br>Navbar + Sidebar + Main Content re-render`,
    };
  }
}

function getFlashComps(prev: BSState, next: BSState, route: PageRoute): number[] {
  const comps: number[] = [];
  const add = (field: keyof BSState) => {
    if (JSON.stringify(prev[field]) !== JSON.stringify(next[field]))
      SUB_MAP[field].forEach(n => { if (!comps.includes(n)) comps.push(n); });
  };
  add('user'); add('theme'); add('notifications');
  return comps.filter(n => route === 'dashboard' ? n <= 5 : n === 6);
}

export default function BSPlayground() {
  const [state, setState] = useState<BSState>(INITIAL);
  const [route, setRoute] = useState<PageRoute>('dashboard');
  const [flash, setFlash] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  const dispatch = useCallback((action: BSAction) => {
    setState(prev => {
      const next: BSState = { ...prev, user: prev.user ? { ...prev.user } : null };
      switch (action) {
        case 'LOGIN':               next.user = { name: NAMES[Math.floor(Math.random() * NAMES.length)], role: 'Developer' }; break;
        case 'LOGOUT':              next.user = null; next.notifications = 0; break;
        case 'NEW_NOTIFICATION':    next.notifications = prev.notifications + 1; break;
        case 'CLEAR_NOTIFICATIONS': next.notifications = 0; break;
        case 'TOGGLE_THEME':        next.theme = prev.theme === 'light' ? 'dark' : 'light'; break;
        case 'UPDATE_NAME':         if (next.user) next.user = { ...next.user, name: NAMES[Math.floor(Math.random() * NAMES.length)] }; break;
      }
      const ids = getFlashComps(prev, next, route);
      setTimeout(() => { setFlash(new Set(ids)); setTimeout(() => setFlash(new Set()), 700); }, 0);
      const t = buildToast(action, next, prev);
      if (t) setTimeout(() => setToast(t), 0);
      return next;
    });
  }, [route]);

  const { user, theme, notifications } = state;
  const f = (n: number) => flash.has(n);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT: Service state */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-bold text-sm mb-1 text-gray-700">🏠 SHARED SERVICE (BehaviorSubject)</h4>
            <p className="text-xs text-gray-400 mb-2">Lives in RAM. No Actions. No Reducers. Components call service methods directly.</p>
            <pre className="bg-[#1a1a2e] text-green-400 p-3 rounded-lg text-xs font-mono leading-relaxed" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-400">
            <h4 className="font-bold text-sm mb-3 text-blue-700">📱 Live Streams</h4>
            <div className="space-y-2 font-mono text-xs">
              {[
                ['user$',          user ? `{ name: "${user.name}", role: "${user.role}" }` : 'null'],
                ['theme$',         `"${theme}"`],
                ['notifications$', String(notifications)],
              ].map(([label, val]) => (
                <div key={label} className="bg-blue-50 border-l-4 border-blue-500 px-3 py-2 rounded">
                  <span className="text-gray-500">{label} → </span>
                  <span className="font-bold text-blue-700">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* No-history contrast panel */}
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 opacity-60">
            <h4 className="font-bold text-sm mb-2 text-gray-500">📜 Action History</h4>
            <p className="text-xs text-gray-400 italic">Not available — BehaviorSubject has no action log. This is the trade-off vs NgRx: simpler code, but no history or time-travel debugging.</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 text-xs space-y-1.5">
            <h4 className="font-bold text-blue-800 mb-2">💡 Key Difference from NgRx:</h4>
            <p>✅ <strong>No Actions</strong> — component calls <code className="bg-blue-100 px-1 rounded">service.login()</code> directly</p>
            <p>✅ <strong>No Reducer</strong> — service calls <code className="bg-blue-100 px-1 rounded">this.user$.next(data)</code></p>
            <p>✅ <strong>No Store object</strong> — BehaviorSubject IS the store</p>
            <p>⚠️ <strong>Trade-off</strong> — no history, no time-travel, anyone can mutate</p>
          </div>
        </div>

        {/* RIGHT: Route simulation */}
        <div className={`rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="text-center px-4 pt-4 pb-2">
            <h4 className="font-bold text-sm text-gray-700">🖥️ UI COMPONENTS — Active Route View</h4>
            <p className="text-xs text-gray-400 mt-1">Each tab simulates a route. Only components on the active route exist in the DOM.</p>
          </div>
          <div className="p-4">
            <div className="flex gap-2 mb-4">
              {([['dashboard','📄 /dashboard'],['profile','👤 /profile']] as const).map(([id, label]) => (
                <button key={id} onClick={() => setRoute(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                    route === id ? 'text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                  style={route === id ? { backgroundColor: 'rgb(10,102,194)', borderColor: 'rgb(10,102,194)' } : {}}>
                  {label}
                </button>
              ))}
            </div>

            {route === 'dashboard' && (
              <div className="space-y-3">
                <PlaygroundBox title="Comp 1: NAVBAR" subtitle="(user$, theme$)" flash={f(1)} accentColor="blue"
                  body={`User: ${user ? user.name : 'Not logged in'} | Theme: ${theme}`}>
                  <ActionBtn label="👤 Login"  onClick={() => dispatch('LOGIN')} />
                  <ActionBtn label="🚪 Logout" onClick={() => dispatch('LOGOUT')} />
                </PlaygroundBox>
                <PlaygroundBox title="Comp 2: NOTIFICATION BELL" subtitle="(notifications$)" flash={f(2)} accentColor="blue"
                  body={`🔔 Notifications: ${notifications}${notifications > 0 ? ' ⚠️ NEW!' : ''}`}>
                  <ActionBtn label="🧹 Clear" onClick={() => dispatch('CLEAR_NOTIFICATIONS')} />
                </PlaygroundBox>
                <PlaygroundBox title="Comp 3: SIDEBAR" subtitle="(user$)" flash={f(3)} accentColor="blue"
                  body={user ? `Welcome back, ${user.name}! Role: ${user.role}` : 'Welcome! Please log in.'}>
                  <ActionBtn label="✏️ Edit Name" onClick={() => dispatch('UPDATE_NAME')} />
                </PlaygroundBox>
                <PlaygroundBox title="Comp 4: MAIN CONTENT" subtitle="(user$, notifications$)" flash={f(4)} accentColor="blue"
                  body={user ? `Dashboard for ${user.name} | ${notifications} pending` : 'Dashboard — no user data'}>
                  <ActionBtn label="🔔 New Notification" onClick={() => dispatch('NEW_NOTIFICATION')} />
                </PlaygroundBox>
                <PlaygroundBox title="Comp 5: FOOTER" subtitle="(theme$)" flash={f(5)} accentColor="blue"
                  body={`Theme: ${theme} mode ${theme === 'dark' ? '🌙' : '☀️'}`}>
                  <ActionBtn label="🌗 Toggle Theme" onClick={() => dispatch('TOGGLE_THEME')} />
                </PlaygroundBox>
              </div>
            )}

            {route === 'profile' && (
              <div className="space-y-3">
                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-3 text-xs text-green-800 mb-3">
                  ✅ <strong>Comp 6 just mounted!</strong> It subscribed to user$ and theme$ and <em>immediately received the latest value</em> — even though it wasn't alive before. That's the "Behavior" in BehaviorSubject!
                </div>
                <PlaygroundBox title="Comp 6: PROFILE PAGE" subtitle="(user$, theme$ — just mounted!)" flash={f(6)} accentColor="blue"
                  body={user ? `Profile: ${user.name} (${user.role}) | Theme: ${theme}` : 'No user — go back and log in first!'}>
                  <ActionBtn label="👤 Login"        onClick={() => dispatch('LOGIN')} />
                  <ActionBtn label="🚪 Logout"       onClick={() => dispatch('LOGOUT')} />
                  <ActionBtn label="✏️ Edit Name"    onClick={() => dispatch('UPDATE_NAME')} />
                  <ActionBtn label="🌗 Theme"        onClick={() => dispatch('TOGGLE_THEME')} />
                </PlaygroundBox>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription map */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h4 className="font-bold text-sm mb-3 text-gray-700">🎯 Subscription Map — Who Listens to What?</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {['Component','user$','theme$','notifications$','What it shows'].map(h => (
                  <th key={h} className="p-2 text-left border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Navbar',            '✅','✅','❌','Username + theme class'],
                ['Notification Bell', '❌','❌','✅','Badge count'],
                ['Sidebar',           '✅','❌','❌','Welcome message'],
                ['Main Content',      '✅','❌','✅','Dashboard greeting + count'],
                ['Footer',            '❌','✅','❌','Theme label'],
                ['Profile (route 2)', '✅','✅','❌','Full profile details'],
              ].map(([comp, u, t, n, shows]) => (
                <tr key={comp} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-2 font-semibold">{comp}</td>
                  <td className="p-2 text-center">{u}</td>
                  <td className="p-2 text-center">{t}</td>
                  <td className="p-2 text-center">{n}</td>
                  <td className="p-2 text-gray-500 text-[11px]">{shows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast title={toast.title} body={toast.body} onClose={() => setToast(null)} />}
    </div>
  );
}
