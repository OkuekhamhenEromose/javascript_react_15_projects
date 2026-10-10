import { useState, Suspense, lazy } from 'react';

// React.lazy() returns a component that, when first rendered, dynamically
// imports its module - the code for HeavyPanel is split into a SEPARATE
// JS chunk that only downloads when actually needed, not as part of the
// initial page load. This is "code splitting," and it directly improves
// initial load performance for any component not needed immediately.
const HeavyPanel = lazy(() => import('./lazy-demo/HeavyPanel.jsx'));

export function LazyLoadDemo() {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPanel(true)}>Show heavy panel</button>
      {showPanel && (
        // Suspense's fallback renders WHILE the lazy component's chunk is
        // still downloading - this is the loading-state discipline from
        // Snippet 27, now applied to code loading itself, not just data.
        <Suspense fallback={<p>Loading panel...</p>}>
          <HeavyPanel />
        </Suspense>
      )}
    </div>
  );
}
