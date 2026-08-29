# IOI Platform — UI Design Requirements (Detailed Spec)

> Stack: React 18 · TypeScript · Tailwind CSS · shadcn/ui · lucide-react · motion/react · TanStack Query  
> Codebase: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/`

---

## Table of Contents
1. [Design System](#1-design-system)
2. [Screen: Dashboard](#2-screen-dashboard)
3. [Screen: Module Hub (Department Home)](#3-screen-module-hub-department-home)
4. [Screen: View List (Form Index)](#4-screen-view-list-form-index)
5. [Screen: Detail View](#5-screen-detail-view)
6. [Screen: New Form](#6-screen-new-form)
7. [PRF Workflow State Machine](#7-prf-workflow-state-machine)
8. [Shared Component Reference](#8-shared-component-reference)

---

## 1. Design System

### Spacing Scale (Tailwind)
| Token | px | Usage |
|---|---|---|
| `gap-3` | 12px | Button group gaps, header element spacing |
| `gap-4` | 16px | Card content grids |
| `gap-5` | 20px | Between section cards on detail page |
| `gap-6` | 24px | Between chart cards, bottom section grid |
| `p-4` | 16px | Module hub page padding (mobile) |
| `p-5` | 20px | SectionCard content padding |
| `p-6` | 24px | Large content area padding |
| `px-4 py-3` | 16/12px | SectionCard header, dark page header |
| `px-3 py-2.5` | 12/10px | ReadonlyField value box |

### Colour Reference
| Role | Tailwind / Value | Usage |
|---|---|---|
| Brand dark | `bg-slate-950` | Detail page header bar |
| Brand navy | `#003366` | List view header bar |
| Primary | `hsl(var(--primary))` | Buttons, icons, module M1/M4 |
| Secondary | `hsl(var(--secondary))` | M2, pending icons |
| Accent | `hsl(var(--accent))` | M3, accent hover states |
| Destructive | `hsl(var(--destructive))` | Rejected, alert, error |
| Emerald | `bg-emerald-700` | Approve buttons |
| Amber | `bg-amber-700` | Submit/Send buttons |
| Blue | `bg-blue-700` | Assign/IT action buttons |
| Purple | `bg-purple-700` | SAP-specific action buttons |
| Red outline | `border-red-300 text-red-700` | Reject buttons |
| Amber outline | `border-amber-300 text-amber-700` | KIV buttons |

### Animation Presets
```ts
// Page-level container (staggered children)
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

// Individual card/item entry
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
};

// Module card hover/tap
whileHover={{ scale: 1.01 }}
whileTap={{ scale: 0.99 }}

// Conditional reveal (SAP fields, etc.)
initial={{ opacity: 0, maxHeight: 0 }}
animate={{ opacity: 1, maxHeight: 400 }}
```

---

## 2. Screen: Dashboard

**Route:** `/dashboard`  
**File:** `src/pages/dashboard.tsx`

---

### 2A. Wireframe — Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ STICKY HEADER                                                       │
│ sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ max-w-7xl mx-auto px-6 py-4                                     │ │
│ │ flex flex-row items-center justify-between gap-4                │ │
│ │                                                                 │ │
│ │ LEFT: flex items-center gap-3                                   │ │
│ │  ┌──────────────────┐                                           │ │
│ │  │ h-10 w-10        │  Good morning, {fullName}!               │ │
│ │  │ rounded-xl       │  ● {userPrincipalName}                   │ │
│ │  │ bg-gradient-to-br│  text-xl font-bold / text-sm muted       │ │
│ │  │ from-primary     │  ● = inline-block h-1.5 w-1.5 rounded    │ │
│ │  │ to-blue-600      │    bg-emerald-500                        │ │
│ │  │ [BarChart3 icon] │                                           │ │
│ │  └──────────────────┘                                           │ │
│ │                                                                 │ │
│ │ RIGHT: flex items-center gap-2                                  │ │
│ │  [Calendar icon] [Last 30 days ▼]  [↻ Refresh]  [🏢 Hub]      │ │
│ │  w-[140px] Select                  outline sm    sm             │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ MAIN  max-w-7xl mx-auto px-6 py-6 space-y-6                        │
│                                                                     │
│ ── KPI CARDS ── grid gap-4 grid-cols-2 lg:grid-cols-4              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│ │▔▔▔▔▔▔▔▔▔▔▔▔▔│ │▔▔▔▔▔▔▔▔▔▔▔▔▔│ │▔▔▔▔▔▔▔▔▔▔▔▔▔│ │▔▔▔▔▔▔▔▔▔▔▔│  │
│ │ 4px gradient │ │ 4px gradient │ │ 4px gradient │ │4px gradient│  │
│ │ top bar      │ │ top bar      │ │ top bar      │ │ top bar    │  │
│ │ p-5          │ │ p-5          │ │ p-5          │ │ p-5        │  │
│ │              │ │              │ │              │ │            │  │
│ │ TOTAL        │ │ PENDING      │ │ APPROVAL RATE│ │ AVG PROC.  │  │
│ │ SUBMISSIONS  │ │              │ │              │ │            │  │
│ │              │ │              │ │              │ │            │  │
│ │ 1,240   [🔵]│ │  38     [🟡]│ │  87%    [🟢]│ │  4     [🟣]│  │
│ │ text-3xl bold│ │ text-3xl bold│ │ text-3xl bold│ │text-3xl    │  │
│ │              │ │              │ │              │ │            │  │
│ │ [badge]Last30│ │ ⚠ Awaiting  │ │ [Progress h- │ │ days avg   │  │
│ │              │ │   action     │ │  1.5]        │ │ text-xs muted│ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
│  Icon boxes: h-12 w-12 rounded-xl bg-{color}/10                    │
│  Icons: h-6 w-6 text-{color}-600                                   │
│  Pending card: cursor-pointer hover:shadow-lg (→ /approvals)       │
│                                                                     │
│ ── CHARTS ROW ── grid gap-6 lg:grid-cols-2                         │
│ ┌──────────────────────────────┐ ┌──────────────────────────────┐  │
│ │ CardHeader pb-2              │ │ CardHeader pb-2              │  │
│ │ [TrendingUp] 7-Day Trend     │ │ [PieChart] Status Dist.      │  │
│ │──────────────────────────────│ │──────────────────────────────│  │
│ │ CardContent                  │ │ CardContent                  │  │
│ │ ChartContainer h-[200px]     │ │ flex items-center justify-   │  │
│ │ <LineChart margin={          │ │   center                     │  │
│ │   top:10 right:10            │ │ ChartContainer               │  │
│ │   left:-20 bottom:0}>        │ │   h-[200px] max-w-[300px]   │  │
│ │ CartesianGrid strokeDash="3 3│ │ <RePieChart>                 │  │
│ │   vertical={false}           │ │   <Pie innerRadius=50        │  │
│ │ XAxis: date label (EEE)      │ │        outerRadius=80        │  │
│ │ YAxis: count                 │ │        paddingAngle=2>        │  │
│ │ Line: submissions, stroke=   │ │ + legend column (ml-4)       │  │
│ │   hsl(var(--primary)) sw=2   │ │   h-3 w-3 dot + name + count│  │
│ └──────────────────────────────┘ └──────────────────────────────┘  │
│                                                                     │
│ ── DEPT BREAKDOWN ── full-width Card                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ CardHeader pb-3                                                 │ │
│ │ [Building2] Department Breakdown                                │ │
│ │─────────────────────────────────────────────────────────────── │ │
│ │ CardContent space-y-1                                           │ │
│ │                                                                 │ │
│ │ Row (per dept, sorted by total desc):                           │ │
│ │ flex items-center gap-4 p-3 rounded-lg                         │ │
│ │ hover:bg-muted/50 transition-colors cursor-pointer group        │ │
│ │                                                                 │ │
│ │  ┌────────┐  Information Technology       [3 pending]  120  →  │ │
│ │  │ h-10   │  ──────────────────────                    text-sm │ │
│ │  │ w-10   │  h-1.5 bg-muted rounded-full overflow-hidden flex  │ │
│ │  │rounded │  ├──green──────┤├──amber──┤                        │ │
│ │  │gradient│  approved%      pending%                           │ │
│ │  └────────┘                                                     │ │
│ │                                                                 │ │
│ │ Arrow: h-4 w-4 text-muted-foreground                           │ │
│ │        opacity-0 group-hover:opacity-100 transition-opacity     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ── QUICK STATS ── Card bg-gradient-to-br from-primary/5 to-blue-   │
│                   500/5 border-primary/10                           │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ p-5  grid grid-cols-2 sm:grid-cols-4 gap-6                     │ │
│ │                                                                 │ │
│ │    Approved      Rejected      Completed    Active Depts        │ │
│ │  text-3xl bold  text-3xl     text-3xl       text-3xl           │ │
│ │  text-primary   text-destr.  text-emerald   text-foreground    │ │
│ │  "Approved"     "Rejected"   "Completed"    (dept count)       │ │
│ │  text-xs muted  text-xs muted text-xs muted text-xs muted      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ pb-24 lg:pb-8 (clears mobile bottom nav)                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 2B. Wireframe — Mobile (<768px)

```
┌───────────────────────────────┐
│ STICKY HEADER px-4 py-4       │
│ flex-col gap-4                │
│ [icon] Good morning, Name     │
│         ● email               │
│ [30d ▼]        [↻] [🏢 Hub]  │
├───────────────────────────────┤
│ KPI CARDS grid-cols-2 gap-4  │
│ ┌────────────┐ ┌────────────┐ │
│ │ Total      │ │ Pending    │ │
│ │ 1,240      │ │ 38         │ │
│ └────────────┘ └────────────┘ │
│ ┌────────────┐ ┌────────────┐ │
│ │ Appr Rate  │ │ Avg Days   │ │
│ │ 87%        │ │ 4          │ │
│ └────────────┘ └────────────┘ │
├───────────────────────────────┤
│ CHARTS — stacked (1 col)     │
│ ┌─────────────────────────┐  │
│ │ 7-Day Trend LineChart   │  │
│ └─────────────────────────┘  │
│ ┌─────────────────────────┐  │
│ │ Status Distribution Pie │  │
│ └─────────────────────────┘  │
├───────────────────────────────┤
│ DEPT BREAKDOWN (same rows)   │
├───────────────────────────────┤
│ QUICK STATS grid-cols-2      │
│ Approved | Rejected          │
│ Completed | Active Depts     │
├───────────────────────────────┤
│ <MobileBottomNav variant=hub>│
└───────────────────────────────┘
```

### 2C. Component Tree (Dashboard)

```tsx
<div className="min-h-screen bg-background">

  {/* STICKY HEADER */}
  <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* LEFT: Greeting */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600
                          flex items-center justify-center shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{greeting}, {name}!</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {email}
            </p>
          </div>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>

          <Button size="sm" onClick={() => navigate('/')} className="gap-2">
            <Building2 className="h-4 w-4" />
            Hub
          </Button>
        </div>
      </div>
    </div>
  </header>

  {/* MAIN CONTENT */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-8 space-y-6">

    {/* KPI CARDS — Loading: <Skeleton> in same grid layout */}
    <motion.div className="grid gap-4 grid-cols-2 lg:grid-cols-4"
                variants={containerVariants} initial="hidden" animate="show">

      {/* Total Submissions */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Total Submissions
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">{kpis.total}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs">
              <Badge variant="secondary">{timeRangeLabel}</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending — clickable, navigates to /approvals */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/approvals')}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
          <CardContent className="p-5">
            {/* Same structure as Total — icon: Clock, color: amber */}
            <div className="mt-3 flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3" />
              <span>Awaiting action</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Approval Rate */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="p-5">
            {/* value: {kpis.approvalRate}% — icon: CheckCircle, color: emerald */}
            <div className="mt-3">
              <Progress value={kpis.approvalRate} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Avg Processing */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
          <CardContent className="p-5">
            {/* value: {kpis.avgProcessingDays} — icon: TrendingUp, color: violet */}
            <div className="mt-3 text-xs text-muted-foreground">days average</div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>

    {/* CHARTS ROW */}
    <div className="grid gap-6 lg:grid-cols-2">
      <Card> {/* 7-Day Trend LineChart */} </Card>
      <Card> {/* Status Distribution PieChart (donut) */} </Card>
    </div>

    {/* DEPT BREAKDOWN */}
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Department Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {departmentStats.filter(d => d.total > 0).map(dept => (
            <div key={dept.code}
                 className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50
                            transition-colors cursor-pointer group"
                 onClick={() => navigate(`/${dept.code.toLowerCase()}`)}>
              <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center
                                  bg-gradient-to-br', dept.gradient)}>
                <dept.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-foreground">{dept.name}</span>
                  <div className="flex items-center gap-2 text-xs">
                    {dept.pending > 0 && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {dept.pending} pending
                      </Badge>
                    )}
                    <span className="font-semibold text-foreground">{dept.total}</span>
                  </div>
                </div>
                {/* Dual progress bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: `${approvedPercent}%` }} />
                  <div className="h-full bg-amber-500"  style={{ width: `${pendingPercent}%` }} />
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground
                                     opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* QUICK STATS */}
    <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/10">
      <CardContent className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: kpis.approved,  label: 'Approved',     color: 'text-primary'     },
            { value: kpis.rejected,  label: 'Rejected',     color: 'text-destructive' },
            { value: kpis.completed, label: 'Completed',    color: 'text-emerald-600' },
            { value: activeDepts,    label: 'Active Depts', color: 'text-foreground'  },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </main>

  <MobileBottomNav variant="hub" />
</div>
```

### 2D. Interaction Logic

| Interaction | Trigger | Behaviour |
|---|---|---|
| Time range change | `<Select onValueChange>` | Re-filters `allData` via `useMemo`, updates all KPIs + charts simultaneously. No API call — client-side only. |
| Refresh | Button click | Sets `isRefreshing=true`, calls `queryClient.invalidateQueries` for all 7 dept list keys, waits for all to resolve, sets `isRefreshing=false`. Button shows `<Loader2 animate-spin>` during refresh. |
| Dept row click | `onClick` on row div | `navigate('/{dept.code.toLowerCase()}')` |
| Pending card click | `onClick` on Card | `navigate('/approvals')` |
| Hub button | `onClick` | `navigate('/')` |
| Greeting | `getGreeting()` | Returns "Good morning" (0–11h), "Good afternoon" (12–16h), "Good evening" (17–23h) based on `new Date().getHours()` |

---

## 3. Screen: Module Hub (Department Home)

**Route:** `/it`  
**File:** `src/pages/it/index.tsx`

---

### 3A. Wireframe — Desktop

```
┌────────────────────────────────────────────────────────────────────┐
│ space-y-6 p-4 md:p-6 pb-24 md:pb-6                                │
│ (motion.div containerVariants initial=hidden animate=show)         │
│                                                                    │
│ ── PAGE HEADER ─────────────────────────────────────────────────  │
│  flex flex-col gap-4 md:flex-row md:items-center md:justify-between│
│                                                                    │
│  LEFT:                          RIGHT (hidden on mobile md:flex):  │
│  ┌──────────────────────────┐    [↻ Refresh] [✓ Approver Dashboard]│
│  │p-2.5 bg-primary rounded-xl│   [👁 View Submissions] [+ New Req]│
│  │[Monitor h-7 w-7 white]   │                                      │
│  └──────────────────────────┘                                      │
│  text-3xl font-bold tracking-tight                                 │
│  "IT Department"                                                    │
│  text-muted-foreground                                              │
│  "Welcome, {firstName}! Select a module below..."                  │
│                                                                    │
│ ── KPI STRIP ─────────────────────────────────────────────────── │
│  grid grid-cols-2 md:grid-cols-5 gap-4                             │
│  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌─────────────┐ │
│  │CardContent││CardContent││CardContent││CardContent││col-span-2   │ │
│  │p-4       ││p-4       ││p-4       ││p-4       ││md:col-span-1 │ │
│  │          ││          ││          ││          ││p-4           │ │
│  │This Month││ Pending  ││ Approved ││ Rejected ││    Total     │ │
│  │text-sm   ││text-sm   ││text-sm   ││text-sm   ││text-sm muted │ │
│  │text-muted││text-muted││text-muted││text-muted││              │ │
│  │  12      ││   5      ││  38      ││   2      ││     120      │ │
│  │text-2xl  ││text-2xl  ││text-2xl  ││text-2xl  ││text-2xl bold │ │
│  │bold      ││bold      ││bold      ││bold      ││              │ │
│  │[▲ h-10   ││[⏱ h-10  ││[✓ h-10  ││[✗ h-10  ││[📄 h-10     │ │
│  │w-10      ││w-10      ││w-10      ││w-10      ││w-10          │ │
│  │rounded-lg││rounded-lg││rounded-lg││rounded-lg││rounded-lg    │ │
│  │bg-primary││bg-sec.   ││bg-primary││bg-destr. ││bg-accent     │ │
│  │icon      ││icon      ││icon      ││icon      ││icon]         │ │
│  └──────────┘└──────────┘└──────────┘└──────────┘└─────────────┘ │
│                                                                    │
│ ── ALERT (conditional, alertCount > 0) ────────────────────────  │
│  <Alert variant="destructive">                                     │
│    ⚠ {n} request(s) need your attention (rejected or revision      │
│       requested). [View now →]                                     │
│  </Alert>                                                          │
│                                                                    │
│ ── MODULE CARDS ──────────────────────────────────────────────── │
│  Header: flex items-center justify-between mb-4                    │
│    "IT Modules"   text-xl font-semibold                            │
│    "Select a module..." text-sm muted                              │
│    [View All Forms →]  Button ghost sm                             │
│                                                                    │
│  grid md:grid-cols-2 gap-4                                         │
│                                                                    │
│  ┌──────────────────────────────────┐ ┌────────────────────────┐  │
│  │ Card border-l-4 border-l-primary │ │ border-l-secondary     │  │
│  │ h-full cursor-pointer            │ │                        │  │
│  │ hover:shadow-lg transition-all   │ │                        │  │
│  │ whileHover scale:1.01            │ │                        │  │
│  │─────────────────────────────────│ │                        │  │
│  │ CardHeader pb-2                  │ │                        │  │
│  │  flex items-start gap-4          │ │                        │  │
│  │  ┌────────────┐                  │ │                        │  │
│  │  │ h-14 w-14  │ [M1 badge]       │ │                        │  │
│  │  │ rounded-xl │ User & Access    │ │                        │  │
│  │  │ bg-primary │ text-lg [>]      │ │                        │  │
│  │  │ [Key icon] │ Description...   │ │                        │  │
│  │  └────────────┘ (line-clamp-2)   │ │                        │  │
│  │─────────────────────────────────│ │                        │  │
│  │ CardContent pt-0                 │ │                        │  │
│  │  Status dots row:                │ │                        │  │
│  │  ● Pending: 5 ● Approved: 38    │ │                        │  │
│  │  ● Rejected: 2                   │ │                        │  │
│  │  h-2 w-2 rounded-full            │ │                        │  │
│  │  secondary / primary / destructive│ │                        │  │
│  │──────────────────────────────── │ │                        │  │
│  │  border-t flex justify-between   │ │                        │  │
│  │  "12 this month · 120 total"     │ │                        │  │
│  │  text-xs muted                   │ │                        │  │
│  │                 [+ EAF] Button   │ │              [+ ITSSR] │  │
│  │                 secondary sm h-8 │ │                        │  │
│  └──────────────────────────────────┘ └────────────────────────┘  │
│                                                                    │
│ ── BOTTOM SECTION ── grid lg:grid-cols-2 gap-6                    │
│  ┌─────────────────────────────┐  ┌──────────────────────────┐    │
│  │ Recent Activity             │  │ Quick Links              │    │
│  │ CardHeader justify-between  │  │                          │    │
│  │  [Activity] Latest across   │  │ grid gap-3               │    │
│  │  all modules   [View All →] │  │                          │    │
│  │─────────────────────────────│  │ Row structure:           │    │
│  │ Submission rows ×5:         │  │  flex items-center gap-3 │    │
│  │  flex items-center gap-3    │  │  p-3 rounded-lg border   │    │
│  │  p-3 rounded-lg border      │  │  hover:bg-accent         │    │
│  │  hover:bg-muted/50          │  │  hover:text-accent-fg    │    │
│  │                             │  │  transition-all          │    │
│  │  [📄 h-10 w-10 bg-muted]   │  │                          │    │
│  │  Title (font-medium truncate│  │  [icon h-10 w-10         │    │
│  │  formcode · "2 hours ago"   │  │   rounded-lg coloured]   │    │
│  │                  [badge]    │  │  Title + description      │    │
│  │                             │  │                       →  │    │
│  └─────────────────────────────┘  └──────────────────────────┘    │
│                                                                    │
│ ── MOBILE STICKY CTA (md:hidden) ─────────────────────────────── │
│  fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-50   │
│  flex gap-2                                                        │
│  [👁 Submissions  Sheet trigger  flex-1 min-h-[48px] outline]     │
│  [+ New Request                  flex-1 min-h-[48px] primary ]    │
└────────────────────────────────────────────────────────────────────┘
```

### 3B. Component Tree (Key Sections)

```tsx
{/* MODULE CARD */}
<motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
  <Card className={`h-full cursor-pointer hover:shadow-lg transition-all border-l-4 ${module.borderClass}`}
        onClick={() => navigate(module.path)}>
    <CardHeader className="pb-2">
      <div className="flex items-start gap-4">
        <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${module.colorClass} shrink-0`}>
          <module.icon className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-mono">{module.code}</Badge>
            <CardTitle className="text-lg truncate">{module.name}</CardTitle>
          </div>
          <CardDescription className="line-clamp-2">{module.description}</CardDescription>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      {/* Status dots */}
      <div className="flex items-center gap-4 text-sm">
        {[
          { color: 'bg-secondary',    label: 'Pending',  value: module.pending  },
          { color: 'bg-primary',      label: 'Approved', value: module.approved },
          { color: 'bg-destructive',  label: 'Rejected', value: module.rejected },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${s.color}`} />
            <span className="text-muted-foreground">{s.label}:</span>
            <span className="font-medium">{s.value}</span>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <p className="text-xs text-muted-foreground">
          {module.thisMonth} this month · {module.total} total
        </p>
        <Button variant="secondary" size="sm" className="h-8"
                onClick={(e) => { e.stopPropagation(); navigate(module.quickForm.path); }}>
          <Plus className="h-3 w-3 mr-1" />
          {module.quickForm.name}
        </Button>
      </div>
    </CardContent>
  </Card>
</motion.div>

{/* NEW REQUEST SHEET — 2-step: Module → Forms */}
<Sheet open={newRequestOpen} onOpenChange={(open) => { if (!open) setActiveModule(null); setNewRequestOpen(open); }}>
  <SheetContent side="bottom" className="h-[85vh] sm:max-w-xl">
    <SheetHeader>
      <SheetTitle>{selectedModule ? `${selectedModule.name} forms` : 'Select a module'}</SheetTitle>
    </SheetHeader>
    {/* Step 1: module tiles */}
    {/* Step 2: form tiles for selected module, with back button */}
    {/* Each tile: rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm
                   hover:border-slate-300 hover:shadow-md transition */}
  </SheetContent>
</Sheet>
```

### 3C. Interaction Logic

| Interaction | Trigger | Behaviour |
|---|---|---|
| Module card click | `onClick` on Card | `navigate(module.path)` e.g. `/it/access` |
| Quick form button | `onClick` (stops propagation) | `navigate(module.quickForm.path)` — skips module hub, goes straight to `/it/forms/{code}/new` |
| "New Request" button | Click | Opens `<Sheet side="bottom">` |
| Module tile in sheet | Click | Sets `activeModule`, sheet stays open, renders form list |
| Back in sheet | Click | Clears `activeModule`, returns to module list step |
| Form tile in sheet | Click | Closes sheet, clears `activeModule`, navigates to new form route |
| "View Submissions" | Click | Navigates to `/my-submissions` |
| "Approver Dashboard" | Link | Navigates to `/it/approver-dashboard` |
| "Refresh" button | Click | Calls `refetch()` from `useMainDBITList` |
| Alert "View now" | Link | Navigates to `/my-submissions?status=action-required` |
| Recent submission row | Click | `navigate(getITFormDetailPath(submission.formcode, submission.id))` |

---

## 4. Screen: View List (Form Index)

**Route:** `/it/forms/prf`  
**File:** `src/pages/it/forms/prf/index.tsx`

---

### 4A. Wireframe — Desktop

```
┌────────────────────────────────────────────────────────────────────┐
│ HEADER BAR  bg:#003366                                             │
│ px-6 py-4                                                          │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ max-w-7xl mx-auto                                            │   │
│ │ flex items-center gap-4                                       │   │
│ │                                                              │   │
│ │ [← ghost icon btn text-white hover:bg-white/10]              │   │
│ │                                                              │   │
│ │ Program Request Form (PRF)    text-xl font-bold text-white   │   │
│ │ Database View — All Requests  text-sm rgba(255,255,255,0.7)  │   │
│ └──────────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────────┤
│ CONTENT  max-w-7xl mx-auto p-6                                     │
│                                                                    │
│ motion.div initial={opacity:0, y:20} animate={opacity:1, y:0}     │
│           transition={duration:0.3}                                │
│                                                                    │
│ TOOLBAR: flex justify-between items-center mb-6                    │
│  "{n} request(s)"  text-sm color:#5C5C5C                           │
│  [+ New Request]  Button bg:#003366 text-white                     │
│                                                                    │
│ TABLE CARD:  rounded-xl p-6  bg:white  shadow:0 1px 3px rgba(0,0, │
│             0,0.1)                                                 │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ <DatabaseTable>                                              │   │
│ │                                                              │   │
│ │ [🔍 Search by record no, system...          ]  sort controls│   │
│ │                                                              │   │
│ │ ┌──────────┬────────┬───────────────┬──────────┬───┬───────┐│   │
│ │ │Record No↕│Date   ↕│Submitted By  ↕│ System  ↕│SAP│Status↕││   │
│ │ │ 160px    │ 110px  │ auto          │ auto     │70px│ auto  ││   │
│ │ ├──────────┼────────┼───────────────┼──────────┼───┼───────┤│   │
│ │ │PRF-001   │01 Jan  │John Doe       │[SAP badge]│[Y]│[badge]││  │
│ │ │font-mono │dd MMM  │               │bg-indigo  │ambar│     ││   │
│ │ │font-med  │yyyy    │               │text-indigo│   │       ││   │
│ │ │#003366   │        │               │           │   │       ││   │
│ │ │cursor-ptr│        │               │           │   │       ││   │
│ │ ├──────────┼────────┼───────────────┼──────────┼───┼───────┤│   │
│ │ │ ...      │        │               │           │   │       ││   │
│ │ └──────────┴────────┴───────────────┴──────────┴───┴───────┘│   │
│ │                                                              │   │
│ │ Row click → sets selectedRecord → opens <DetailModal>        │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                    │
│ <DetailModal isOpen={!!selectedRecord} onClose={() => setSelected} │
│   title={selectedRecord?.recordNo}                                 │
│   subtitle={selectedRecord?.requestType}                           │
│   status={selectedRecord?.status}                                  │
│   fieldGroups={fieldGroups}                                        │
│ />                                                                 │
└────────────────────────────────────────────────────────────────────┘
```

### 4B. Column Definitions

| Column key | Header | Width | Render |
|---|---|---|---|
| `recordNo` | Record No | 160px | `<span className="font-mono font-medium" style={{ color: '#003366' }}>` |
| `dateSubmitted` | Date | 110px | `format(value, 'dd MMM yyyy')` or `'-'` |
| `submittedBy` | Submitted By | auto | plain text |
| `requestType` | System | auto | `<span className="px-2 py-1 rounded text-xs font-medium bg-[#E0E7FF] text-[#3730A3]">` |
| `involvesSAP` | SAP | 70px | Yes → `bg-amber-100 text-amber-800` / No → `bg-gray-100 text-gray-600` |
| `status` | Status | auto | `<StatusBadge status={value} />` |

### 4C. Detail Modal — Field Groups

```
Group 1: "Request Information"
  Record Number  | Date Submitted (type:'date')
  Submitted By   | Status (type:'badge')

Group 2: "Program Details"
  System (badge)     | Involves SAP
  SAP Client         | SAP Module
  Company            | Department
  Priority           | Deadline
  Phone Ext          | CC Emails (fullWidth)
  Objective          (fullWidth)
  Justification      (fullWidth)
  Current Process    (fullWidth)
  Expected Outcome   (fullWidth)
```

### 4D. Interaction Logic

| Interaction | Trigger | Behaviour |
|---|---|---|
| Back button | Click `<ArrowLeft>` | `<Link to="/it">` (navigates to module hub) |
| "New Request" | Click | `<Link to="/it/forms/prf/new">` |
| Table row click | `onRowClick` | Sets `selectedRecord` state — opens `<DetailModal>` |
| Modal close | `onClose` | Sets `selectedRecord(null)` — closes modal |
| "Open Full Detail" in modal | Link/button | `navigate('/it/forms/prf/{id}')` |
| Column header click | Sortable click | Sorts data by that column (toggle asc/desc) |
| Search input | `onChange` | Filters rows client-side by matching text across visible columns |

---

## 5. Screen: Detail View

**Route:** `/it/forms/prf/:id`  
**File:** `src/pages/it/forms/prf/detail.tsx`

---

### 5A. Wireframe — Desktop

```
┌────────────────────────────────────────────────────────────────────┐
│ main.mx-auto.max-w-6xl.gap-5.p-5  (grid layout, gap-5)            │
│                                                                    │
│ ── PAGE HEADER ────────────────────────────────────────────────── │
│  flex flex-wrap items-center justify-between gap-3                 │
│  rounded-lg bg-slate-950 px-4 py-3 text-white shadow-sm           │
│                                                                    │
│  [← Back ghost white hover:bg-white/10]                           │
│                                                                    │
│  CENTER (min-w-0 flex-1 text-center):                              │
│    text-xs uppercase tracking-wide text-slate-400                  │
│    "PRF — Program Request Form — PRF-001"                          │
│    text-xl font-semibold truncate — {record.title}                 │
│    [SAP Track badge: bg-amber-500/20 px-2 py-0.5 text-[10px]     │
│     text-amber-300 rounded-full]  (only if isSAP)                 │
│                                                                    │
│  RIGHT: <StatusBadge ca={caState} />                               │
│    rounded-full border px-3 py-1.5 text-sm font-semibold          │
│    colour per CA state (see §1)                                    │
│                                                                    │
│ ── ACTION BAR ─────────────────────────────────────────────────── │
│  flex flex-wrap items-center gap-3                                 │
│  rounded-lg border border-slate-200 bg-white p-4 shadow-sm        │
│                                                                    │
│  [Role-conditional inputs + buttons — see §5C]                     │
│                                                                    │
│ ── SECTION CARDS (stacked, gap-5) ─────────────────────────────── │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ section.relative.overflow-hidden.rounded-lg.border            │  │
│  │ .border-slate-200.bg-white.shadow-sm                          │  │
│  │                                                              │  │
│  │ HEADER: flex items-center justify-between                    │  │
│  │         border-b {accent} bg-slate-50 px-4 py-3             │  │
│  │         accents e.g.: border-b-slate-200, border-b-amber-200 │  │
│  │                                                              │  │
│  │  LEFT: flex items-center gap-3                               │  │
│  │   [Icon h-5 w-5 text-slate-600]                              │  │
│  │   <h2 text-base font-semibold text-slate-900>Section Title   │  │
│  │                                                              │  │
│  │  RIGHT: <span rounded-full bg-slate-100 px-3 py-1           │  │
│  │               text-xs font-semibold text-slate-600>          │  │
│  │         "Requestor" / "Dept Head" / "IT Mgr 2" etc.          │  │
│  │                                                              │  │
│  │ CONTENT: grid gap-4 p-5 md:grid-cols-2                       │  │
│  │  <ReadonlyField label="Request No" value="PRF-001" />        │  │
│  │  <ReadonlyField label="System" value="SAP S4/HANA" />        │  │
│  │  <div className="md:col-span-2">                             │  │
│  │    <ReadonlyField label="Objective" value="..." />           │  │
│  │  </div>                                                      │  │
│  │                                                              │  │
│  │ LOCK OVERLAY (when locked=true):                             │  │
│  │  absolute inset-x-0 bottom-0 top-14 z-10                    │  │
│  │  flex items-center justify-center rounded-b-lg              │  │
│  │  bg-slate-100/80 px-4                                        │  │
│  │   ┌──────────────────────────────────────────┐              │  │
│  │   │ [🔒] Section opens when Submitted         │              │  │
│  │   │ rounded-md border border-slate-300 bg-white│              │  │
│  │   │ px-4 py-2 text-sm font-medium text-slate-600│            │  │
│  │   │ shadow-sm                                 │              │  │
│  │   └──────────────────────────────────────────┘              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  [All section cards stacked in order — see §5D]                    │
│                                                                    │
│ ── WORKFLOW SUMMARY CARD ──────────────────────────────────────── │
│  Card border-slate-200                                             │
│  CardHeader pb-3: [FileText] "Workflow Summary"                    │
│  CardContent:                                                      │
│   grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm               │
│   ┌──────────────────┬────────────────┬────────────────┐           │
│   │ Current Stage    │ Track          │ Date Sent      │           │
│   │ font-mono        │ SAP / Non-SAP  │ fmt(date)      │           │
│   ├──────────────────┼────────────────┼────────────────┤           │
│   │ Date App 1       │ Date App 2     │ Date App 2.1   │           │
│   │ (if exists)      │ (if exists)    │ SAP only       │           │
│   ├──────────────────┼────────────────┼────────────────┤           │
│   │ Date App 3       │ Date ISG       │ Date App 4     │           │
│   └──────────────────┴────────────────┴────────────────┘           │
│   FINAL STATUS block (when applicable):                            │
│    mt-4 rounded-md bg-slate-100 px-4 py-3                         │
│    "Final Status" label + bold value text-slate-800                │
│                                                                    │
│ ── ADMIN PANEL (canEditAdmin only) ────────────────────────────── │
│  Card border-dashed border-slate-300 bg-slate-50                   │
│  CardHeader: [Settings] "Admin Panel" + description                │
│  CardContent:                                                      │
│   grid gap-4 sm:grid-cols-2 lg:grid-cols-3                        │
│   Each field: label (text-xs text-slate-500) +                    │
│              value box (rounded-md bg-white px-3 py-2 font-mono   │
│              text-sm border)                                       │
│   Fields: CA State / Status Key / SAP Track / Ext_Access ID /     │
│           Workflow Stage / System                                   │
│                                                                    │
│   Reset Agents section (mt-6):                                     │
│   "RESET AGENTS" label + flex flex-wrap gap-2                      │
│   Buttons: size=sm variant=outline                                  │
│     border-amber-300 text-amber-700 text-xs                        │
│     [🗑] Clear Task Assignment                                      │
│     [🗑] Clear Functional                                           │
│     [🗑] Clear Acceptance                                           │
│     [🗑] Clear IT SAP Completion                                    │
│     [🗑] Clear ABAP Assign                                          │
└────────────────────────────────────────────────────────────────────┘
```

### 5B. ReadonlyField Component

```tsx
function ReadonlyField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900">
        {value ?? <span className="text-slate-400">—</span>}
      </div>
    </div>
  );
}
```

### 5C. Action Bar — Button Matrix per Role + CA State

> Each row = one button/group. Inputs appear inline in the action bar to the left of their button.

| Button Label | Role condition | CA condition | Input(s) required | Button className |
|---|---|---|---|---|
| **Send for Approval** | `access.isRequestor` | `Request` AND `!record.submitteddate` | `deptEmail` (Input, flex-1 min-w-48) | `bg-amber-700 text-white hover:bg-amber-800` |
| **Approved by Dept Head** | `access.isDeptHead` | `Submitted` | `comment` (optional) | `bg-emerald-700 text-white hover:bg-emerald-800` |
| **Rejected by Dept Head** | `access.isDeptHead` | `Submitted` | `comment` (required) | `border-red-300 text-red-700 hover:bg-red-50` outline |
| **KIV by Dept Head** | `access.isDeptHead` | `Submitted` | `comment` (required) | `border-amber-300 text-amber-700 hover:bg-amber-50` outline |
| **Tasks Assignment** | `access.isITMgr2` | `Acceptance1` | `isgEmail` (required), `acceptStatus` Select, `ccIsg` (if isSAP) | `bg-blue-700 text-white hover:bg-blue-800` |
| **Submit Functional Spec** | `access.isITStaff && isSAP` | `Acceptance` | none | `bg-purple-700 text-white hover:bg-purple-800` |
| **Tasks Assignment II** | `access.isITMgr` | `Submitted_SAP` | `abapEmail` (required), `funcOwner`, `acceptStatusSAP` Select | `bg-purple-700 text-white hover:bg-purple-800` |
| **Notify Requestor/Functional** | any editor role | `Acceptance2` OR `Acceptance3` | `task` Select (required), `comment` | `bg-blue-700 text-white hover:bg-blue-800` |
| **Notify Requestor (SAP)** | `access.isITStaffFinal` | `Completed-SAP` | `statusISG` Select, `comment2` | `bg-emerald-700 text-white hover:bg-emerald-800` |
| **Accepted by Requestor** | `access.isRequestorFinal` | `Closed` | rating slider (1–10), `comment` (required if rating<8) | `bg-emerald-700 text-white hover:bg-emerald-800` |
| **To be revised** | `access.isRequestorFinal` | `Closed` | `comment` (required) | `border-amber-300 text-amber-700 hover:bg-amber-50` outline |
| **KIV by Requestor** | `access.isRequestorFinal` | `Closed` | `comment` (required) | `border-slate-300 text-slate-600 hover:bg-slate-50` outline |

**Input widths in ActionBar:**
- Email inputs: `flex-1 min-w-48`
- Status Selects: `w-40`
- Rating slider: `w-48`
- Comment inputs: `flex-1 min-w-48`

### 5D. Section Card Order & Visibility

| # | Section Title | Icon | Role Badge | `accent` | `hidden` when | `locked` when |
|---|---|---|---|---|---|---|
| 1 | Requestor's Details | `UserIcon` | Requestor | `border-b-slate-200` | never | never |
| 2 | Dept Head Approval | `Shield` | Dept Head | `border-b-amber-200` | never | `caState !== 'Submitted' \|\| !access.isDeptHead` |
| 3 | Tasks Assignment (by IT) | `Wrench` | IT Mgr 2 | `border-b-blue-200` | never | `caState !== 'Acceptance1' \|\| !access.isITMgr2` |
| 3B | Functional Procedure (SAP) | `FileCode` | IT Staff | `border-b-purple-200` | `!isSAP` | `!isEditor4` |
| — | IT Support Use | `MessageSquare` | IT Staff | `border-b-slate-200` | never | never |
| 4 | Assignment to IT/ABAP (SAP) | `Settings` | IT Mgr | `border-b-purple-200` | `!isSAP` | `caState !== 'Submitted_SAP' \|\| !access.isITMgr` |
| 5 | IT Completion / Testing | `ClipboardList` | IT Dev | `border-b-blue-200` | never | `!isEditor6` |
| — | IED/IEQ Testing (SAP) | `Monitor` | IT Staff | `border-b-purple-200` | `!isSAP` | never |
| 6 | ISG Completion for SAP | `Server` | IT Staff Final | `border-b-emerald-200` | `!isSAP` | `!isEditor7` |
| 7 | Acceptance Upon Completion | `ThumbsUp` | Requestor | `border-b-green-200` | never | `!isEditor1_1` |
| — | Notes for IT | `BookOpen` | IT Internal | `border-b-slate-200` | `!canEditAdmin` | never |
| — | Testing/Validation by Requestor | `Users` | Requestor | `border-b-slate-200` | `!isSAPHana && extRecord?.pRFRFC !== 'Yes'` | never |
| — | Workflow Summary | `FileText` | — | — | never | never (Card, not SectionCard) |
| — | Admin Panel | `Settings` | — | — | `!canEditAdmin` | never (Card, not SectionCard) |

### 5E. Interaction Logic — Detail Screen

| Action | Validation | API calls | Next state / navigation |
|---|---|---|---|
| **Send for Approval** | `deptEmail` must not be empty | `PATCH MainDBIT`: `currentStatus='CurrentstatusKey38'`, `workflowstage=3`, `remarks.prfCA='Submitted'` | `toast.success('Sent for approval')`, CA → `Submitted` |
| **Approved by Dept Head** | none (comment optional) | `PATCH ExtAccess`: `pRFStatus1='Accepted'`, `pRFDateApp1=now`, `pRFDeptHead=email`, `pRFComments1=comment`; `PATCH MainDBIT`: CA → `Acceptance1` | `toast.success('Approved — forwarded to IT')` |
| **Rejected by Dept Head** | `comment` required | `PATCH ExtAccess`: `pRFStatus1='Rejected'`, `pRFComments1=comment`; `PATCH MainDBIT`: CA → `Rejected` | `toast.success('Rejected')` |
| **KIV by Dept Head** | `comment` required | `PATCH MainDBIT`: `remarks.finalStatus='KIV'` | `toast.success('KIV note recorded')` — CA unchanged |
| **Tasks Assignment** | `isgEmail` required | `PATCH ExtAccess`: `pRFISG=isgEmail`, `pRFAppByISG=user`, `pRFDateApp2=now`, `pRFStatus2=acceptStatus`; `PATCH MainDBIT`: CA → `Acceptance` (SAP) or `Acceptance2` (non-SAP) | `toast.success(isSAP ? 'SAP track — pending functional spec' : 'Non-SAP — IT notified')` |
| **Submit Functional Spec** | none | `PATCH ExtAccess`: `pRFAttachedBy=user`, `pRFDateSent=now`; `PATCH MainDBIT`: CA → `Submitted_SAP` | `toast.success('Functional spec submitted')` |
| **Tasks Assignment II** | `abapEmail` required | `PATCH ExtAccess`: `pRFABAP=abapEmail`, `pRFFuncOwnerSAP=funcOwner`, `pRFAppBySAP=user`, `pRFDateApp2_1=now`, `pRFAcceptStatusSAP=acceptStatusSAP`; `PATCH MainDBIT`: CA → `Acceptance3` | `toast.success('ABAP assigned')` |
| **Notify Requestor/Functional** | `task` Select required | `PATCH ExtAccess`: `pRFStatus3=task`, `pRFByISStaff=user`, `pRFDateApp3=now`, `pRFITReason=comment`; `PATCH MainDBIT`: CA → `Completed-SAP` (SAP) or `Closed` (non-SAP) | SAP: `toast('SAP completed — pending ISG final')` / Non-SAP: `toast('Completed — pending requestor acceptance')` |
| **Notify Requestor (SAP)** | none | `PATCH ExtAccess`: `pRFStatusISG=statusISG`, `pRFCommentsISG=comment2`, `pRFDateISG=now`, `pRFNotifiedBy=user`; `PATCH MainDBIT`: CA → `Closed` | `toast.success('SAP final — closed pending acceptance')` |
| **Accepted by Requestor** | rating ≥ 1; if rating < 8 → comment must be ≥ 25 chars | `PATCH ExtAccess`: `pRFStatus4='Accepted'`, `pRFRating=rating`, `pRFDateApp4=now`, `pRFComment1=comment` | `toast.success('Accepted — case closed')` |
| **To be revised** | `comment` required | re-opens form (CA revert logic TBD) | `toast.success('Marked for revision')` |
| **KIV by Requestor** | `comment` required | `PATCH MainDBIT remarks.finalStatus='KIV'` | `toast.success('KIV noted')` |
| **Admin Reset: Clear Task Assignment** | — | `PATCH ExtAccess`: `pRFAppByISG=''`, `pRFDateApp2=''`; `PATCH MainDBIT`: CA → `Acceptance1`, `workflowstage=3` | `toast.success('Admin reset applied')`, invalidate queries |
| **Admin Reset: Clear Functional** | — | `PATCH ExtAccess`: `pRFAttachedBy=''`, `pRFDateSent=''` | same |
| **Admin Reset: Clear Acceptance** | — | `PATCH ExtAccess`: `pRFDateApp4=''`, `pRFStatus4=''`, `pRFRating=0` | same |
| **Admin Reset: Clear IT SAP Completion** | — | `PATCH ExtAccess`: `pRFStatusISG=''`, `pRFCommentsISG=''`, `pRFDateISG=''`, `pRFNotifiedBy=''` | same |
| **Admin Reset: Clear ABAP Assign** | — | `PATCH ExtAccess`: `pRFAcceptStatusSAP=''`, `pRFABAP=''`, `pRFFuncOwnerSAP=''`, `pRFAppBySAP=''`, `pRFDateApp2_1=''` | same |

---

## 6. Screen: New Form

**Route:** `/it/forms/prf/new`  
**File:** `src/pages/it/forms/prf/new.tsx`

---

### 6A. Wireframe — Desktop

```
┌────────────────────────────────────────────────────────────────────┐
│ <FormSubmissionLayout>                                             │
│                                                                    │
│ LAYOUT HEADER:                                                     │
│  [← /it/forms/prf]  PRF — Program Request Form                    │
│  Step indicator (if multi-step):                                   │
│    ①──②──③──④   "Step 1 of 4: System Selection"                 │
│                                                                    │
│ SCROLLABLE BODY:  space-y-6  (motion.div containerVariants)       │
│                                                                    │
│ ── CARD 1: SYSTEM SELECTION ──────────────────────────────────── │
│  CardHeader bg-primary/5                                           │
│   [Server h-5 w-5 text-primary] System Selection                  │
│   CardDescription: "Select the system for your program request"   │
│  CardContent pt-6 space-y-4                                        │
│                                                                    │
│   grid grid-cols-1 md:grid-cols-2 gap-4                           │
│   ┌─────────────────────────────┐  ┌──────────────────────────┐   │
│   │ Label: System *             │  │ (right col empty unless   │   │
│   │ <Select>                    │  │  SAP selected)            │   │
│   │   ── SAP Systems ──         │  │                          │   │
│   │   SAP ECC                   │  │  <Badge bg-primary/10    │   │
│   │   SAP BW                    │  │    text-primary>          │   │
│   │   SAP S/4HANA               │  │    ✓ SAP System Selected  │   │
│   │   SAP PI/PO                 │  │  </Badge>                │   │
│   │   SAP Fiori                 │  │                          │   │
│   │   ── Other Systems ──       │  └──────────────────────────┘   │
│   │   SharePoint                │                                  │
│   │   Power Apps · Power BI     │                                  │
│   │   SQL Server · Excel/VBA    │                                  │
│   │   Web App · Mobile App      │                                  │
│   │   Lotus Notes · Other       │                                  │
│   └─────────────────────────────┘                                  │
│                                                                    │
│   SAP CONDITIONAL REVEAL (motion.div → animate max-height):       │
│   ┌────────────────────────────────────────────────────────────┐   │
│   │ bg-primary/5 rounded-lg border border-primary/20 p-4      │   │
│   │ grid grid-cols-1 md:grid-cols-2 gap-4                     │   │
│   │                                                            │   │
│   │  SAP Client *               SAP Module                    │   │
│   │  <Select>                   <Select>                      │   │
│   │   IEP (Production)           FI · CO · MM · SD            │   │
│   │   IEQ (Quality)              PP · QM · PM · HR            │   │
│   │   IED (Development)          WM · ABAP · BASIS · Other    │   │
│   └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│ ── CARD 2: REQUESTOR INFORMATION ────────────────────────────── │
│  CardHeader (no bg tint)                                           │
│   [Info h-5 w-5 muted] Requestor Information                      │
│  CardContent space-y-4                                             │
│                                                                    │
│   ROW 1: grid grid-cols-1 md:grid-cols-2 gap-4                   │
│   ┌────────────────────────┐  ┌──────────────────────────────┐    │
│   │ Company *              │  │ Department *                 │    │
│   │ <Select> (from SP list)│  │ <Select> (from SP list)      │    │
│   └────────────────────────┘  └──────────────────────────────┘    │
│                                                                    │
│   ROW 2: grid grid-cols-1 md:grid-cols-3 gap-4                   │
│   ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│   │ Requestor    │  │ Email            │  │ Phone Extension  │   │
│   │ [disabled    │  │ [disabled        │  │ <Input>          │   │
│   │  bg-muted]   │  │  bg-muted]       │  │ e.g. 1234        │   │
│   │ auto-filled  │  │ auto-filled      │  │                  │   │
│   └──────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                    │
│   PRIORITY TILES: grid grid-cols-2 md:grid-cols-4 gap-2           │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│   │ ○ Low        │ │ ● Medium     │ │ ○ High       │ │ ○ Crit. │ │
│   │ border-border│ │ border-prim. │ │ border-border│ │ border  │ │
│   │ hover:border │ │ bg-primary/5 │ │ hover:border │ │ hover   │ │
│   │ -primary     │ │              │ │ -primary     │ │         │ │
│   │ Non-urgent,  │ │ Standard     │ │ Urgent,      │ │ Business│ │
│   │ can wait     │ │ priority     │ │ affects ops  │ │ critical│ │
│   └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│   Selected tile radio dot:                                        │
│     w-5 h-5 rounded border-2 border-primary bg-primary           │
│     inner: w-2 h-2 rounded-full bg-white                         │
│   Unselected: border-2 border-border (no fill)                   │
│                                                                    │
│ ── CARD 3: OBJECTIVE & JUSTIFICATION ─────────────────────────── │
│  CardHeader bg-primary/5                                           │
│   [Target h-5 w-5 text-primary] Objective & Justification         │
│   "Clearly describe what you need and why"                         │
│  CardContent pt-6 space-y-4                                        │
│                                                                    │
│  Objective *     <Textarea rows=3>                                 │
│  Justification * <Textarea rows=3>                                 │
│  Current Process <Textarea rows=2>                                 │
│  Expected Outcome<Textarea rows=2>                                 │
│                                                                    │
│ ── CARD 4: ADDITIONAL DETAILS ────────────────────────────────── │
│  CardHeader: [FileText muted] Additional Details                   │
│  CardContent space-y-4                                             │
│                                                                    │
│  grid grid-cols-1 md:grid-cols-2 gap-4                            │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐   │
│  │ Expected Deadline    │  │ CC (Email addresses)             │   │
│  │ <Input type="date">  │  │ <Input placeholder="a,b,c">      │   │
│  └──────────────────────┘  └──────────────────────────────────┘   │
│                                                                    │
│  ATTACHMENT DROP ZONE:                                             │
│  border-2 border-dashed rounded-lg p-6 text-center                │
│  hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer│
│  role="button" tabIndex=0                                          │
│  "Click to upload or drag and drop"  text-sm muted                │
│  "Max file size: 10MB"               text-sm muted mt-1           │
│  {files selected → text-sm text-primary mt-2 font-medium}         │
│  Hidden <input type="file" multiple> triggered on zone click       │
│                                                                    │
│ ── STICKY FOOTER ──────────────────────────────────────────────── │
│  border-t bg-background (part of FormSubmissionLayout)             │
│  px-4 py-4 flex justify-between items-center                       │
│  [Save Draft]                    [Submit Request →]                │
│  variant=outline                 variant=default (primary)         │
│  disabled while isSubmitting     disabled while isSubmitting       │
└────────────────────────────────────────────────────────────────────┘
```

### 6B. Component Tree (New Form)

```tsx
<FormSubmissionLayout
  formConfig={{ code: 'PRF', name: 'Program Request Form',
                basePath: '/it/forms/prf',
                initialStatus: 'CurrentstatusKey27', initialStage: 1 }}
  steps={[{ id: '0', name: 'Request', description: 'Submit your program request' }]}
  currentStep={0}
  isSubmitting={createMutation.isPending || createExtAccessMutation.isPending}
  onSubmit={() => handleSubmit(false)}
  onSaveDraft={() => handleSubmit(true)}
>
  <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">

    {/* CARD 1 — System Selection */}
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="bg-primary/5">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <CardTitle>System Selection</CardTitle>
          </div>
          <CardDescription>Select the system for your program request</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* System Select with grouped options */}
            {/* SAP Badge shown when isSAP=true */}
          </div>
          {formData.isSAP && (
            <motion.div initial={{ opacity: 0, maxHeight: 0 }}
                        animate={{ opacity: 1, maxHeight: 400 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4
                                   bg-primary/5 rounded-lg border border-primary/20">
              {/* SAP Client Select + SAP Module Select */}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>

    {/* CARD 2 — Requestor Information */}
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Requestor Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Company + Department row */}
          {/* Name (disabled) + Email (disabled) + Phone Ext row */}

          {/* Priority tiles */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PRIORITY_OPTIONS.map(option => (
                <div key={option.value}
                     onClick={() => setFormData({ ...formData, priority: option.value })}
                     className={cn(
                       'p-3 rounded-lg border cursor-pointer transition-all',
                       formData.priority === option.value
                         ? 'border-primary bg-primary/5'
                         : 'border-border hover:border-primary'
                     )}>
                  <div className="flex items-center gap-2 pointer-events-none">
                    <div className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0',
                      formData.priority === option.value
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    )}>
                      {formData.priority === option.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    {/* CARD 3 — Objective & Justification */}
    {/* CARD 4 — Additional Details + Drop Zone */}
  </motion.div>
</FormSubmissionLayout>
```

### 6C. Interaction Logic — New Form

| Interaction | Trigger | Behaviour |
|---|---|---|
| System Select change | `onValueChange` | Updates `formData.system`; if SAP system chosen: sets `formData.isSAP=true`; if switching away from SAP: clears `sapClient`, `sapModule`, sets `isSAP=false` |
| SAP fields reveal | `formData.isSAP` becomes true | `motion.div` animates `maxHeight: 0 → 400`, `opacity: 0 → 1`. Fields required if `isSAP` at submit time. |
| Company/Dept loading | `useSharePointCompanies()` / `useSharePointDepartments()` pending | Renders `<div className="h-10 bg-muted rounded-md animate-pulse" />` in place of Select |
| Priority tile click | `onClick` on tile div | Sets `formData.priority = option.value`; selected tile: `border-primary bg-primary/5`; radio dot: filled |
| Attachment zone click | `onClick` on drop zone div | `document.getElementById('prf-attachments')?.click()` |
| File input change | `onChange` | Reads `files`, updates `formData.attachments` with comma-joined filenames, shows `toast.success('{n} file(s) selected')` |
| "Save Draft" | Click | Calls `handleSubmit(true)` — skips all validation, `currentStatus='CurrentstatusKey3'`, creates both parent + child records, navigates to `/it/my-submissions` |
| "Submit Request" | Click | Calls `handleSubmit(false)` — validates required fields (system, company, department, objective, justification; sapClient if SAP), generates `PRF-{ts}-{rand}` request number, creates parent → creates child (rollback: delete parent if child fails), navigates to `/it/my-submissions` |
| Validation fail | `handleSubmit(false)` | `toast.error('Please fill in all required fields')` or specific message — no navigation |
| User data load | `useUser()` resolves | `useEffect` populates `requestorName` and `requestorEmail` fields (only if not already filled) |

---

## 7. PRF Workflow State Machine

### 7A. CA State Transitions

```
Non-SAP Track:
  Request ──[Send for Approval]──► Submitted
  Submitted ──[Approved by Dept Head]──► Acceptance1
  Submitted ──[Rejected by Dept Head]──► Rejected (terminal)
  Acceptance1 ──[Tasks Assignment, non-SAP]──► Acceptance2
  Acceptance2 ──[Notify Requestor/Functional]──► Closed
  Closed ──[Accepted by Requestor]──► (final: Status4='Accepted')
  Closed ──[To be revised]──► (re-open, CA reverts)
  Closed ──[KIV by Requestor]──► (CA unchanged, finalStatus='KIV')

SAP Track:
  Request ──[Send for Approval]──► Submitted
  Submitted ──[Approved by Dept Head]──► Acceptance1
  Acceptance1 ──[Tasks Assignment, SAP]──► Acceptance
  Acceptance ──[Submit Functional Spec]──► Submitted_SAP
  Submitted_SAP ──[Tasks Assignment II]──► Acceptance3
  Acceptance3 ──[Notify Requestor/Functional SAP]──► Completed-SAP
  Completed-SAP ──[Notify Requestor (SAP)]──► Closed
  Closed ──[Accepted by Requestor]──► (final: Status4='Accepted')
```

### 7B. Status Key Mapping

| CA State (readable) | `currentStatus` value | `workflowstage` |
|---|---|---|
| Request | `CurrentstatusKey27` | 1 |
| Submitted | `CurrentstatusKey38` | 2 |
| Acceptance1 | `CurrentstatusKey38` (via remarks.prfCA) | 3 |
| Acceptance | `CurrentstatusKey38` | 4 |
| Submitted_SAP | `CurrentstatusKey38` | 5 |
| Acceptance3 | `CurrentstatusKey38` | 6 |
| Completed-SAP | `CurrentstatusKey38` | 7 |
| Closed | `CurrentstatusKey7` | 8 |
| Rejected | `CurrentstatusKey4` | — |

*Note: `prfCA` is stored inside `record.remarks` as JSON: `{ prfCA: 'Acceptance1', ... }`*

### 7C. Role Resolution (from `usePRFWorkflow`)

| Flag | Resolved as true when |
|---|---|
| `access.isRequestor` | `user.email === record.requestoremail` |
| `access.isDeptHead` | `user.email === extRecord.pRFDeptHead` OR `user.email === record.pRFDeptManagerEmail` |
| `access.isITMgr2` | User has ITMgr2 role AND assigned to this record's site |
| `access.isITStaff` | `user.email === extRecord.pRFISG` |
| `access.isITMgr` | User has ITMgr role |
| `access.isITStaffFinal` | User has ITStaffFinal role |
| `access.isRequestorFinal` | `user.email === record.requestoremail` (same as isRequestor) |
| `canEditAdmin` | User has ISADMIN role |

---

## 8. Shared Component Reference

### `<StatusBadge ca={PRFCurrentAction}>`
```tsx
// className: rounded-full border px-3 py-1.5 text-sm font-semibold
const colors: Record<string, string> = {
  Request:       'bg-slate-100 text-slate-700 border-slate-300',
  Submitted:     'bg-amber-50  text-amber-800  border-amber-300',
  Acceptance1:   'bg-blue-50   text-blue-800   border-blue-300',
  Acceptance:    'bg-purple-50 text-purple-800 border-purple-300',
  Acceptance2:   'bg-blue-50   text-blue-800   border-blue-300',
  Submitted_SAP: 'bg-purple-50 text-purple-800 border-purple-300',
  Acceptance3:   'bg-purple-50 text-purple-800 border-purple-300',
  'Completed-SAP':'bg-emerald-50 text-emerald-800 border-emerald-300',
  Closed:        'bg-green-50  text-green-800  border-green-300',
  Rejected:      'bg-red-50    text-red-800    border-red-300',
};
// label comes from PRF_WORKFLOW_CONFIG[ca].label
```

### `<SectionCard>` Full Prop Interface
```tsx
interface SectionCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  role: string;            // shown in badge top-right
  accent: string;          // e.g. 'border-b-amber-200' — header bottom border
  children: React.ReactNode;
  locked?: boolean;        // shows frosted overlay
  lockMessage?: string;    // text in lock pill (default: 'Section locked')
  hidden?: boolean;        // returns null — component not rendered
}
```

### Loading States
```tsx
// Full page
<main className="flex min-h-screen items-center justify-center">
  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
  <span className="ml-3 text-sm text-slate-500">Loading PRF record...</span>
</main>

// Not found
<main className="mx-auto max-w-4xl p-10 text-center">
  <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
  <p className="mt-4 text-lg font-semibold text-slate-600">PRF record not found</p>
  <Button variant="outline" className="mt-4" onClick={() => navigate('/it/forms/prf')}>Back</Button>
</main>

// Table loading
<div className="flex items-center justify-center py-20">
  <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#003366' }} />
</div>

// Card skeleton (same grid slot as loaded content)
<Skeleton className="h-4 w-24 mb-3" />
<Skeleton className="h-10 w-20 mb-2" />
<Skeleton className="h-3 w-32" />
```

### Toast Patterns
```tsx
toast.success('...')   // green — successful action
toast.error('...')     // red — API failure or hard validation fail
toast.warning('...')   // amber — soft validation (empty required field)
```

### `<DatabaseTable>` Props Used
```tsx
<DatabaseTable
  data={prfData}                          // typed array
  columns={columns}                       // ColumnDef[] with key, header, sortable, width, render
  onRowClick={(row) => setSelectedRecord(row)}
  searchPlaceholder="Search by record no, system..."
/>
```

### `<DetailModal>` Props Used
```tsx
<DetailModal
  isOpen={!!selectedRecord}
  onClose={() => setSelectedRecord(null)}
  title={selectedRecord?.recordNo || ''}
  subtitle={selectedRecord?.requestType || 'Program Request'}
  status={selectedRecord?.status}
  fieldGroups={fieldGroups}  // FieldGroup[] = { title, fields: { label, value, type?, fullWidth? }[] }[]
/>
```
