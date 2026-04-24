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
import type { Meta, StoryObj } from "@storybook/react";
import { PanelWrapper } from "../../utils/test/PanelWrapper";

const meta = {
  title: "Test/Panel",
  tags: ["autodocs"],
} satisfies Meta<typeof PanelWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Panel: Story = {
  name: "Panel",
  render: () => <PanelWrapper />,
};