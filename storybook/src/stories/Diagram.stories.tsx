import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import 'reactflow/dist/style.css'; 

import { DiagramRepresentation } from '@eclipse-sirius/sirius-components-diagrams';
import { ServerContext, SelectionContextProvider, ExtensionProvider, ExtensionRegistry } from '@eclipse-sirius/sirius-components-core';

import { buildDiagram, addNode, addEdge, createMockClient } from './DiagramConstructor'; 

const contextID = 'context';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en', fallbackLng: 'en',
    resources: { en: { translation: { 'paletteSearchField.placeholder': 'Search...' } } },
    interpolation: { escapeValue: false }
  });
}

const createMyDiagram = () => {
  let d = buildDiagram(contextID,'Mon Diagramme');

  d = addNode(d, { id: 'n1', label: 'Noeud 1', x: 0, y: 0, width: 100, height: 60 });
  d = addNode(d, { id: 'n2', label: 'Noeud 2', x: 130, y: 0, width: 100, height: 60 });
  d = addNode(d, { id: 'n3', label: 'Noeud 3', x: 0, y: 80, width: 100, height: 60 });

  d = addEdge(d, { id: 'e1', sourceId: 'n1', targetId: 'n2', label: 'Transition' });
  d = addEdge(d, { id: 'e2', sourceId: 'n1', targetId: 'n3', label: 'Transition' });

  return createMockClient(d);
};

const meta = {
  title: 'DiagramRepresentation', 
  component: DiagramRepresentation,
  decorators: [
    (Story) => {
      const client = useMemo(() => createMyDiagram(), []); 
      const registry = useMemo(() => new ExtensionRegistry(), []);

      return (
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <ExtensionProvider registry={registry}>
              <ServerContext.Provider value={{ httpOrigin: 'http://localhost' }}>
                <SelectionContextProvider initialSelection={{ entries: [] }}>
                  <style>{`
                    html, body, #root { height: 100%; margin: 0; }
                    .react-flow, .react-flow__renderer, .react-flow__container { width: 100% !important; height: 100% !important; min-height: 600px !important; }
                  `}</style>
                  <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Story />
                  </div>
                </SelectionContextProvider>
              </ServerContext.Provider>
            </ExtensionProvider>
          </I18nextProvider>
        </ApolloProvider>
      );
    },
  ],
} satisfies Meta<typeof DiagramRepresentation>;

export default meta;
export const Default: StoryObj<typeof meta> = {
  args: {
    editingContextId: 'root',
    representationId: contextID,
    readOnly: false
  }
};