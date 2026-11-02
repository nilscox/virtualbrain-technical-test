import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { Markdown } from './markdown.ts';

void describe('Markdown.pokemonToMarkdown', () => {
  void test('converts a pokemon to markdown', () => {
    const markdown = Markdown.pokemonToMarkdown({
      id: 1,
      name: 'bulbasaur',
      image: 'artwork-1.png',
      stats: { HP: 45, attack: 49, defense: 49, speed: 45 },
      apiTypes: [
        { name: 'grass', image: 'grass.png' },
        { name: 'poison', image: 'poison.png' },
      ],
    });

    assert.equal(
      markdown,
      [
        '# Bulbasaur',
        '',
        '![Bulbasaur](artwork-1.png)',
        '',
        '- **Pokédex number**: 1',
        '- **Types**: Grass, Poison',
        '',
        '## Stats',
        '',
        '| Stat | Value |',
        '| --- | --- |',
        '| HP | 45 |',
        '| Attack | 49 |',
        '| Defense | 49 |',
        '| Speed | 45 |',
        '',
      ].join('\n'),
    );
  });
});
