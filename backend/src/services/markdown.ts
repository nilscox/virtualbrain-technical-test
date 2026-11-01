import type { Pokemon } from 'shared';

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Convert a pokemon to a markdown document
 */
export function pokemonToMarkdown(pokemon: Pokemon): string {
  const name = capitalize(pokemon.name);
  const types = pokemon.apiTypes.map((type) => capitalize(type.name));

  return [
    `# ${name}`,
    '',
    `![${name}](${pokemon.image})`,
    '',
    `- **Pokédex number**: ${pokemon.id}`,
    `- **Types**: ${types.join(', ')}`,
    '',
    '## Stats',
    '',
    '| Stat | Value |',
    '| --- | --- |',
    `| HP | ${pokemon.stats.HP} |`,
    `| Attack | ${pokemon.stats.attack} |`,
    `| Defense | ${pokemon.stats.defense} |`,
    `| Speed | ${pokemon.stats.speed} |`,
    '',
  ].join('\n');
}
