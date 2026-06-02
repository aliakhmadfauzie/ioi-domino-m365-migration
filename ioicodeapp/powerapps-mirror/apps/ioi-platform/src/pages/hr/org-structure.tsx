import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  X,
  Search,
  Download,
  Filter,
} from 'lucide-react';
import { IGLayout } from '@/components/layout/ig-layout';
import { IGPageHeader } from '@/components/layout/ig-page-header';
import { IGSiteSwitcher } from '@/components/layout/ig-site-switcher';
import { IGZoomControls } from '@/components/layout/ig-zoom-controls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Types
interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  site: 'PRAI' | 'JHR';
  avatar?: string;
  reportsTo?: string;
  hireDate: string;
  employeeId: string;
  status: 'active' | 'on-leave' | 'probation';
}

// Sample org data (preserving existing data schema)
const orgData: OrgNode[] = [
  {
    id: 'CEO001',
    name: 'Tan Sri Lee Kim Yew',
    title: 'Managing Director',
    department: 'Executive',
    email: 'lky@ioiacidchem.com',
    phone: '+60 3-8024 3000',
    site: 'PRAI',
    hireDate: '1995-01-15',
    employeeId: 'IOI-001',
    status: 'active',
  },
  {
    id: 'CFO001',
    name: 'Dr. Ahmad Razali',
    title: 'Chief Financial Officer',
    department: 'Finance',
    email: 'ahmad.r@ioiacidchem.com',
    phone: '+60 3-8024 3010',
    site: 'PRAI',
    reportsTo: 'CEO001',
    hireDate: '2005-03-20',
    employeeId: 'IOI-045',
    status: 'active',
  },
  {
    id: 'COO001',
    name: 'Lee Mei Ling',
    title: 'Chief Operating Officer',
    department: 'Operations',
    email: 'meiling@ioiacidchem.com',
    phone: '+60 3-8024 3020',
    site: 'PRAI',
    reportsTo: 'CEO001',
    hireDate: '2008-07-12',
    employeeId: 'IOI-078',
    status: 'active',
  },
  {
    id: 'CTO001',
    name: 'Raj Kumar',
    title: 'Chief Technology Officer',
    department: 'Technology',
    email: 'raj.k@ioiacidchem.com',
    phone: '+60 3-8024 3030',
    site: 'PRAI',
    reportsTo: 'CEO001',
    hireDate: '2012-01-08',
    employeeId: 'IOI-156',
    status: 'active',
  },
  {
    id: 'HR001',
    name: 'Siti Aminah',
    title: 'HR Director',
    department: 'Human Resources',
    email: 'siti.a@ioiacidchem.com',
    phone: '+60 3-8024 3040',
    site: 'PRAI',
    reportsTo: 'CEO001',
    hireDate: '2010-05-15',
    employeeId: 'IOI-112',
    status: 'active',
  },
  {
    id: 'FIN001',
    name: 'Wong Chee Keong',
    title: 'Finance Manager',
    department: 'Finance',
    email: 'wong.ck@ioiacidchem.com',
    phone: '+60 3-8024 3011',
    site: 'PRAI',
    reportsTo: 'CFO001',
    hireDate: '2015-02-10',
    employeeId: 'IOI-234',
    status: 'active',
  },
  {
    id: 'OPS001',
    name: 'Lim Boon Huat',
    title: 'Plant Manager - PRAI',
    department: 'Operations',
    email: 'lim.bh@ioiacidchem.com',
    phone: '+60 3-8024 3021',
    site: 'PRAI',
    reportsTo: 'COO001',
    hireDate: '2014-09-01',
    employeeId: 'IOI-198',
    status: 'active',
  },
  {
    id: 'OPS002',
    name: 'Tan Wei Ming',
    title: 'Plant Manager - JHR',
    department: 'Operations',
    email: 'tan.wm@ioiacidchem.com',
    phone: '+60 7-351 2000',
    site: 'JHR',
    reportsTo: 'COO001',
    hireDate: '2016-04-18',
    employeeId: 'IOI-267',
    status: 'active',
  },
  {
    id: 'IT001',
    name: 'Arun Prakash',
    title: 'IT Manager',
    department: 'Technology',
    email: 'arun.p@ioiacidchem.com',
    phone: '+60 3-8024 3031',
    site: 'PRAI',
    reportsTo: 'CTO001',
    hireDate: '2018-11-05',
    employeeId: 'IOI-345',
    status: 'active',
  },
  {
    id: 'HR002',
    name: 'Nurul Huda',
    title: 'HR Executive',
    department: 'Human Resources',
    email: 'nurul.h@ioiacidchem.com',
    phone: '+60 3-8024 3041',
    site: 'PRAI',
    reportsTo: 'HR001',
    hireDate: '2020-06-22',
    employeeId: 'IOI-412',
    status: 'probation',
  },
  {
    id: 'HR003',
    name: 'Mohd Faizal',
    title: 'HR Executive - JHR',
    department: 'Human Resources',
    email: 'faizal@ioiacidchem.com',
    phone: '+60 7-351 2010',
    site: 'JHR',
    reportsTo: 'HR001',
    hireDate: '2021-02-15',
    employeeId: 'IOI-456',
    status: 'active',
  },
];

const sites = [
  { id: 'all', label: 'All Sites' },
  { id: 'PRAI', label: 'PRAI' },
  { id: 'JHR', label: 'JHR' },
];

// Build tree structure
interface TreeNode extends OrgNode {
  children: TreeNode[];
  level: number;
}

function buildTree(nodes: OrgNode[], parentId?: string, level = 0): TreeNode[] {
  return nodes
    .filter((node: OrgNode) => node.reportsTo === parentId)
    .map((node: OrgNode) => ({
      ...node,
      level,
      children: buildTree(nodes, node.id, level + 1),
    }));
}

// Tree Node Component
interface TreeNodeComponentProps {
  node: TreeNode;
  expandedNodes: Set<string>;
  selectedNode: string | null;
  onToggle: (id: string) => void;
  onSelect: (node: TreeNode) => void;
  isLast: boolean;
}

function TreeNodeComponent({
  node,
  expandedNodes,
  selectedNode,
  onToggle,
  onSelect,
  isLast,
}: TreeNodeComponentProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNode === node.id;

  const statusColor = {
    active: 'bg-primary/50',
    'on-leave': 'bg-accent/500',
    probation: 'bg-secondary/500',
  }[node.status];

  return (
    <div className="relative">
      {/* Vertical connector line */}
      {node.level > 0 && (
        <div
          className="ig-tree-line-v"
          style={{
            left: `${(node.level - 1) * 32 + 16}px`,
            top: 0,
            height: isLast ? '24px' : '100%',
          }}
        />
      )}

      {/* Horizontal connector line */}
      {node.level > 0 && (
        <div
          className="ig-tree-line-h"
          style={{
            left: `${(node.level - 1) * 32 + 16}px`,
            top: '24px',
            width: '16px',
          }}
        />
      )}

      {/* Node */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' as const }}
        className={cn(
          'relative flex items-center gap-2 py-2 px-3 rounded cursor-pointer ig-interactive',
          isSelected && 'bg-[#003366]/5 ring-1 ring-[#003366]/20'
        )}
        style={{ marginLeft: `${node.level * 32}px` }}
        onClick={() => onSelect(node)}
      >
        {/* Expand/Collapse */}
        {hasChildren && (
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-muted transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={node.avatar} />
            <AvatarFallback className="bg-[#003366]/10 text-[#003366] text-xs font-semibold">
              {node.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className={cn('absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white', statusColor)} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="ig-heading-md text-foreground truncate">{node.name}</span>
            <Badge variant="outline" className="ig-label-caps-sm px-1.5 py-0 h-4 border-border">
              {node.site}
            </Badge>
          </div>
          <div className="ig-data-text-sm text-muted-foreground truncate">{node.title}</div>
        </div>

        {/* Department badge */}
        <div className="hidden lg:block">
          <span className="ig-label-caps text-muted-foreground">{node.department}</span>
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' as const }}
          >
            {node.children.map((child: TreeNode, idx: number) => (
              <TreeNodeComponent
                key={child.id}
                node={child}
                expandedNodes={expandedNodes}
                selectedNode={selectedNode}
                onToggle={onToggle}
                onSelect={onSelect}
                isLast={idx === node.children.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Detail Panel Component
interface DetailPanelProps {
  node: TreeNode | null;
  onClose: () => void;
  allNodes: OrgNode[];
}

function DetailPanel({ node, onClose, allNodes }: DetailPanelProps) {
  if (!node) return null;

  const manager = node.reportsTo ? allNodes.find((n: OrgNode) => n.id === node.reportsTo) : null;
  const directReports = allNodes.filter((n: OrgNode) => n.reportsTo === node.id);

  const statusStyles = {
    active: { bg: 'bg-primary/5', text: 'text-primary', label: 'Active' },
    'on-leave': { bg: 'bg-accent/50', text: 'text-accent-foreground', label: 'On Leave' },
    probation: { bg: 'bg-secondary/50', text: 'text-secondary-foreground', label: 'Probation' },
  }[node.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' as const }}
      className="w-80 flex-shrink-0 bg-white border-l border-[#cbd5e1] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#cbd5e1] bg-gradient-to-br from-[#003366] to-[#004d80]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-white/30">
              <AvatarImage src={node.avatar} />
              <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                {node.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="ig-heading-lg text-white">{node.name}</h3>
              <p className="ig-data-text text-white/70">{node.title}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className={cn('ig-pill', statusStyles.bg, statusStyles.text)}>
            {statusStyles.label}
          </span>
          <Badge variant="outline" className="bg-white/10 border-white/20 text-white ig-label-caps-sm">
            {node.site}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Contact Info */}
          <div>
            <h4 className="ig-label-caps text-muted-foreground mb-2">Contact</h4>
            <div className="space-y-2">
              <a
                href={`mailto:${node.email}`}
                className="flex items-center gap-2 ig-data-text text-foreground hover:text-[#003366] transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                {node.email}
              </a>
              <a
                href={`tel:${node.phone}`}
                className="flex items-center gap-2 ig-data-text text-foreground hover:text-[#003366] transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                {node.phone}
              </a>
            </div>
          </div>

          {/* Employment Info */}
          <div>
            <h4 className="ig-label-caps text-muted-foreground mb-2">Employment</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 ig-data-text text-foreground">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                {node.department}
              </div>
              <div className="flex items-center gap-2 ig-data-text text-foreground">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                Employee ID: {node.employeeId}
              </div>
              <div className="flex items-center gap-2 ig-data-text text-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Site: {node.site === 'PRAI' ? 'Prai, Penang' : 'Johor Bahru'}
              </div>
              <div className="flex items-center gap-2 ig-data-text text-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Since {new Date(node.hireDate).toLocaleDateString('en-MY', { year: 'numeric', month: 'short' })}
              </div>
            </div>
          </div>

          {/* Reports To */}
          {manager && (
            <div>
              <h4 className="ig-label-caps text-muted-foreground mb-2">Reports To</h4>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded border border-border">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-[#003366]/10 text-[#003366] text-xs font-semibold">
                    {manager.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="ig-data-text font-semibold text-foreground">{manager.name}</div>
                  <div className="ig-data-text-sm text-muted-foreground">{manager.title}</div>
                </div>
              </div>
            </div>
          )}

          {/* Direct Reports */}
          {directReports.length > 0 && (
            <div>
              <h4 className="ig-label-caps text-muted-foreground mb-2">Direct Reports ({directReports.length})</h4>
              <div className="space-y-1.5">
                {directReports.map((report: OrgNode) => (
                  <div
                    key={report.id}
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded border border-border"
                  >
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarFallback className="bg-[#006a6a]/10 text-[#006a6a] text-[10px] font-semibold">
                        {report.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="ig-data-text-sm font-semibold text-foreground truncate">{report.name}</div>
                      <div className="ig-data-text-sm text-muted-foreground truncate">{report.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="p-3 border-t border-[#cbd5e1] bg-muted/50">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-8 ig-data-text">
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Email
          </Button>
          <Button size="sm" className="flex-1 h-8 bg-[#003366] hover:bg-[#002244] ig-data-text">
            View Profile
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Main Page Component
export default function OrgStructurePage() {
  const [activeSite, setActiveSite] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['CEO001', 'COO001', 'HR001']));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [zoom, setZoom] = useState(1);

  // Filter data by site
  const filteredData = useMemo(() => {
    let data = orgData;
    if (activeSite !== 'all') {
      data = data.filter((node: OrgNode) => node.site === activeSite);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (node: OrgNode) =>
          node.name.toLowerCase().includes(query) ||
          node.title.toLowerCase().includes(query) ||
          node.department.toLowerCase().includes(query)
      );
    }
    return data;
  }, [activeSite, searchQuery]);

  // Build tree
  const tree = useMemo(() => buildTree(filteredData), [filteredData]);

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleZoomIn = useCallback(() => setZoom((z: number) => Math.min(z + 0.1, 1.5)), []);
  const handleZoomOut = useCallback(() => setZoom((z: number) => Math.max(z - 0.1, 0.5)), []);
  const handleZoomReset = useCallback(() => setZoom(1), []);

  const expandAll = useCallback(() => {
    setExpandedNodes(new Set(filteredData.map((n: OrgNode) => n.id)));
  }, [filteredData]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  return (
    <IGLayout showCanvas>
      <div className="flex flex-col h-[calc(100vh-48px)]">
        {/* Page Header */}
        <IGPageHeader
          title="Organization Structure"
          subtitle={`${filteredData.length} employees across ${activeSite === 'all' ? 'all sites' : activeSite}`}
          actions={
            <div className="flex items-center gap-3">
              <IGSiteSwitcher
                sites={sites}
                activeSite={activeSite}
                onChange={setActiveSite}
              />
              <Button variant="outline" size="sm" className="h-8 ig-data-text">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
            </div>
          }
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#cbd5e1] bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-64 h-8 pl-8 ig-data-text"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-8 ig-data-text text-muted-foreground">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={expandAll} className="h-7 px-2 ig-data-text-sm text-muted-foreground">
              Expand All
            </Button>
            <span className="text-muted-foreground">|</span>
            <Button variant="ghost" size="sm" onClick={collapseAll} className="h-7 px-2 ig-data-text-sm text-muted-foreground">
              Collapse All
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Tree View */}
          <div className="flex-1 overflow-auto p-6" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
            <div className="min-w-[600px]">
              {tree.length > 0 ? (
                tree.map((node: TreeNode, idx: number) => (
                  <TreeNodeComponent
                    key={node.id}
                    node={node}
                    expandedNodes={expandedNodes}
                    selectedNode={selectedNode?.id || null}
                    onToggle={toggleNode}
                    onSelect={setSelectedNode}
                    isLast={idx === tree.length - 1}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="ig-heading-md text-muted-foreground">No employees found</h3>
                  <p className="ig-data-text text-muted-foreground mt-1">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <AnimatePresence>
            {selectedNode && (
              <DetailPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                allNodes={orgData}
              />
            )}
          </AnimatePresence>

          {/* Zoom Controls */}
          <IGZoomControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleZoomReset}
            className="fixed bottom-6 right-6"
          />
        </div>
      </div>
    </IGLayout>
  );
}
