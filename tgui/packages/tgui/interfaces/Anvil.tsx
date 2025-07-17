import { Dispatch, SetStateAction, useState } from 'react';
import { Box, Button, Input, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { Window } from '../layouts';

type Recipe = {
  name: string;
  category: string;
  req_bar: string;
  ref: string;
  icon: string;
};

type Data = {
  hingot_type?: string;
  recipes: Recipe[];
};

export const Anvil = (props) => {
  const { data } = useBackend<Data>();

  if (!data.hingot_type) {
    return (
      <Window width={400} height={400}>
        <Window.Content>
          <LonelyAnvil />
        </Window.Content>
      </Window>
    );
  }

  return (
    <Window width={600} height={400}>
      <Window.Content>
        <RecipeDisplay />
      </Window.Content>
    </Window>
  );
};

export const LonelyAnvil = (props) => {
  return <Box>Meow</Box>;
};

export const SearchBar = (props: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) => {
  const { search, setSearch } = props;
  return <Input value={search} onChange={setSearch} fluid />;
};

export const RecipeDisplay = (props) => {
  const [search, setSearch] = useState('');

  const { act, data } = useBackend<Data>();

  const { recipes, hingot_type } = data;

  const availableRecipes = recipes
    .filter((recipe) => recipe.req_bar === hingot_type)
    .filter((recipe) => {
      if (search) {
        return recipe.name.includes(search);
      } else {
        return true;
      }
    })
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
    );

  return (
    <Section
      title="Recipes"
      fill
      scrollable
      buttons={<SearchBar search={search} setSearch={setSearch} />}
    >
      {availableRecipes.map((recipe) => (
        <Button
          key={recipe.ref}
          fluid
          onClick={() => act('choose_recipe', { ref: recipe.ref })}
        >
          <Stack align="center">
            <Stack.Item>
              <Box className={recipe.icon} mr={2} inline />
            </Stack.Item>
            <Stack.Item>
              {recipe.category} - {recipe.name}
            </Stack.Item>
          </Stack>
        </Button>
      ))}
    </Section>
  );
};
