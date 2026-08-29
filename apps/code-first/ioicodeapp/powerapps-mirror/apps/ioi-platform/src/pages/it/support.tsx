// M2: IT Support & Service Requests Module Home
// Uses the shared IT form configuration as the source of truth.
// Role-based access: Initiator vs IT Support based on email configuration

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Headset, User, Users, Mail, CheckCircle2, Info, Plus, X } from 'lucide-react';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { ModuleHomeLayout, type ModuleQuickAction } from '@/components/it/module-home-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { motion, AnimatePresence } from 'motion/react';
import { M2_FORMS, type ITFormConfig } from '@/lib/it-forms-config';
import { Activity } from 'lucide-react';

const IAL_FORM_CODES = new Set(['IAL1', 'IAL2', 'IAL3', 'IAL4', 'IAL5']);

const M2_FORM_CODES = M2_FORMS.map((form) => form.code);
const M2_FREQUENT_FORMS = new Set(['ITSSR', 'PRF']);

/**
 * Build quick actions from M2 form configs.
 * IAL1-5 are consolidated into a single "IT Activity Log" entry
 * that links to the unified database view page.
 */
function toQuickAction(form: ITFormConfig, index: number): ModuleQuickAction {
  const path = `/it/forms/${form.code.toLowerCase()}`;
  const colors = ['bg-primary', 'bg-secondary', 'bg-accent'];
  return {
    code: form.code,
    name: form.name,
    icon: form.icon,
    path,
    newPath: `${path}/new`,
    colorClass: colors[index % colors.length],
    isFrequent: M2_FREQUENT_FORMS.has(form.code),
  };
}

// Build M2 quick actions from non-IAL forms, then prepend the consolidated IT Activity Log
const M2_QUICK_ACTIONS: ModuleQuickAction[] = [
  {
    code: 'IAL',
    name: 'IT Activity Log',
    icon: Activity,
    path: '/it/activity-log',
    newPath: '/it/activity-log',
    colorClass: 'bg-[#003366]',
    isFrequent: true,
  },
  ...M2_FORMS
    .filter((form) => !IAL_FORM_CODES.has(form.code))
    .map(toQuickAction),
];

// Role Configuration Component
interface RoleConfigProps {
  initiatorEmail: string;
  itSupportEmails: string[];
  onInitiatorEmailChange: (email: string) => void;
  onAddItSupportEmail: (email: string) => void;
  onRemoveItSupportEmail: (email: string) => void;
  currentUserEmail: string | undefined;
  isInitiator: boolean;
  isItSupport: boolean;
}

function RoleConfigSection({
  initiatorEmail,
  itSupportEmails,
  onInitiatorEmailChange,
  onAddItSupportEmail,
  onRemoveItSupportEmail,
  currentUserEmail,
  isInitiator,
  isItSupport,
}: RoleConfigProps) {
  const [newItSupportEmail, setNewItSupportEmail] = useState('');

  const handleAddItSupport = useCallback(() => {
    const email = newItSupportEmail.trim().toLowerCase();
    if (email && email.includes('@') && !itSupportEmails.includes(email)) {
      onAddItSupportEmail(email);
      setNewItSupportEmail('');
    }
  }, [newItSupportEmail, itSupportEmails, onAddItSupportEmail]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItSupport();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Role Configuration
            </CardTitle>
            <CardDescription>
              Configure Initiator and IT Support email addresses. The screen behavior adapts based on the current user's role.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current User Info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Current User</p>
            <p className="text-sm text-muted-foreground">{currentUserEmail || 'Loading...'}</p>
          </div>
          <div className="flex gap-2">
            {isInitiator && (
              <Badge className="bg-primary text-primary-foreground">
                <User className="h-3 w-3 mr-1" />
                Initiator
              </Badge>
            )}
            {isItSupport && (
              <Badge className="bg-secondary text-secondary-foreground">
                <Headset className="h-3 w-3 mr-1" />
                IT Support
              </Badge>
            )}
            {!isInitiator && !isItSupport && currentUserEmail && (
              <Badge variant="outline" className="text-muted-foreground">
                No Role Assigned
              </Badge>
            )}
          </div>
        </div>

        {/* Role Assignment Info */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/30 border border-accent">
          <Info className="h-4 w-4 text-accent-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-accent-foreground">
            Users can have both roles if their email matches both fields. The screen dynamically shows relevant actions based on assigned role(s).
          </p>
        </div>

        {/* Email Configuration */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Initiator Email */}
          <div className="space-y-2">
            <Label htmlFor="initiator-email" className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              Initiator Email
            </Label>
            <Input
              id="initiator-email"
              type="email"
              placeholder="e.g. john.doe@company.com"
              value={initiatorEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInitiatorEmailChange(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              User who submits IT support requests. Can only view and track their own submissions.
            </p>
            {initiatorEmail && currentUserEmail && (
              <div className="flex items-center gap-1.5 text-sm">
                {initiatorEmail.toLowerCase() === currentUserEmail.toLowerCase() ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-primary font-medium">Matches current user</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Does not match current user</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* IT Support Emails - Multi-user */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center">
                <Headset className="h-3.5 w-3.5 text-secondary-foreground" />
              </div>
              IT Support Emails
              {itSupportEmails.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {itSupportEmails.length} user{itSupportEmails.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Add IT support email..."
                value={newItSupportEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItSupportEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleAddItSupport}
                disabled={!newItSupportEmail.trim() || !newItSupportEmail.includes('@')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              IT consultants who process requests. Can view all submissions and take action on them.
            </p>

            {/* IT Support Email List */}
            {itSupportEmails.length > 0 && (
              <div className="space-y-2 pt-2">
                <AnimatePresence mode="popLayout">
                  {itSupportEmails.map((email: string) => {
                    const isCurrentUser = currentUserEmail?.toLowerCase() === email.toLowerCase();
                    return (
                      <motion.div
                        key={email}
                        initial={{ opacity: 0, maxHeight: 0 }}
                        animate={{ opacity: 1, maxHeight: 80 }}
                        exit={{ opacity: 0, maxHeight: 0 }}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-secondary/10 border border-secondary/20"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Headset className="h-3.5 w-3.5 text-secondary-foreground flex-shrink-0" />
                          <span className="text-sm font-mono truncate">{email}</span>
                          {isCurrentUser && (
                            <Badge className="bg-primary text-primary-foreground text-sm">You</Badge>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItSupportEmail(email)}
                          className="text-muted-foreground hover:text-destructive flex-shrink-0 h-10 w-10"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {itSupportEmails.length === 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>No IT support users configured</span>
              </div>
            )}
          </div>
        </div>

        {/* Role Capabilities Summary */}
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div className={`p-4 rounded-lg border-2 transition-all ${isInitiator ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}>
            <div className="flex items-center gap-2 mb-2">
              <User className={`h-4 w-4 ${isInitiator ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`font-medium ${isInitiator ? 'text-foreground' : 'text-muted-foreground'}`}>Initiator Capabilities</span>
              {isInitiator && <Badge variant="outline" className="ml-auto text-primary border-primary">Active</Badge>}
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Submit new IT support requests</li>
              <li>• View own submissions only</li>
              <li>• Track request status</li>
              <li>• Respond to revision requests</li>
            </ul>
          </div>
          <div className={`p-4 rounded-lg border-2 transition-all ${isItSupport ? 'border-secondary bg-secondary/5' : 'border-border bg-muted/30'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Headset className={`h-4 w-4 ${isItSupport ? 'text-secondary-foreground' : 'text-muted-foreground'}`} />
              <span className={`font-medium ${isItSupport ? 'text-foreground' : 'text-muted-foreground'}`}>IT Support Capabilities</span>
              {isItSupport && <Badge variant="outline" className="ml-auto text-secondary-foreground border-secondary">Active</Badge>}
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• View all submitted requests</li>
              <li>• Process and resolve tickets</li>
              <li>• Request revisions from initiator</li>
              <li>• Approve or reject requests</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ITSupportModuleHomeContent() {
  const { data: submissions = [], isLoading, refetch } = useMainDBITList({
    orderBy: ['submitteddate desc'],
    filter: "formcode eq 'ITSSR' or formcode eq 'PRF' or formcode eq 'ITDR'",
  });
  const { data: user } = useUser();
  
  // Role configuration state — persisted to localStorage
  const [initiatorEmail, setInitiatorEmail] = useState(() => localStorage.getItem('it-support-initiator') || '');
  const [itSupportEmails, setItSupportEmails] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('it-support-staff') || '[]');
    } catch { return []; }
  });
  
  // Persist to localStorage on change
  useEffect(() => { localStorage.setItem('it-support-initiator', initiatorEmail); }, [initiatorEmail]);
  useEffect(() => { localStorage.setItem('it-support-staff', JSON.stringify(itSupportEmails)); }, [itSupportEmails]);
  
  // Handlers for IT Support emails
  const handleAddItSupportEmail = useCallback((email: string) => {
    setItSupportEmails((prev: string[]) => [...prev, email]);
  }, []);

  const handleRemoveItSupportEmail = useCallback((email: string) => {
    setItSupportEmails((prev: string[]) => prev.filter((e: string) => e !== email));
  }, []);
  
  // Determine current user's roles
  const currentUserEmail = user?.userPrincipalName;
  
  const { isInitiator, isItSupport } = useMemo(() => {
    if (!currentUserEmail) return { isInitiator: false, isItSupport: false };
    
    const userEmailLower = currentUserEmail.toLowerCase();
    const initiatorLower = initiatorEmail.toLowerCase().trim();
    
    return {
      isInitiator: initiatorLower !== '' && userEmailLower === initiatorLower,
      isItSupport: itSupportEmails.some((email: string) => email.toLowerCase() === userEmailLower),
    };
  }, [currentUserEmail, initiatorEmail, itSupportEmails]);

  return (
    <ModuleHomeLayout
      moduleCode="M2"
      moduleName="IT Support & Services"
      moduleDescription="Submit support tickets, program requests, and IT operational logs"
      moduleIcon={Headset}
      colorClass="bg-secondary"
      borderClass="border-l-secondary"
      formCodes={M2_FORM_CODES}
      quickActions={M2_QUICK_ACTIONS}
      submissions={submissions}
      isLoading={isLoading}
      onRefresh={refetch}
    >
      {/* Role Configuration Section - Below the main content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0, 0, 1] as const }}
      >
        <RoleConfigSection
          initiatorEmail={initiatorEmail}
          itSupportEmails={itSupportEmails}
          onInitiatorEmailChange={setInitiatorEmail}
          onAddItSupportEmail={handleAddItSupportEmail}
          onRemoveItSupportEmail={handleRemoveItSupportEmail}
          currentUserEmail={currentUserEmail}
          isInitiator={isInitiator}
          isItSupport={isItSupport}
        />
      </motion.div>
    </ModuleHomeLayout>
  );
}

export default function ITSupportModuleHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading IT Support dashboard...">
      <ITSupportModuleHomeContent />
    </DataReadyGuard>
  );
}
