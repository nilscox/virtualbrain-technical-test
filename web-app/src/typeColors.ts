/**
 * Conventional color of each pokemon type, and whether text on it should be light or dark to stay legible
 */
const TYPE_COLORS: Record<string, { color: string; ink: 'light' | 'dark' }> = {
  bug: { color: '#a6b91a', ink: 'dark' },
  dark: { color: '#705746', ink: 'light' },
  dragon: { color: '#6f35fc', ink: 'light' },
  electric: { color: '#f7d02c', ink: 'dark' },
  fairy: { color: '#d685ad', ink: 'dark' },
  fighting: { color: '#c22e28', ink: 'light' },
  fire: { color: '#ee8130', ink: 'dark' },
  flying: { color: '#a98ff3', ink: 'dark' },
  ghost: { color: '#735797', ink: 'light' },
  grass: { color: '#7ac74c', ink: 'dark' },
  ground: { color: '#e2bf65', ink: 'dark' },
  ice: { color: '#96d9d6', ink: 'dark' },
  normal: { color: '#a8a77a', ink: 'dark' },
  poison: { color: '#a33ea1', ink: 'light' },
  psychic: { color: '#f95587', ink: 'dark' },
  rock: { color: '#b6a136', ink: 'dark' },
  steel: { color: '#b7b7ce', ink: 'dark' },
  water: { color: '#6390f0', ink: 'dark' },
};

const FALLBACK = { color: '#a8a77a', ink: 'dark' } as const;

export function typeColor(type: string) {
  return TYPE_COLORS[type] ?? FALLBACK;
}

/**
 * Sets `--type` and `--type-ink` for the `bg-type` and `text-type-ink` utilities
 */
export function typeStyle(type: string): React.CSSProperties {
  const { color, ink } = typeColor(type);

  return {
    '--type': color,
    '--type-ink': ink === 'light' ? '#ffffff' : '#1b1f2b',
  } as React.CSSProperties;
}
