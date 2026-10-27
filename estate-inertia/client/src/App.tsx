import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Command,
  FileText,
  Filter,
  LayoutDashboard,
  Map,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type PropertyStatus = 'Available' | 'Reserved' | 'Sold';

type Property = {
  id: string;
  name: string;
  project: string;
  location: string;
  type: string;
  area: string;
  price: string;
  status: PropertyStatus;
  updated: string;
};

const initialProperties: Property[] = [
  {
    id: 'EI-1001',
    name: 'Plot 018 · North Avenue',
    project: 'Greenfield Enclave',
    location: 'Porur, Chennai',
    type: 'Residential plot',
    area: '1,200 sq.ft',
    price: '₹48.0L',
    status: 'Available',
    updated: '12 min ago',
  },
  {
    id: 'EI-1002',
    name: 'Flat 3B · Cedar Block',
    project: 'The Cedar Residences',
    location: 'Maduravoyal, Chennai',
    type: 'Apartment',
    area: '1,040 sq.ft',
    price: '₹82.5L',
    status: 'Reserved',
    updated: '1 hr ago',
  },
  {
    id: 'EI-1003',
    name: 'Plot 042 · Garden Row',
    project: 'Greenfield Enclave',
    location: 'Porur, Chennai',
    type: 'Residential plot',
    area: '1,500 sq.ft',
    price: '₹60.0L',
    status: 'Available',
    updated: 'Yesterday',
  },
  {
    id: 'EI-1004',
    name: 'Villa 07 · Lake View',
    project: 'Lakeview Villas',
    location: 'Poonamallee, Chennai',
    type: 'Villa',
    area: '2,100 sq.ft',
    price: '₹1.42Cr',
    status: 'Sold',
    updated: 'Yesterday',
  },
  {
    id: 'EI-1005',
    name: 'Plot 006 · East Park',
    project: 'Palm County',
    location: 'Tambaram, Chennai',
    type: 'Residential plot',
    area: '900 sq.ft',
    price: '₹31.5L',
    status: 'Available',
    updated: '2 days ago',
  },
];

const navigation = [
  {
    group: 'WORKSPACE',
    items: [
      { label: 'Overview', icon: LayoutDashboard },
      { label: 'Properties', icon: Building2 },
      { label: 'Projects', icon: Map },
      { label: 'Leads', icon: Users },
      { label: 'Follow-ups', icon: CalendarDays },
    ],
  },
  {
    group: 'MANAGE',
    items: [
      { label: 'Documents', icon: FileText },
      { label: 'Analytics', icon: Activity },
      { label: 'AI Assistant', icon: Sparkles },
    ],
  },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#173e35] text-white">
        <Command size={20} />
        <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-[#b9d7c7]" />
      </div>
      <div>
        <div className="text-[15px] font-semibold tracking-tight text-[#172337]">
          Estate Inertia
        </div>
        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
          Property workspace
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: PropertyStatus }) {
  const styles: Record<PropertyStatus, string> = {
    Available: 'bg-emerald-50 text-emerald-700',
    Reserved: 'bg-amber-50 text-amber-700',
    Sold: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'Available'
            ? 'bg-emerald-500'
            : status === 'Reserved'
              ? 'bg-amber-500'
              : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
}

function App() {
  const [active, setActive] = useState('Overview');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [mobileNav, setMobileNav] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [newName, setNewName] = useState('');
  const [newProject, setNewProject] = useState('');
  const [notice, setNotice] = useState('');

  const filteredProperties = useMemo(() => {
    const search = query.trim().toLowerCase();

    return properties.filter((property) => {
      const matchesSearch =
        !search ||
        [
          property.id,
          property.name,
          property.project,
          property.location,
          property.type,
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        status === 'All statuses' || property.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [properties, query, status]);

  const addProperty = () => {
    if (!newName.trim() || !newProject.trim()) {
      setNotice('Enter both the property name and project name.');
      return;
    }

    const property: Property = {
      id: `EI-${1001 + properties.length}`,
      name: newName.trim(),
      project: newProject.trim(),
      location: 'Location to be added',
      type: 'Residential plot',
      area: 'Not specified',
      price: 'Not specified',
      status: 'Available',
      updated: 'Just now',
    };

    setProperties((current) => [property, ...current]);
    setNewName('');
    setNewProject('');
    setShowAdd(false);
    setNotice(
      'Property added to the preview. Connect a backend to save it permanently.',
    );
  };

  const openModule = (module: string) => {
    setActive(module);
    setMobileNav(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#202b3c]">
      {mobileNav && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileNav(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[254px] flex-col border-r border-slate-200 bg-white px-5 pb-4 pt-6 transition-transform ${
          mobileNav ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between">
          <BrandMark />
          <button
            aria-label="Close menu"
            onClick={() => setMobileNav(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <button
          onClick={() => setNotice('Company settings will be available soon.')}
          className="mt-9 flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f7faf8] p-3 text-left"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dcebe4] text-[#173e35]">
            <Building2 size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold">Your company</div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Team workspace
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        <nav className="mt-8 flex-1 space-y-7">
          {navigation.map((group) => (
            <div key={group.group}>
              <div className="mb-2 px-3 text-[10px] font-bold tracking-[.16em] text-slate-400">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => openModule(label)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-left text-[13px] transition ${
                      active === label
                        ? 'bg-[#eaf2ed] font-semibold text-[#173e35]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={17} />
                    <span className="flex-1">{label}</span>
                    {label === 'Leads' && (
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] text-slate-500">
                        12
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="rounded-xl bg-[#f7f8fa] p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-emerald-700" />
            <span className="text-xs font-semibold">Property workspace</span>
          </div>
          <p className="mb-0 mt-1.5 text-[11px] leading-5 text-slate-500">
            Manage inventory, projects and customer relationships together.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7e9f4] text-xs font-bold text-[#49527b]">
            EI
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold">Workspace Admin</div>
            <div className="truncate text-[10px] text-slate-500">
              Company administrator
            </div>
          </div>
          <button
            aria-label="Settings"
            onClick={() => setNotice('Settings module is coming soon.')}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <Settings size={16} />
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[254px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setMobileNav(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={19} />
            </button>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <span className="font-medium text-slate-700">{active}</span>
            </div>
            <div className="text-sm font-semibold sm:hidden">{active}</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-[#fafbfc] px-3 py-2 md:flex">
              <Search size={15} className="text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your workspace..."
                className="w-40 bg-transparent text-xs outline-none placeholder:text-slate-400 lg:w-52"
              />
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
                Ctrl K
              </kbd>
            </div>

            <button
              aria-label="Notifications"
              onClick={() => setNotice('You are all caught up in this preview.')}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />
            <div className="hidden text-right sm:block">
              <div className="text-xs font-semibold">Estate Inertia</div>
              <div className="mt-0.5 text-[10px] text-slate-400">
                Chennai · Tamil Nadu
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173e35] text-[10px] font-semibold text-white">
              EI
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9 lg:px-9">
          {notice && (
            <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
              <span>{notice}</span>
              <button
                aria-label="Dismiss message"
                onClick={() => setNotice('')}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {active === 'Overview' ? (
            <>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.15em] text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    PROPERTY INVENTORY, IN ONE PLACE
                  </div>
                  <h1 className="text-[27px] font-semibold tracking-[-.045em] sm:text-[32px]">
                    Bring every property into clear view.
                  </h1>
                  <p className="mt-2 max-w-xl text-[13px] leading-6 text-slate-500">
                    Manage property inventory, projects, availability and
                    customer relationships from one workspace.
                  </p>
                </div>
                <button
                  onClick={() => setShowAdd(true)}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#173e35] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#245544]"
                >
                  <Plus size={15} /> Add property
                </button>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: 'Property records',
                    value: properties.length,
                    note: 'Records in this preview',
                    icon: Building2,
                    trend: 'Inventory',
                  },
                  {
                    label: 'Available units',
                    value: properties.filter((p) => p.status === 'Available')
                      .length,
                    note: 'Currently available',
                    icon: Check,
                    trend: 'Available',
                  },
                  {
                    label: 'Active leads',
                    value: 12,
                    note: 'Sample dashboard metric',
                    icon: Users,
                    trend: 'Sample data',
                  },
                  {
                    label: 'Follow-ups due',
                    value: 4,
                    note: 'Sample dashboard metric',
                    icon: CalendarDays,
                    trend: 'Today',
                  },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        {item.label}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5f2] text-[#477760]">
                        <item.icon size={16} />
                      </span>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <span className="text-[29px] font-semibold tracking-tight">
                        {String(item.value).padStart(2, '0')}
                      </span>
                      <span className="mb-1 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                        {index === 1 ? (
                          <Check size={12} />
                        ) : index === 3 ? (
                          <CalendarDays size={12} />
                        ) : index === 2 ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        {item.trend}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {item.note}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-sm font-semibold tracking-tight">
                        Property register
                      </h2>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Property records and availability
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 md:hidden">
                        <Search size={14} className="text-slate-400" />
                        <input
                          type="search"
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Search inventory"
                          className="w-32 text-xs outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2">
                        <Filter size={13} className="text-slate-400" />
                        <select
                          value={status}
                          onChange={(event) => setStatus(event.target.value)}
                          className="max-w-[130px] bg-transparent text-[11px] text-slate-600 outline-none"
                        >
                          <option>All statuses</option>
                          <option>Available</option>
                          <option>Reserved</option>
                          <option>Sold</option>
                        </select>
                      </div>

                      <button
                        aria-label="More filters"
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                        onClick={() =>
                          setNotice(
                            'More filters can be connected when the inventory API is added.',
                          )
                        }
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left">
                      <thead>
                        <tr className="bg-[#fafbfc] text-[10px] font-semibold uppercase tracking-[.09em] text-slate-400">
                          <th className="px-5 py-3 font-semibold">Property</th>
                          <th className="px-4 py-3 font-semibold">
                            Project / location
                          </th>
                          <th className="px-4 py-3 font-semibold">Area</th>
                          <th className="px-4 py-3 font-semibold">Price</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold">Updated</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredProperties.map((property) => (
                          <tr
                            key={property.id}
                            className="transition hover:bg-[#fbfcfb]"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf3ef] text-[#4b7860]">
                                  <Building2 size={16} />
                                </div>
                                <div>
                                  <div className="whitespace-nowrap text-xs font-semibold">
                                    {property.name}
                                  </div>
                                  <div className="mt-1 text-[10px] text-slate-400">
                                    {property.id} · {property.type}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="whitespace-nowrap text-xs font-medium">
                                {property.project}
                              </div>
                              <div className="mt-1 whitespace-nowrap text-[10px] text-slate-400">
                                {property.location}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                              {property.area}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold">
                              {property.price}
                            </td>
                            <td className="px-4 py-4">
                              <StatusBadge status={property.status} />
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-[10px] text-slate-400">
                              {property.updated}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredProperties.length === 0 && (
                      <div className="px-6 py-12 text-center">
                        <Search
                          size={22}
                          className="mx-auto text-slate-300"
                        />
                        <p className="mt-3 text-sm font-medium">
                          No properties found
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Try a different search or status.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
                    <span className="text-[10px] text-slate-400">
                      Showing {filteredProperties.length} of {properties.length}{' '}
                      records
                    </span>
                    <div className="flex gap-1">
                      <button
                        aria-label="Previous page"
                        onClick={() =>
                          setNotice('Pagination will be connected to the API.')
                        }
                        className="rounded-md border border-slate-200 p-1.5 text-slate-400"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        aria-label="Next page"
                        onClick={() =>
                          setNotice('Pagination will be connected to the API.')
                        }
                        className="rounded-md border border-slate-200 p-1.5 text-slate-400"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </section>

                <aside className="space-y-5">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold">
                        Workspace activity
                      </h2>
                      <button
                        aria-label="Activity options"
                        onClick={() =>
                          setNotice(
                            'Activity history requires a connected backend.',
                          )
                        }
                      >
                        <MoreHorizontal
                          size={17}
                          className="text-slate-400"
                        />
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Recent workspace updates
                    </p>

                    <div className="mt-5 space-y-5">
                      {[
                        {
                          icon: Building2,
                          color: 'bg-emerald-50 text-emerald-700',
                          title: 'Property added',
                          desc: 'Plot 018 · North Avenue',
                          time: '12 min ago',
                        },
                        {
                          icon: Users,
                          color: 'bg-indigo-50 text-indigo-600',
                          title: 'Lead status updated',
                          desc: 'Site visit scheduled',
                          time: '46 min ago',
                        },
                        {
                          icon: FileText,
                          color: 'bg-amber-50 text-amber-700',
                          title: 'Document uploaded',
                          desc: 'Greenfield · Layout plan',
                          time: '2 hrs ago',
                        },
                      ].map((item) => (
                        <div key={item.title} className="flex gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                          >
                            <item.icon size={15} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium">
                              {item.title}
                            </div>
                            <div className="mt-1 truncate text-[11px] text-slate-500">
                              {item.desc}
                            </div>
                            <div className="mt-1.5 text-[10px] text-slate-400">
                              {item.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => openModule('Analytics')}
                      className="mt-5 w-full rounded-lg border border-slate-200 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      View activity history →
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-xl bg-[#173e35] p-5 text-white">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                      <Sparkles size={17} />
                    </div>
                    <div className="mt-4 text-sm font-semibold">
                      Your property data, clearer.
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-white/70">
                      Keep project details, availability and team ownership
                      connected in one place.
                    </p>
                    <button
                      onClick={() => openModule('AI Assistant')}
                      className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#d4eadc] hover:text-white"
                    >
                      Explore AI assistant <ArrowUpRight size={14} />
                    </button>
                  </div>
                </aside>
              </div>

              <div className="mt-6 flex flex-col justify-between gap-2 border-t border-slate-200 pt-4 text-[10px] text-slate-400 sm:flex-row">
                <span>Estate Inertia · Property workspace</span>
                <span>Preview data only · Backend integration pending</span>
              </div>
            </>
          ) : (
            <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2ed] text-[#173e35]">
                {active === 'AI Assistant' ? (
                  <Sparkles size={22} />
                ) : active === 'Leads' ? (
                  <Users size={22} />
                ) : active === 'Projects' ? (
                  <Map size={22} />
                ) : active === 'Follow-ups' ? (
                  <CalendarDays size={22} />
                ) : active === 'Documents' ? (
                  <FileText size={22} />
                ) : active === 'Analytics' ? (
                  <Activity size={22} />
                ) : (
                  <Building2 size={22} />
                )}
              </div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                {active}
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                This module is part of the Estate Inertia workspace. Its
                database-backed workflows can be connected as the backend is
                implemented.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                UI scaffold · API integration pending
              </div>
              <div className="mt-8">
                <button
                  onClick={() => openModule('Overview')}
                  className="rounded-lg bg-[#173e35] px-4 py-2.5 text-xs font-semibold text-white"
                >
                  Back to overview
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Add a property</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Create a property record in this preview.
                </p>
              </div>
              <button
                aria-label="Close add property dialog"
                onClick={() => setShowAdd(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                addProperty();
              }}
            >
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">
                  Property name
                </span>
                <input
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="e.g. Plot 024 · East Avenue"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-700"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">
                  Project name
                </span>
                <input
                  value={newProject}
                  onChange={(event) => setNewProject(event.target.value)}
                  placeholder="e.g. Greenfield Enclave"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-700"
                  required
                />
              </label>

              <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-[11px] leading-5 text-amber-800">
                Preview only: records will reset on refresh until the backend
                and database are connected.
              </p>

              <button
                type="submit"
                disabled={!newName.trim() || !newProject.trim()}
                className="w-full rounded-lg bg-[#173e35] px-4 py-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add property
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
