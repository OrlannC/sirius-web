import { ApolloClient, InMemoryCache, Observable, ApolloLink } from '@apollo/client';

import { GQLViewModifier } from '@eclipse-sirius/sirius-components-diagrams';
import type { GQLNode, GQLDiagram, GQLNodeLayoutData, GQLDiagramDescription, GQLNodeDescription, GQLEdge } from '@eclipse-sirius/sirius-components-diagrams';
import type { GQLEdgeLayoutData, GQLRepresentationMetadata } from '@eclipse-sirius/sirius-components-diagrams/graphql/subscription/diagramFragment.types';
import type { GQLEdgeStyle } from '@eclipse-sirius/sirius-components-diagrams/graphql/subscription/edgeFragment.types';
import type { GQLInsideLabel, GQLLabelStyle } from '@eclipse-sirius/sirius-components-diagrams/graphql/subscription/labelFragment.types';
import type { GQLRectangularNodeStyle } from '@eclipse-sirius/sirius-components-diagrams/graphql/subscription/nodeFragment.types';
import type { GQLPalette } from '@eclipse-sirius/sirius-components-diagrams/renderer/palette/Palette.types';

const createDefaultPalette = (): GQLPalette => ({
  id: 'default-palette',
  paletteEntries: [],
  quickAccessTools: [],
});

const createDefaultDescription = (): GQLDiagramDescription => {
  const nodeDesc: GQLNodeDescription = {
    id: 'node-desc',
    userResizable: 'BOTH',
    keepAspectRatio: false,
    childNodeDescriptionIds: [],
    borderNodeDescriptionIds: []
  };

  const runtimeDescription: GQLDiagramDescription = {
    id: 'desc',
    debug: false,
    dropNodeCompatibility: [],
    arrangeLayoutDirection: 'DOWN',
    nodeDescriptions: [nodeDesc],
    edgeDescriptions: [],
    childNodeDescriptionIds: [], 
    actions: []                
  }as any;

  return runtimeDescription;
};

export const buildDiagram = (id: string, label: string): GQLDiagram => {
  const metadata: GQLRepresentationMetadata = {
    kind: 'siriusComponents://representation?type=Diagram',
    label: label,
  }; 

  return {
    id,
    targetObjectId: 'root',
    metadata,
    nodes: [],
    edges: [],
    layoutData: {
      nodeLayoutData: [],
      edgeLayoutData: [],
      labelLayoutData: []
    }
  }; 
};

interface AddEdgeParams {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export const addEdge = (diagram: GQLDiagram, params: AddEdgeParams): GQLDiagram => {

  const edgeStyle: GQLEdgeStyle = {
      lineStyle: 'SOLID',
      color: 'black',
      size: 1,
      sourceArrow: 'None',
      targetArrow: 'INPUT_FILL_CLOSED_ARROW',
      edgeType: ''
  };

  const newEdge: GQLEdge = {
      id: params.id,
      targetObjectId: `target-${params.id}`,
      targetObjectKind: 'Edge',
      targetObjectLabel: params.label || '',
      descriptionId: 'edge-desc',
      type: '',
      sourceId: params.sourceId,
      targetId: params.targetId,
      state: '',
      beginLabel: null,
      centerLabel: null,
      endLabel: null,
      style: edgeStyle,
      routingPoints: [],
      centerLabelEditable: false,
      deletable: false,
      customizedStyleProperties: []
  };

  const newEdgeLayout: GQLEdgeLayoutData = {
    id: params.id,
    bendingPoints: [],
    edgeAnchorLayoutData: []
  };

  return {
    ...diagram,
    edges: [...diagram.edges, newEdge],
    layoutData: {
      ...diagram.layoutData,
      edgeLayoutData: [...diagram.layoutData.edgeLayoutData, newEdgeLayout]
    }
  };
};

interface AddNodeParams {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const addNode = (diagram: GQLDiagram, params: AddNodeParams): GQLDiagram => {
  const labelStyle: GQLLabelStyle = {
      fontSize: 12,
      bold: false,
      italic: false,
      underline: false,
      strikeThrough: false,
      color: 'black',
      background: 'transparent',
      borderColor: 'transparent',
      borderSize: 0,
      borderRadius: 0,
      borderStyle: 'SOLID',
      iconURL: [],
      maxWidth: '',
      visibility: 'visible'
  }; 

  const insideLabel: GQLInsideLabel = {
      id: `label-${params.id}`,
      text: params.label,
      insideLabelLocation: 'TOP_CENTER',
      headerSeparatorDisplayMode: 'NEVER',
      overflowStrategy: 'ELLIPSIS',
      textAlign: 'CENTER',
      customizedStyleProperties: [],
      style: labelStyle,
      isHeader: false
  };

  const nodeStyle: GQLRectangularNodeStyle = {
    __typename: 'RectangularNodeStyle',
    background: 'white',
    borderColor: 'orange',
    borderStyle: 'SOLID',
    borderSize: 2,
    borderRadius: 0,
    childrenLayoutStrategy: {
      __typename: 'FreeFormLayoutStrategy',
      kind: 'FreeForm'
    }
  };

  const newNode: GQLNode<GQLRectangularNodeStyle> = {
      id: params.id,
      type: 'rectangle',
      targetObjectId: `target-${params.id}`,
      targetObjectKind: 'Node',
      targetObjectLabel: params.label,
      descriptionId: 'node-desc',
      pinned: false,
      position: { x: params.x, y: params.y },
      size: { width: params.width, height: params.height },
      defaultWidth: params.width,
      defaultHeight: params.height,
      labelEditable: true,
      deletable: true,
      customizedStyleProperties: [],
      initialBorderNodePosition: 'WEST',
      insideLabel: insideLabel,
      outsideLabels: [],
      borderNodes: [],
      childNodes: [],
      style: nodeStyle,
      state: GQLViewModifier.Normal
  }; 

  const newLayoutData: GQLNodeLayoutData = {
    id: params.id,
    position: { x: params.x, y: params.y },
    size: { width: params.width, height: params.height },
    minComputedSize: { width: params.width, height: params.height },
    resizedByUser: false,
    movedByUser: false,
    handleLayoutData: []
  };

  return {
    ...diagram,
    nodes: [...diagram.nodes, newNode],
    layoutData: {
      ...diagram.layoutData,
      nodeLayoutData: [...diagram.layoutData.nodeLayoutData, newLayoutData]
    }
  };
};

export const createMockClient = (diagram: GQLDiagram) => {
    const cache = new InMemoryCache({ addTypename: true });

    const paletteData = createDefaultPalette();
    const descriptionData = createDefaultDescription();
    
    const paletteWithTypename = { ...paletteData, __typename: 'Palette' };
    const descriptionWithTypename = { ...descriptionData, __typename: 'DiagramDescription', palette: paletteWithTypename };

    const enrichedDiagram = {
        ...diagram,
        __typename: 'Diagram',
        descriptionId: descriptionData.id,
        description: descriptionWithTypename,
        metadata: {
            ...diagram.metadata,
            __typename: 'RepresentationMetadata',
            descriptionId: descriptionData.id,
            description: descriptionWithTypename
        },
        layoutData: {
            ...diagram.layoutData,
            __typename: 'DiagramLayoutData'
        }
    };

    return new ApolloClient({ 
        cache,
        link: new ApolloLink((op) => new Observable(o => {
            const success = (payloadData: any) => ({ 
                __typename: 'SuccessPayloadWrapper', 
                payload: { __typename: 'SuccessPayload', messages: [], ...payloadData } 
            });

            const responseData = {
                viewer: {
                    __typename: 'Viewer',
                    editingContext: {
                        __typename: 'EditingContext', 
                        id: 'root', 
                        objects: [], 
                        representation: enrichedDiagram.metadata,
                        representations: { 
                            __typename: 'EditingContextRepresentationsConnection', 
                            edges: [{ __typename: 'EditingContextRepresentationsEdge', node: enrichedDiagram.metadata }] 
                        },
                        getDiagram: success({ diagram: enrichedDiagram }),
                        getDiagramDescription: descriptionWithTypename,
                        getObjectsLabels: success({ labels: [] }),
                        getPalette: success({ palette: paletteWithTypename })
                    }
                },
                diagramEvent: { __typename: 'DiagramRefreshedEventPayload', id: enrichedDiagram.id, diagram: enrichedDiagram, cause: 'refresh' },
                layoutDiagram: success({ diagram: enrichedDiagram }),
                pinDiagramElement: success({ diagram: enrichedDiagram }),
                hideDiagramElement: success({ diagram: enrichedDiagram }),
                fadeDiagramElement: success({ diagram: enrichedDiagram })
            };

            o.next({ data: responseData });
            if (op.operationName !== 'diagramEvent') o.complete();
        }))
    });
};