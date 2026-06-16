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
package org.eclipse.sirius.web.application.studio.services;

import org.eclipse.sirius.components.collaborative.diagrams.dto.LayoutConfiguration;
import org.eclipse.sirius.components.core.api.IObjectSearchService;

import java.util.List;
import java.util.Objects;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.Stack;

import org.eclipse.sirius.components.collaborative.diagrams.DiagramContext;
import org.eclipse.sirius.components.collaborative.diagrams.api.ILayoutGroupsProvider;
import org.eclipse.sirius.components.collaborative.diagrams.dto.LayoutGroup;
import org.eclipse.sirius.components.core.api.IEditingContext;
import org.eclipse.sirius.components.diagrams.Diagram;
import org.eclipse.sirius.components.diagrams.Edge;
import org.eclipse.sirius.components.diagrams.Node;
import org.eclipse.sirius.components.diagrams.description.DiagramDescription;
import org.eclipse.sirius.components.domain.Entity;
import org.springframework.stereotype.Component;

/**
 * Layout provider that creates distinct groups for nodes of the same type
 * based on their physical connectivity and intermediate boundaries.
 *
 * @author ocailleau
 */
@Component
public class EntityLayoutGroupsProvider implements ILayoutGroupsProvider {

    private final IObjectSearchService objectSearchService;

    private final DefaultLayoutConfigurationProvider defaultLayoutConfigProvider;

    public EntityLayoutGroupsProvider(IObjectSearchService objectSearchService, DefaultLayoutConfigurationProvider defaultLayoutConfigProvider) {
        this.objectSearchService = Objects.requireNonNull(objectSearchService);
        this.defaultLayoutConfigProvider = Objects.requireNonNull(defaultLayoutConfigProvider);
    }

    @Override
    public boolean canHandle(IEditingContext editingContext, DiagramContext diagramContext, DiagramDescription diagramDescription) {
        if (diagramContext == null || diagramContext.diagram() == null || diagramDescription == null) {
            return false;
        }
        String targetDiagramId = "siriusComponents://representationDescription?kind=diagramDescription&sourceKind=view&sourceId=c5857f07-7382-3215-8c53-b690ca983655&sourceElementId=d59c3558-31d3-387d-a720-098370b677fb";
        return targetDiagramId.equals(diagramDescription.getId());
    }

    @Override
    public List<LayoutGroup> getLayoutGroups(IEditingContext context, DiagramContext diagramContext, DiagramDescription description) {
        Diagram diagram = diagramContext.diagram();
        if (diagram == null || diagram.getNodes() == null || diagram.getNodes().isEmpty()) {
            return List.of();
        }
        List<LayoutConfiguration> allConfigs = this.defaultLayoutConfigProvider.getLayoutConfiguration(context, diagramContext, description);

        LayoutConfiguration layeredConfig = allConfigs.stream()
                .filter(config -> "elk-layered".equals(config.id()))
                .findFirst()
                .orElse(null);

        Map<String, LayoutGroup> nodeIdToGroup = new HashMap<>();
        return detectGroups(diagram, nodeIdToGroup, context, layeredConfig);
    }

    private List<LayoutGroup> detectGroups(Diagram diagram, Map<String, LayoutGroup> nodeIdToGroup, IEditingContext context, LayoutConfiguration layeredConfig) {
        List<LayoutGroup> groups = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        int groupCounter = 1;

        for (Node rootNode : diagram.getNodes()) {
            if (!visited.contains(rootNode.getId())) {
                List<String> currentGroupIds = new ArrayList<>();
                Stack<Node> stack = new Stack<>();
                stack.push(rootNode);

                while (!stack.isEmpty()) {
                    Node currentNode = stack.pop();
                    if (!visited.contains(currentNode.getId())) {
                        visited.add(currentNode.getId());
                        currentGroupIds.add(currentNode.getId());
                        findNeighbors(currentNode, diagram.getEdges(), diagram.getNodes(), stack, visited, context);
                    }
                }

                if (!currentGroupIds.isEmpty()) {
                    LayoutGroup group = LayoutGroup.newLayoutGroup("group-" + groupCounter++).nodeIds(currentGroupIds).layoutConfiguration(layeredConfig).build();
                    groups.add(group);
                    currentGroupIds.forEach(id -> nodeIdToGroup.put(id, group));
                }
            }
        }
        return groups;
    }

    private void findNeighbors(Node curr, List<Edge> edges, List<Node> nodes, Stack<Node> stack, Set<String> visited, IEditingContext context) {
        for (Edge edge : edges) {
            if (!isSuperType(edge, nodes, context)) {
                Node neighbor = getNeighborNode(curr, edge, nodes);
                if (neighbor != null && !visited.contains(neighbor.getId())) {
                    stack.push(neighbor);
                }
            }
        }
    }

    private boolean isSuperType(Edge edge, List<Node> nodes, IEditingContext context) {
        Node sourceNode = findNodeById(nodes, edge.getSourceId());
        Node targetNode = findNodeById(nodes, edge.getTargetId());

        Object sourceObj = this.objectSearchService.getObject(context, sourceNode.getTargetObjectId()).orElse(null);
        Object targetObj = this.objectSearchService.getObject(context, targetNode.getTargetObjectId()).orElse(null);

        if (sourceObj instanceof Entity sourceEntity && targetObj instanceof Entity targetEntity) {
            return sourceEntity.getSuperTypes().contains(targetEntity) ||
                    targetEntity.getSuperTypes().contains(sourceEntity);
        }

        return false;
    }

    private Node getNeighborNode(Node current, Edge edge, List<Node> nodes) {
        Node result = null;
        if (current.getId().equals(edge.getSourceId())) {
            result = findNodeById(nodes, edge.getTargetId());
        } else if (current.getId().equals(edge.getTargetId())) {
            result = findNodeById(nodes, edge.getSourceId());
        }
        return result;
    }

    private Node findNodeById(List<Node> nodes, String id) {
        return nodes.stream().filter(n -> id.equals(n.getId())).findFirst().orElse(null);
    }
}