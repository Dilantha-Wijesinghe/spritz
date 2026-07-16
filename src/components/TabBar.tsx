import type { JSX } from 'react';
import type { Tab } from '../types';
import Button from './Button';
import Glass from './Glass';

const ICONS: Record<Tab, JSX.Element> = {
  shelf: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  ),
  today: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  history: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="4" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  notes: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  ),
};

const TABS: Array<[Tab, string]> = [
  ['shelf', 'Shelf'],
  ['today', 'Today'],
  ['history', 'History'],
  ['notes', 'Notes'],
];

interface TabBarProps {
  tab: Tab;
  onSelect: (t: Tab) => void;
}

export default function TabBar({ tab, onSelect }: TabBarProps) {
  const activeIndex = TABS.findIndex(([id]) => id === tab);

  return (
    <Glass as="div" variant="nav" corner={24} className="nav-slot">
      <span className="tab-indicator" aria-hidden="true" style={{ transform: `translateX(${activeIndex * 100}%)` }} />
      {TABS.map(([id, tabLabel]) => (
        <Button
          key={id}
          variant="tab"
          active={tab === id}
          aria-current={tab === id ? 'page' : undefined}
          aria-label={`${tabLabel} tab`}
          onClick={() => onSelect(id)}
          className="tabbtn"
        >
          <span style={{ display: 'flex' }}>{ICONS[id]}</span>
          <span>{tabLabel}</span>
        </Button>
      ))}
    </Glass>
  );
}
