"use client";

import React, { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import axios from "axios";
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Search, Download, Trash2, Pencil, Plus, ArrowLeft } from "lucide-react";

import BranchForm from "../auth/L2DialogBoxParts/Branch/BranchForm";

/* ---------- shadcn/ui components ---------- */
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import BasicCourseForm from "../auth/L2DialogBoxParts/Course/BasicCourseForm";
import CoachingCourseForm from "../auth/L2DialogBoxParts/Course/CoachingCourseForm";
import StudyHallForm from "../auth/L2DialogBoxParts/Course/StudyHallForm";
import TuitionCenterForm from "../auth/L2DialogBoxParts/Course/TuitionCenterForm";
import UnderPostGraduateForm from "../auth/L2DialogBoxParts/Course/UnderPostGraduateForm";
import { getInstitutionType } from "@/lib/api";



/* ---------- Types ---------- */
type Program = {
  id: number;
  name: string;
  branch: string;
  status: "Live" | "Inactive";
  startDate: string;
  endDate: string;
  leads: number;
};

type Transaction = {
  id: number;
  invoiceId: string;
  date: string;
  planType: string;
  amount: string;
};

type Branch = {
  name: string;
};

/* ---------- Axios API client ---------- */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// api.interceptors.request.use((cfg) => {
//   if (typeof window !== "undefined") {
//     // const token = localStorage.getItem("token");
//     if (token) {
//       cfg.headers = {
//         ...(cfg.headers ?? {}),
//         Authorization: `Bearer ${token}`,
//       };
//     }
//   }
//   return cfg;
// });

/* ---------- React Query Client ---------- */
const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 404) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/* ---------- Mock Data for Development (Fallback on 404) ---------- */
const mockBranches: Branch[] = [
  { name: "Computer Science" },
  { name: "Electrical Engineering" },
  { name: "Mechanical Engineering" },
];

const mockProgramsPages = [
  {
    data: [
      {
        id: 1,
        name: "B.Tech CS",
        branch: "Computer Science",
        status: "Live" as const,
        startDate: "2024-01-01",
        endDate: "2025-12-31",
        leads: 150,
      },
      {
        id: 2,
        name: "M.Tech EE",
        branch: "Electrical Engineering",
        status: "Inactive" as const,
        startDate: "2023-09-01",
        endDate: "2024-08-31",
        leads: 75,
      },
    ],
    meta: { nextPage: null },
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 1,
    invoiceId: "INV-001",
    date: "2024-09-01",
    planType: "Premium",
    amount: "$99.99",
  },
  {
    id: 2,
    invoiceId: "INV-002",
    date: "2024-08-15",
    planType: "Basic",
    amount: "$49.99",
  },
];



/* ---------- CSV Helper ---------- */
function downloadCSV(rows: Transaction[]) {
  const header = ["S.No", "Invoice ID", "Date", "Plan Type", "Amount"];
  const csv = [
    header,
    ...rows.map((r, i) => [
      String(i + 1),
      r.invoiceId,
      r.date,
      r.planType,
      r.amount,
    ]),
  ]
    .map((row) =>
      row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


/* ---------- Reusable Add Program Form Component ---------- */
function AddProgramForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (payload: Partial<Program>) => void;
  onCancel?: () => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Partial<Program> = {
      name: String(fd.get("name") ?? ""),
      branch: String(fd.get("branch") ?? ""),
      status: (fd.get("status") as "Live" | "Inactive") ?? "Live",
      startDate: String(fd.get("startDate") ?? ""),
      endDate: String(fd.get("endDate") ?? ""),
      leads: Number(fd.get("leads") ?? 0),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="Program Name" required />
      <Input name="branch" placeholder="Branch" required />
      <Select name="status" defaultValue="Live">
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Live">Live</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Input name="startDate" placeholder="Start Date" type="date" />
      <Input name="endDate" placeholder="End Date" type="date" />
      <Input name="leads" placeholder="Leads" type="number" />
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Save
        </Button>
      </div>
    </form>
  );
}

/* ---------- Program Form Selector Component ---------- */
function ProgramFormSelector({ onBack }: { onBack: () => void }) {
  const institutionType = getInstitutionType();
  
  const renderForm = () => {
    switch (institutionType) {
      case 'Kindergarten/childcare center':
      case 'School':
      case 'Intermediate college(K12)':
        return <BasicCourseForm />;
      case 'Coaching centers':
        return <CoachingCourseForm />;
      case 'Study Halls':
        return <StudyHallForm />;
      case "Tution Center's":
        return <TuitionCenterForm />;
      case 'Under Graduation/Post Graduation':
        return <UnderPostGraduateForm />;
      default:
        return (
          <div className="text-center text-gray-600 py-8">
            Unsupported institution type: {institutionType}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
      
      {/* Form Card */}
      <Card className="bg-white">
        <CardHeader>
          <h3 className="text-xl font-semibold">Add Program</h3>
        </CardHeader>
        <CardContent>
          {renderForm()}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Branch Form Component ---------- */
function BranchFormSelector({ onBack, branches }: { onBack: () => void; branches: Branch[] }) {
  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
      
      {/* Form Card */}
      <Card className="bg-white">
        <CardHeader>
          <h3 className="text-xl font-semibold">Add Branch</h3>
        </CardHeader>
        <CardContent>
          <BranchForm
            branches={branches}
            isLoading={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Main Subscription Content ---------- */
function SubscriptionContent() {
  const [activeTab, setActiveTab] = useState<"details" | "add">("details");
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [addTabView, setAddTabView] = useState<"grid" | "program" | "branch">("grid");
  
  
  const queryClient = useQueryClient();
  
  /* ---- Branches Query with Mock Fallback ---- */
  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      try {
        const res = await api.get("/branches");
        return res.data; // { data: [{ name: string }, ...] }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn("Branches API not found, using mock data");
          return { data: mockBranches };
        }
        throw error;
      }
    },
  });
  
  /* ---- Programs Infinite Query with Mock Fallback ---- */
  const programsQuery = useInfiniteQuery({
    queryKey: [
      "programs",
      { search, branch: branchFilter, status: statusFilter },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await api.get("/programs", {
          params: {
            page: pageParam,
            search,
            branch: branchFilter,
            status: statusFilter,
          },
        });
        return res.data; // { data, meta: { nextPage } }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn("Programs API not found, using mock data");
          return mockProgramsPages[pageParam - 1] || { data: [], meta: { nextPage: null } };
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.meta?.nextPage ?? null,
    initialPageParam: 1,
  });
  
  const programs = useMemo(
    () => programsQuery.data?.pages.flatMap((p: any) => p.data) ?? [],
    [programsQuery.data]
  );
  
  /* ---- Transactions Query with Mock Fallback ---- */
  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        const res = await api.get("/transactions");
        return res.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn("Transactions API not found, using mock data");
          return { data: mockTransactions };
        }
        throw error;
      }
    },
  });

  /* ---- Add Program Mutation (with Mock Success for Demo) ---- */
  const addProgramMutation = useMutation({
    mutationFn: async (payload: Partial<Program>) => {
      try {
        const res = await api.post("/programs", payload);
        return res.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn("Add Program API not found, simulating success");
          return { id: Date.now(), ...payload };
        }
        throw error;
      }
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["programs"] });
      const previous = queryClient.getQueryData(["programs"]);
      
      queryClient.setQueryData(["programs"], (old: any) => {
        const fake: Program = {
          id: Date.now(),
          name: payload.name ?? "New Program",
          branch: payload.branch ?? "Unknown",
          status: (payload.status as "Live" | "Inactive") ?? "Live",
          startDate: payload.startDate ?? "",
          endDate: payload.endDate ?? "",
          leads: payload.leads ?? 0,
        };

        if (old?.pages) {
          const newPages = structuredClone(old);
          newPages.pages[0].data = [fake, ...(newPages.pages[0].data ?? [])];
          return newPages;
        }
        return {
          pages: [{ data: [fake] }],
        };
      });
      
      return { previous };
    },
    
    onError: (_err, _vars, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(["programs"], context.previous);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
  
  /* ---- Add Branch Mutation (Unused in UI, but kept for scalability) ---- */
  const addBranchMutation = useMutation({
    mutationFn: async (payload: { name: string }) => {
      try {
        const res = await api.post("/branches", payload);
        return res.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn("Add Branch API not found, simulating success");
          return { name: payload.name };
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
  
  /* ---- Handlers ---- */
  const handleLoadMore = useCallback(() => {
    if (!programsQuery.hasNextPage || programsQuery.isFetchingNextPage) return;
    programsQuery.fetchNextPage();
  }, [programsQuery]);
  
  const handleAddProgram = useCallback(
    async (payload: Partial<Program>) => {
      await addProgramMutation.mutateAsync(payload);
      setProgramDialogOpen(false);
    },
    [addProgramMutation]
  );
  
  const handleExportTransactions = useCallback(() => {
    const rows: Transaction[] = transactionsQuery.data?.data ?? [];
    downloadCSV(rows);
  }, [transactionsQuery.data]);

  // Reset addTabView when switching tabs
  const handleTabChange = (tab: "details" | "add") => {
    setActiveTab(tab);
    if (tab === "add") {
      setAddTabView("grid");
    }
  };
  
  /* ---------- Render ---------- */
  return (
    <>
      <Head>
        <title>Subscription</title>
      </Head>

      <div className="p-6 bg-white rounded-2xl shadow-sm space-y-6">
        {/* Tabs */}
        <h2 className="text-2xl font-semibold">Your Listed Programs</h2>
        <div className="flex items-center justify-between">
          <div className="flex gap-6 items-end">
            <div className="flex gap-4">
              <button
                className={`pb-2 ${
                  activeTab === "details"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabChange("details")}
              >
                Program Details
              </button>
              <button
                className={`pb-2 ${
                  activeTab === "add"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabChange("add")}
              >
                Add Program
              </button>
            </div>
          </div>
        </div>

        {/* Search + Filters (Only in Details Tab) */}
        {activeTab === "details" && (
          <div className="flex gap-3 items-center">
            <div className="relative w-[380px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Program"
                className="pl-10"
              />
            </div>

            <Select onValueChange={(v) => setBranchFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-44 bg-white border">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branchesQuery.isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  (branchesQuery.data?.data as Branch[])?.map((b) => (
                    <SelectItem key={b.name} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-32 bg-white border">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Content */}
        {activeTab === "details" ? (
          <div className="space-y-6">
            {/* Programs Table */}
            <Card className="bg-[#F7F7FA]">
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.No</TableHead>
                        <TableHead>Program Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>New Leads</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programsQuery.isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7}>Loading...</TableCell>
                        </TableRow>
                      ) : programs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7}>No programs found.</TableCell>
                        </TableRow>
                      ) : (
                        programs.map((p, idx) => (
                          <TableRow
                            key={p.id}
                            className="bg-white rounded-lg my-2"
                          >
                            <TableCell className="py-6">
                              {String(idx + 1).padStart(2, "0")}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-sm text-gray-400">
                                {p.branch}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  p.status === "Live" ? "default" : "secondary"
                                }
                                className={
                                  p.status === "Live"
                                    ? "bg-green-100 text-green-700"
                                    : ""
                                }
                              >
                                {p.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{p.startDate}</TableCell>
                            <TableCell>{p.endDate}</TableCell>
                            <TableCell>{p.leads}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="border rounded-full hover:text-red-600"
                                >
                                  <Trash2 />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="border rounded-full hover:text-blue-600"
                                >
                                  <Pencil />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
                  {programsQuery.hasNextPage && !programsQuery.isError ? (
                    <Button
                      onClick={handleLoadMore}
                      disabled={programsQuery.isFetchingNextPage}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {programsQuery.isFetchingNextPage ? "Loading..." : "View more"}
                    </Button>
                  ) : programsQuery.isError ? (
                    <div className="text-sm text-red-500">
                      Error loading programs. <Button variant="link" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["programs"] })}>Retry</Button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No more programs
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="py-8">
            {addTabView === "grid" && (
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-6 max-w-lg w-full">
                  {/* -------- Add Program Card -------- */}
                  <Card 
                    className="bg-gray-50 border rounded-lg shadow-sm hover:shadow-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer h-40 w-48 flex items-center justify-center mx-auto"
                    onClick={() => setAddTabView("program")}
                  >
                    <CardContent className="flex flex-col items-center justify-center w-full h-full p-3">
                      {/* Small "+" button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full w-10 h-10 mb-3 bg-white border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                      >
                        <Plus className="h-5 w-5 text-gray-600" />
                      </Button>

                      {/* Title */}
                      <div className="text-sm font-medium text-gray-700 text-center">
                        Add Program
                      </div>
                    </CardContent>
                  </Card>

                  {/* -------- Add Branch Card -------- */}
                  <Card 
                    className="bg-gray-50 border rounded-lg shadow-sm hover:shadow-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer h-40 w-48 flex items-center justify-center mx-auto"
                    onClick={() => setAddTabView("branch")}
                  >
                    <CardContent className="flex flex-col items-center justify-center w-full h-full p-3">
                      {/* Small "+" button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full w-10 h-10 mb-3 bg-white border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                      >
                        <Plus className="h-5 w-5 text-gray-600" />
                      </Button>

                      {/* Title */}
                      <div className="text-sm font-medium text-gray-700 text-center">
                        Add Branch
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {addTabView === "program" && (
              <ProgramFormSelector onBack={() => setAddTabView("grid")} />
            )}

            {addTabView === "branch" && (
              <BranchFormSelector 
                onBack={() => setAddTabView("grid")} 
                branches={branchesQuery.data?.data || []}
              />
            )}
          </div>
        )}

        {/* Transaction History (Always Visible) */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Transaction History</h3>
            <div className="flex gap-2 items-center">
              <Button onClick={handleExportTransactions} variant="outline">
                Export CSV
              </Button>
              <Button
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["transactions"],
                  })
                }
                variant="ghost"
              >
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsQuery.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6}>Loading…</TableCell>
                    </TableRow>
                  ) : transactionsQuery.isError ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        Error loading transactions. <Button variant="link" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["transactions"] })}>Retry</Button>
                      </TableCell>
                    </TableRow>
                  ) : (transactionsQuery.data?.data ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>No transactions</TableCell>
                    </TableRow>
                  ) : (
                    (transactionsQuery.data.data as Transaction[]).map(
                      (t, i) => (
                        <TableRow key={t.id} className="bg-white">
                          <TableCell>
                            {String(i + 1).padStart(2, "0")}
                          </TableCell>
                          <TableCell>{t.invoiceId}</TableCell>
                          <TableCell>{t.date}</TableCell>
                          <TableCell>{t.planType}</TableCell>
                          <TableCell>{t.amount}</TableCell>
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="border rounded-full"
                            >
                              <Download />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

/* ---------- Wrapper ---------- */
export default function SubscriptionPage() {
  return (
    <QueryClientProvider client={qc}>
      <div className="min-h-screen bg-[#FAFBFF] p-6">
        <SubscriptionContent />
      </div>
    </QueryClientProvider>
  );
}