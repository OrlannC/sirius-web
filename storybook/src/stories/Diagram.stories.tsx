import { ApolloProvider } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18next';
import { useMemo, type ComponentProps } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import 'reactflow/dist/style.css';

import { SelectionContextProvider, ServerContext } from '@eclipse-sirius/sirius-components-core';
import { DiagramRepresentation } from '@eclipse-sirius/sirius-components-diagrams';

import { addEdge, addNode, buildDiagram, createMockClient } from './DiagramConstructor';


const contextID = 'context';


if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en', fallbackLng: 'en',
    resources: { en: { translation: { 'paletteSearchField.placeholder': 'Search...' } } },
    interpolation: { escapeValue: false }
  });
}

const createMyDiagram = () => {
  let d = buildDiagram(contextID, 'Test Layout');
  d = addNode(d, { id: 'n1', label: 'Start', x: 0, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n2', label: 'Step A', x: 150, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n3', label: 'Step B', x: 0, y: 80, width: 120, height: 60 });
  d = addEdge(d, { id: 'e1', sourceId: 'n1', targetId: 'n2' });
  d = addEdge(d, { id: 'e2', sourceId: 'n2', targetId: 'n3' });
  return createMockClient(d);
};

type StoryCustomArgs = { autoLayout: boolean; algorithm: string; direction: string; nodeSpacing: number; layerSpacing: number; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'DiagramRepresentation',
  component: DiagramRepresentation,
  argTypes: {
    autoLayout: { control: 'boolean' },
    algorithm: { control: 'select', options: ['layered','rectpacking'] },
    direction: { control: 'select', if: { arg: 'algorithm', eq: 'layered' }, options: ['DOWN', 'RIGHT','LEFT','UP'] },
    nodeSpacing: { },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

export const Default: StoryObj<DiagramStoryArgs> = {
  args: {
    editingContextId: 'root',
    representationId: contextID,
    autoLayout: true,
    algorithm: "layered",
    direction: 'DOWN',
    nodeSpacing: 20,
    layerSpacing: 10,
  },
  render: (args) => {
    const client = useMemo(() => createMyDiagram(), []);
    return (
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
            <ServerContext.Provider value={{ httpOrigin: 'http://localhost' }}>
              <SelectionContextProvider initialSelection={{ entries: [] }}>
                  <style>{`.react-flow { width: 100% !important; height: 100% !important;
                        min-height: 600px !important; min-width: 1100px !important; }`}</style>
                  <DiagramRepresentation {...args} />
              </SelectionContextProvider>
            </ServerContext.Provider>
        </I18nextProvider>
      </ApolloProvider>
    );
  }
};