/*******************************************************************************
 * Copyright (c) 2026 Obeo.
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *     Obeo - initial API and implementation
 *******************************************************************************/
import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  InMemoryCache,
  Observable,
  Operation,
  RequestHandler,
} from '@apollo/client';
import { GQLDiagramDescription, GQLPalette } from '@eclipse-sirius/sirius-components-diagrams';
import { useMemo } from 'react';
import { EnrichedGQLDiagram } from './diagramConstructionUtils';

interface GQLGenericPayload {
  diagram?: EnrichedGQLDiagram;
  palette?: GQLPalette;
  viewer?: ViewerMock;
}

interface SuccessPayloadWrapper {
  __typename: 'SuccessPayloadWrapper';
  payload: {
    __typename: 'SuccessPayload';
    messages: string[];
    diagram?: EnrichedGQLDiagram;
    palette?: GQLPalette;
    viewer?: ViewerMock;
  };
}

interface EditingContextMock {
  __typename: 'EditingContext';
  id: string;
  representation: EnrichedGQLDiagram;
  objects: object[];
  getDiagram: SuccessPayloadWrapper;
  getDiagramDescription: GQLDiagramDescription;
  getPalette: SuccessPayloadWrapper;
}

interface ViewerMock {
  __typename: 'Viewer';
  editingContext: EditingContextMock;
}

interface DiagramEventPayload {
  __typename: 'DiagramRefreshedEventPayload';
  id: string;
  diagram: EnrichedGQLDiagram;
  cause: string;
}

interface MockResponseData {
  viewer: ViewerMock;
  diagramEvent: DiagramEventPayload;
  dropNodes: SuccessPayloadWrapper;
  layoutDiagram: SuccessPayloadWrapper;
  updateNodePosition: SuccessPayloadWrapper;
  updateNodeSize: SuccessPayloadWrapper;
}

export const useClient = (diagram: EnrichedGQLDiagram) => {
  const client = useMemo(() => {
    const cache = new InMemoryCache({ addTypename: true });

    const getObservable = (op: Operation) =>
      new Observable<FetchResult>((o) => {
        const success = (payloadData: GQLGenericPayload): SuccessPayloadWrapper => ({
          __typename: 'SuccessPayloadWrapper',
          payload: {
            __typename: 'SuccessPayload',
            messages: [],
            ...payloadData,
          },
        });

        const viewer: ViewerMock = {
          __typename: 'Viewer',
          editingContext: {
            __typename: 'EditingContext',
            id: 'root',
            representation: diagram,
            objects: [],
            getDiagram: success({ diagram }),
            getDiagramDescription: diagram.description,
            getPalette: success({ palette: diagram.description.palette }),
          },
        };

        const responseData: MockResponseData = {
          viewer: viewer,
          diagramEvent: {
            __typename: 'DiagramRefreshedEventPayload',
            id: diagram.id,
            diagram: diagram,
            cause: 'refresh',
          },
          dropNodes: success({ diagram, viewer }),
          layoutDiagram: success({ diagram, viewer }),
          updateNodePosition: success({ diagram, viewer }),
          updateNodeSize: success({ diagram, viewer }),
        };

        o.next({ data: responseData });

        if (op.operationName !== 'diagramEvent') {
          o.complete();
        }
      });

    const requestHandler: RequestHandler = (op) => getObservable(op);

    return new ApolloClient({
      cache,
      link: new ApolloLink(requestHandler),
    });
  }, [diagram]);

  return client;
};
