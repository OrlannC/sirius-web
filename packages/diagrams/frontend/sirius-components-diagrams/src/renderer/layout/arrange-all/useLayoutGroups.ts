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
import { gql, useLazyQuery } from '@apollo/client';
import { useMultiToast } from '@eclipse-sirius/sirius-components-core';
import { useContext } from 'react';
import { DiagramContext } from '../../../contexts/DiagramContext';
import { DiagramContextValue } from '../../../contexts/DiagramContext.types';
import {
  GQLDiagramDescription,
  GQLGetLayoutGroupsData,
  GQLGetLayoutGroupsVariables,
  GQLLayoutGroup,
  GQLRepresentationDescription,
  UseLayoutGroupsValue,
} from './useLayoutGroups.types';

// La requête calquée sur getLayoutOptionsQuery
const getLayoutGroupsQuery = gql`
  query getLayoutGroups($editingContextId: ID!, $representationId: ID!) {
    viewer {
      editingContext(editingContextId: $editingContextId) {
        representation(representationId: $representationId) {
          description {
            ... on DiagramDescription {
              layoutGroups {
                id
                nodeIds
              }
            }
          }
        }
      }
    }
  }
`;

const isDiagramDescription = (
  representationDescription: GQLRepresentationDescription
): representationDescription is GQLDiagramDescription => representationDescription.__typename === 'DiagramDescription';

export const useLayoutGroups = (): UseLayoutGroupsValue => {
  const { addErrorMessage } = useMultiToast();
  const { editingContextId, diagramId } = useContext<DiagramContextValue>(DiagramContext);

  const [fetchLayoutGroups] = useLazyQuery<GQLGetLayoutGroupsData, GQLGetLayoutGroupsVariables>(getLayoutGroupsQuery, {
    variables: {
      editingContextId,
      representationId: diagramId,
    },
    onError: () => {
      addErrorMessage('An unexpected error has occurred while retrieving layout groups');
    },
  });

  const loadLayoutGroups = async (): Promise<GQLLayoutGroup[]> => {
    const response = await fetchLayoutGroups();

    const description: GQLRepresentationDescription | undefined =
      response.data?.viewer.editingContext.representation.description;

    if (description && isDiagramDescription(description)) {
      return description.layoutGroups || [];
    }

    return [];
  };

  return { loadLayoutGroups };
};
