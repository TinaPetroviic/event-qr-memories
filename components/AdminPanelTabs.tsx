"use client";

import { useState, type ReactNode } from "react";

type TabKey = "pregled" | "postavke" | "uspomene";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "pregled", label: "Pregled", icon: "🗂️" },
  { key: "postavke", label: "Postavke", icon: "⚙️" },
  { key: "uspomene", label: "Uspomene", icon: "🖼️" },
];

// Simple, dependency-free tabs: all three panels are rendered up-front (so
// e.g. the gallery's realtime subscription in PhotoGrid stays connected
// regardless of which tab is active) and switching tabs just toggles the
// `hidden` attribute rather than mounting/unmounting anything.
export function AdminPanelTabs({
  summary,
  settings,
  gallery,
}: {
  summary: ReactNode;
  settings: ReactNode;
  gallery: ReactNode;
}) {
  const [active, setActive] = useState<TabKey>("pregled");
  const panels: Record<TabKey, ReactNode> = { pregled: summary, postavke: settings, uspomene: gallery };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Odjeljci admin panela"
        className="mb-6 flex flex-wrap gap-2 border-b border-gold-400/15 pb-3"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.key}`}
              onClick={() => setActive(tab.key)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-gold-500 text-white shadow-sm shadow-gold-600/30"
                  : "text-ink-700 hover:bg-cream-100"
              }`}
            >
              <span aria-hidden>{tab.icon}</span> {tab.label}
            </button>
          );
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.key}
          id={`tabpanel-${tab.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.key}`}
          hidden={active !== tab.key}
        >
          {panels[tab.key]}
        </div>
      ))}
    </div>
  );
}
