interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Component {
  id: string;
  definitionId: string;
  title: string;
  position: Position;
  config?: Record<string, unknown>;
}

export interface View {
  id: string;
  name: string;
  icon?: string;
  order?: number;
  filters?: unknown[];
  path?: string;
  components?: Component[];
  views?: View[]; // for nested views
}

export interface RoleDashboardConfig {
  id: string;
  roleId?: string;
  roleKey: string;
  views: View[];
} 