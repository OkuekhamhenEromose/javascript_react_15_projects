// Simulates a genuinely "heavy" component - the kind you'd actually want to
// code-split (a rich text editor, a charting library, a large admin panel).
export default function HeavyPanel() {
  return <div data-testid="heavy-panel">Heavy panel content loaded.</div>;
}
