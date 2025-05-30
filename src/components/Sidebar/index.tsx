import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar as ShadcnSidebar,
  SidebarGroup as ShadcnSidebarGroup,
  SidebarMenuItem as ShadcnSidebarMenuItem,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { UserSwitcher } from '@/components/debugger/UserSwitcher';
import { Secured } from '@/components/secured';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';
import { useUser } from '@/contexts/UserContext';
import { getIconByName } from '@/utils/iconUtils';
import { allows, hasVisibleItems } from '@/utils/permissions';
import { NavItem } from '@/types/navigation';
import { Button } from '../ui/button';

const SidebarHeader = () => (
  <ShadcnSidebarGroup>
    <div className={cn('flex h-14 items-center border-b px-2')}>
      <div className={cn('flex items-center gap-2 font-semibold')}>
        <span>LoanOS</span>
      </div>
    </div>
  </ShadcnSidebarGroup>
);

const SidebarSubItems = ({
  items,
  onNavigation,
}: {
  items: NavItem[];
  onNavigation: (item: NavItem) => void;
}) => (
  <SidebarMenuSub>
    {items.map(item => (
      <Secured key={item.id} view={item.claims}>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton
            asChild
            onClick={() => onNavigation(item)}
            className="cursor-pointer"
          >
            {item.type === 'button' ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  if (item.actionType === 'action') {
                    // Handle action execution
                    console.log(`Executing action: ${item.actionValue}`);
                  }
                }}
              >
                {item.icon && getIconByName(item.icon)}
                <span>{item.label}</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {item.icon && getIconByName(item.icon)}
                <span>{item.label}</span>
              </div>
            )}
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </Secured>
    ))}
  </SidebarMenuSub>
);

const SidebarMenuItem = ({
  item,
  onNavigation,
}: {
  item: NavItem;
  onNavigation: (item: NavItem) => void;
}) => {
  return (
    <Secured view={item.claims}>
      <ShadcnSidebarMenuItem>
        {item.children && item.children.length > 0 ? (
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <div className="flex items-center gap-2 w-full">
                  {item.icon && getIconByName(item.icon)}
                  <span>{item.label}</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </div>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarSubItems items={item.children} onNavigation={onNavigation} />
            </CollapsibleContent>
          </Collapsible>
        ) : item.type === 'button' ? (
          <SidebarMenuButton asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                if (item.actionType === 'action') {
                  // Handle action execution
                  console.log(`Executing action: ${item.actionValue}`);
                }
              }}
            >
              {item.icon && getIconByName(item.icon)}
              <span>{item.label}</span>
            </Button>
          </SidebarMenuButton>
        ) : (
          <SidebarMenuButton asChild onClick={() => onNavigation(item)} className="cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              {item.icon && getIconByName(item.icon)}
              <span>{item.label}</span>
            </div>
          </SidebarMenuButton>
        )}
      </ShadcnSidebarMenuItem>
    </Secured>
  );
};

const SidebarGroup = ({
  group,
  hasRole,
  hasClaim,
  hasPolicy,
  onNavigation,
}: {
  group: NavItem;
  hasRole: (role: string) => boolean;
  hasClaim: (claim: string) => boolean;
  hasPolicy: (policy: string) => boolean;
  onNavigation: (item: NavItem) => void;
}) => {
  // Check if the group itself is visible based on its claims
  if (
    group.claims &&
    group.claims.length > 0 &&
    !allows(group.claims, hasRole, hasClaim, hasPolicy)
  ) {
    return null;
  }

  // Check if any children are visible
  if (!group.children || !hasVisibleItems(group.children, hasRole, hasClaim, hasPolicy)) {
    return null;
  }

  return (
    <ShadcnSidebarGroup>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.children.map((item: NavItem) => (
            <SidebarMenuItem key={item.id} item={item} onNavigation={onNavigation} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </ShadcnSidebarGroup>
  );
};

const DebuggerGroup = () => (
  <ShadcnSidebarGroup>
    <SidebarGroupLabel>Debugger</SidebarGroupLabel>
    <SidebarGroupContent>
      <UserSwitcher />
    </SidebarGroupContent>
  </ShadcnSidebarGroup>
);

function Sidebar() {
  const { hasRole, hasClaim, hasPolicy } = useUser();
  const { navTree, isLoading, error } = useNavigation();
  const navigate = useNavigate();

  const handleNavigation = (item: NavItem) => {
    if (item.actionType === 'action') {
      // Handle action execution
      console.log(`Executing action: ${item.actionValue}`);
    } else if (item.actionType === 'url') {
      // Navigate to external URL
      window.open(item.actionValue, '_blank');
    } else {
      // Navigate to internal route
      navigate(item.actionValue);
    }
  };

  if (isLoading) {
    return (
      <ShadcnSidebar>
        <div className="flex h-full flex-col">
          <SidebarContent>
            <div className="p-4 text-center">Loading navigation...</div>
          </SidebarContent>
        </div>
      </ShadcnSidebar>
    );
  }

  if (error) {
    return (
      <ShadcnSidebar>
        <div className="flex h-full flex-col">
          <SidebarContent>
            <div className="p-4 text-center text-destructive">
              Error loading navigation: {error.message}
            </div>
          </SidebarContent>
        </div>
      </ShadcnSidebar>
    );
  }

  return (
    <ShadcnSidebar>
      <div className="flex h-full flex-col">
        <SidebarContent>
          <SidebarHeader />

          {navTree.map(group => (
            <SidebarGroup
              key={group.label}
              group={group}
              hasRole={hasRole}
              hasClaim={hasClaim}
              hasPolicy={hasPolicy}
              onNavigation={handleNavigation}
            />
          ))}

          <DebuggerGroup />
        </SidebarContent>
      </div>
    </ShadcnSidebar>
  );
}

export default Sidebar;
