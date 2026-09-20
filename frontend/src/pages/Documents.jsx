import { useState } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import UploadDialog from "@/components/documents/UploadDialog";
import DocumentRow from "@/components/documents/DocumentRow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileX2, Sparkles } from "lucide-react";

export default function Documents() {
 const [search,setSearch]=useState(""); const [page,setPage]=useState(1);
 const {data,isLoading}=useDocuments({search,page,limit:10}); const documents=data?.data?.documents||[]; const pagination=data?.data?.pagination;
 return <div className="page-enter max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8 space-y-7">
  <section className="relative overflow-hidden rounded-[28px] border bg-card p-6 sm:p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,hsl(var(--primary)/.12),transparent_30%),radial-gradient(circle_at_30%_100%,hsl(158_55%_55%/.08),transparent_28%)]"/>
   <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6"><div><div className="inline-flex items-center gap-2 text-xs font-bold text-primary"><Sparkles className="h-3.5 w-3.5"/> Knowledge library</div><h1 className="text-4xl font-black tracking-[-.045em] mt-2">Your documents.</h1><p className="text-muted-foreground mt-2">Manage the sources your AI uses to answer questions.</p></div><UploadDialog/></div>
  </section>
  <div className="flex flex-col sm:flex-row gap-3 justify-between"><div className="relative w-full sm:max-w-md"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search your knowledge…" className="h-11 rounded-xl pl-10 bg-card"/></div></div>
  {isLoading?<div className="space-y-3">{[...Array(5)].map((_,i)=><Skeleton key={i} className="h-16 rounded-2xl"/>)}</div>:documents.length===0?<div className="surface-card p-14 text-center border-dashed"><FileX2 className="h-9 w-9 mx-auto text-muted-foreground"/><p className="font-bold mt-3">No documents found</p><p className="text-sm text-muted-foreground mt-1">Upload a PDF, DOCX, or TXT file to start building your knowledge base.</p></div>:<div className="surface-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-muted/45 text-xs uppercase text-muted-foreground"><tr><th className="py-4 px-5">Name</th><th className="py-4 px-5">Type</th><th className="py-4 px-5">Size</th><th className="py-4 px-5">Chunks</th><th className="py-4 px-5">Status</th><th className="py-4 px-5">Uploaded</th><th className="py-4 px-5 text-right">Actions</th></tr></thead><tbody>{documents.map(doc=><DocumentRow key={doc._id} document={doc}/>)}</tbody></table></div></div>}
  {pagination&&pagination.totalPages>1&&<div className="flex items-center justify-between text-sm"><p className="text-muted-foreground">Page {pagination.page} of {pagination.totalPages} · {pagination.total} total</p><div className="flex gap-2"><Button variant="outline" className="rounded-xl" size="sm" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</Button><Button variant="outline" className="rounded-xl" size="sm" disabled={page>=pagination.totalPages} onClick={()=>setPage(p=>p+1)}>Next</Button></div></div>}
 </div>;
}
