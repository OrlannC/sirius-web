import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, Observable, ApolloLink } from '@apollo/client';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import 'reactflow/dist/style.css'; 
import { DiagramRepresentation } from '../../../packages/Diagrams/frontend/sirius-components-diagrams/src';
import { ServerContext, SelectionContextProvider, ExtensionProvider, ExtensionRegistry } from '../../../packages/Core/frontend/sirius-components-core/src';

const REP_ID = "demo-diagram-1";
const CTX_ID = "demo-context-1";
const DESC_ID = "demo-desc-1";
const NODE_DESC_ID = "demo-node-desc";
const LAYER_ID = "default-layer";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en', fallbackLng: 'en',
    resources: { en: { translation: { 'paletteSearchField.placeholder': 'Search...' } } },
    interpolation: { escapeValue: false }
  });
}

const createMock = () => {
  const cache = new InMemoryCache({ addTypename: true });

  const paletteData = { 
    __typename: 'Palette', id: 'p1', sections: [], paletteEntries: [], quickAccessTools: [] 
  };

  const descriptionData = {
    __typename: 'DiagramDescription',
    id: DESC_ID, name: 'DemoDesc', label: 'DemoDesc', debug: true,
    arrangeLayoutDirection: 'DOWN', childNodeDescriptionIds: [NODE_DESC_ID],
    nodeDescriptions: [{
        __typename: 'NodeDescription', id: NODE_DESC_ID, label: 'Node',
        userResizable: 'BOTH', keepAspectRatio: false, childNodeDescriptionIds: [], borderNodeDescriptionIds: []
    }],
    layers: [{ __typename: 'Layer', id: LAYER_ID, label: 'Layer', active: true }],
    defaultLayer: { __typename: 'Layer', id: LAYER_ID, label: 'Layer', active: true },
    activatedLayerIds: [LAYER_ID],
    dropNodeCompatibility: [],
    palette: paletteData
  };

  const metadata = {
    __typename: 'RepresentationMetadata',
    id: REP_ID, label: 'Demo Diagram',
    kind: 'siriusComponents://representation?type=Diagram',
    iconURLs: [], description: descriptionData
  };


  const diagram = {
    __typename: 'Diagram', 
    id: REP_ID, name: 'Demo',
    representationKind: 'siriusComponents://representation?type=Diagram',
    targetObjectId: 'root',
    metadata: metadata,
    nodes: [
      {
        __typename: 'Node', id: "n1", 
        type: 'rectangle',
        descriptionId: NODE_DESC_ID, layerId: LAYER_ID,
        state: 'NORMAL', visible: true, pinned: false,
        outsideLabels: [], borderNodes: [], childNodes: [], customizedStyleProperties: [], 
        insideLabel: { __typename: 'InsideLabel', id: 'l1', text: 'CUSTOM RECT', style: { __typename: 'LabelStyle', labelFormat: 'standard', fontColor: 'black' } },
        style: { __typename: 'RectangularNodeStyle', borderColor: 'black', borderSize: 1, borderStyle: 'SOLID', background: 'green', childrenLayoutStrategy: { __typename: 'FreeFormLayoutStrategy' } },
        labelEditable: true, deletable: true, initialBorderNodePosition: 'WEST'
      },

    ],
    edges: [],
    layoutData: { 
        __typename: 'DiagramLayoutData', 
        nodeLayoutData: [
            { __typename: 'NodeLayoutData', id: "n1", position: { x: 100, y: 100 }, size: { width: 150, height: 80 } }
        ],
        edgeLayoutData: [], labelLayoutData: [] 
    },
    description: descriptionData
  };

  return new ApolloClient({ 
    cache,
    link: new ApolloLink((op) => new Observable(o => {
      const success = (payloadData: any) => ({ __typename: 'SuccessPayloadWrapper', payload: { __typename: 'SuccessPayload', messages: [], ...payloadData } });
      const responseData = {
        viewer: {
          __typename: 'Viewer',
          editingContext: {
            __typename: 'EditingContext', id: CTX_ID, objects: [], representation: metadata,
            representations: { __typename: 'EditingContextRepresentationsConnection', edges: [{ __typename: 'EditingContextRepresentationsEdge', node: metadata }] },
            getDiagram: success({ diagram }),
            getDiagramDescription: descriptionData,
            getObjectsLabels: success({ labels: [] }),
            getPalette: success({ palette: paletteData })
          }
        },
        diagramEvent: { __typename: 'DiagramRefreshedEventPayload', id: REP_ID, diagram, cause: 'REFRESH' },
        layoutDiagram: success({ diagram }),
        pinDiagramElement: success({ diagram }),
        hideDiagramElement: success({ diagram }),
        fadeDiagramElement: success({ diagram })
      };

      o.next({ data: responseData });
      if (op.operationName !== 'diagramEvent') o.complete();
    }))
  });
};

const meta = {
  title: 'DiagramRepresentation', 
  component: DiagramRepresentation,
  decorators: [
    (Story, context) => {
      const client = useMemo(() => createMock(), []); 
      const registry = useMemo(() => new ExtensionRegistry(), []);

      context.args.editingContextId = CTX_ID;
      context.args.representationId = REP_ID;

      return (
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <ExtensionProvider registry={registry}>
              <ServerContext.Provider value={{ httpOrigin: 'http://localhost' }}>
                <SelectionContextProvider initialSelection={{ entries: [] }}>
                  <style>{`
                    html, body, #root { height: 100%; margin: 0; }
                    .react-flow, .react-flow__renderer, .react-flow__container { width: 100% !important; height: 100% !important; min-height: 600px !important; }
                    .react-flow__node { z-index: 9999 !important; border: 2px solid red !important; }
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
export const Default: StoryObj<typeof meta> = {};