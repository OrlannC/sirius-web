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
    __typename: 'Palette', id: 'p1', paletteEntries: [], quickAccessTools: []
  };

  const descriptionData = {
    __typename: 'DiagramDescription',
    id: DESC_ID, 
    label: 'DemoDesc', 
    arrangeLayoutDirection: 'DOWN', 
    targetObjectIdProvider: 'defaultTargetObjectIdProvider', 
    canCreatePredicate: 'alwaysTrue', 
    labelProvider: 'defaultLabelProvider',
    actions: [],
    dropNodeCompatibility: [],
    palette: { 
      __typename: 'Palette', 
      id: 'p1', 
      paletteEntries: [], 
      quickAccessTools: []
    },
    nodeDescriptions: [{
        __typename: 'NodeDescription', 
        id: NODE_DESC_ID, 
        label: 'Node',
        iconURLs: [],
        userResizable: 'BOTH', 
        keepAspectRatio: false, 
        childNodeDescriptionIds: [], 
        borderNodeDescriptionIds: []
    }],
    edgeDescriptions: [], 
    dropHandler: 'defaultDropHandler',
    dropNodeHandler: 'defaultDropNodeHandler',
    iconURLsProvider: 'defaultIconURLsProvider'
  };

  const metadata = {
    __typename: 'RepresentationMetadata',
    id: REP_ID, 
    label: 'Demo Diagram',
    kind: 'siriusComponents://representation?type=Diagram',
    iconURLs: [], 
    representationMetadataId: 'REP_META_ID', 
    semanticData: [], 
    targetObjectId: 'TARGET_OBJECT_ID', 
    descriptionId: 'DESC_ID', 
    documentation: '',
    description: descriptionData 
  };


  const diagram = {
    __typename: 'Diagram', 
    id: REP_ID, 
    name: 'Demo',
    kind: 'siriusComponents://representation?type=Diagram',
    targetObjectId: 'root',
    descriptionId: DESC_ID, 
    metadata: metadata,
    description: descriptionData,
    nodes: [
      {
        __typename: 'Node', 
        id: "n1", 
        type: 'rectangle',
        targetObjectId: 'TARGET_OBJ_ID',
        targetObjectKind: 'TARGET_OBJ_KIND',
        targetObjectLabel: 'Target Label',
        descriptionId: NODE_DESC_ID, 
        initialBorderNodePosition: 'WEST',
        modifiers: [],
        state: 'Normal', 
        collapsingState: 'EXPANDED',
        insideLabel: { 
          __typename: 'InsideLabel', 
          id: 'l1', 
          text: 'Node Test', 
          insideLabelLocation: 'TOP_CENTER',
          headerSeparatorDisplayMode: 'NEVER',
          overflowStrategy: 'ELLIPSIS',
          textAlign: 'CENTER',
          customizedStyleProperties: [],
          style: { 
            __typename: 'LabelStyle', 
            color: 'black', 
            iconURL: '',
            background: 'transparent',
            borderColor: 'transparent',
            borderStyle: 'SOLID',
            visibility: true,
          }
        },
        outsideLabels: [],
        style: { 
          __typename: 'RectangularNodeStyle', 
          background: 'white', 
          borderColor: 'orange',
          borderStyle: 'SOLID', 
          childrenLayoutStrategy: { 
            __typename: 'FreeFormLayoutStrategy',
            kind: 'FreeForm'
          } 
        },
        borderNodes: [],
        childNodes: [], 
        customizedStyleProperties: []
      }
    ],
    edges: [],
    layoutData: { 
        __typename: 'DiagramLayoutData', 
        nodeLayoutData: [
            { 
                __typename: 'NodeLayoutData', 
                id: "n1", 
                position: { x: 100, y: 100 }, 
                size: { width: 150, height: 80 } 
            }
        ],
        edgeLayoutData: [], 
        labelLayoutData: [] 
    },
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
        diagramEvent: { __typename: 'DiagramRefreshedEventPayload', id: REP_ID, diagram, cause: 'refresh' },
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