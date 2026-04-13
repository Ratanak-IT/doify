"use client";
import CreateProjectTaskModal from "./CreateProjectTaskModal";
import EditProjectTaskModal from "./EditProjectTaskModal";
import { useMemo, useRef, useState } from "react";
import {
  MessageSquare, MoreHorizontal, Plus, Search, Trash2,
  Edit2, Check, X, Send, ChevronDown, ChevronRight, Settings, ArrowLeft,
} from "lucide-react";
import type { Project, Task } from "@/lib/features/types/task-type";
import {
  useGetProjectTasksQuery,
  useUpdateProjectTaskMutation,
  useDeleteTaskMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetSubtasksQuery,
  useDeleteProjectMutation,
} from "@/lib/features/tasks/taskApi";
import ParentTaskDetailView from "./ParentTaskDetailView";
import UpdateProjectModal from "./modals/UpdateProjectModal";

type TaskStatus = "TODO"|"IN_PROGRESS"|"IN_REVIEW"|"DONE";

// ── FIX: Added `bgClass` + `darkBgClass` Tailwind strings so column
//         backgrounds respond to dark mode without inline style overrides.
type ColDef = {
  id: TaskStatus;
  label: string;
  dot: string;
  bgClass: string;       // light-mode column body bg
  darkBgClass: string;   // dark-mode column body bg
  dropBgClass: string;   // light-mode drop-active bg
  darkDropBgClass: string;
  accent: string;
};

const COLUMNS: ColDef[] = [
  {
    id: "TODO",        label: "TO DO",
    dot: "#97a0af",    accent: "#97a0af",
    bgClass: "bg-slate-100",          darkBgClass: "dark:bg-slate-800/40",
    dropBgClass: "bg-violet-50",      darkDropBgClass: "dark:bg-violet-900/20",
  },
  {
    id: "IN_PROGRESS", label: "IN PROGRESS",
    dot: "#6C5CE7",    accent: "#6C5CE7",
    bgClass: "bg-purple-50",          darkBgClass: "dark:bg-purple-900/20",
    dropBgClass: "bg-violet-100",     darkDropBgClass: "dark:bg-violet-900/30",
  },
  {
    id: "IN_REVIEW",   label: "IN REVIEW",
    dot: "#ff991f",    accent: "#ff991f",
    bgClass: "bg-orange-50",          darkBgClass: "dark:bg-orange-900/20",
    dropBgClass: "bg-orange-100",     darkDropBgClass: "dark:bg-orange-900/30",
  },
  {
    id: "DONE",        label: "DONE",
    dot: "#00875a",    accent: "#00875a",
    bgClass: "bg-green-50",           darkBgClass: "dark:bg-green-900/20",
    dropBgClass: "bg-green-100",      darkDropBgClass: "dark:bg-green-900/30",
  },
];

const PRIORITY_STYLE: Record<string,string> = {
  LOW:    "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  MEDIUM: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  HIGH:   "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  URGENT: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700",
};

const STATUS_CYCLE: TaskStatus[] = ["TODO","IN_PROGRESS","IN_REVIEW","DONE"];
const STATUS_STYLE: Record<TaskStatus,string> = {
  TODO:        "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700",
  IN_PROGRESS: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/50",
  IN_REVIEW:   "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/50",
  DONE:        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/50",
};
const ARROW_LABEL: Record<TaskStatus,string> = {
  TODO:"→ TO DO", IN_PROGRESS:"→ IN PROGRESS", IN_REVIEW:"→ IN REVIEW", DONE:"→ DONE",
};

/* ── Status Badge ── */
function StatusBadge({ status, onCycle }:{ status:TaskStatus; onCycle:(next:TaskStatus)=>void }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STATUS_CYCLE.filter(s=>s!==status).map(s=>(
        <button key={s} onClick={e=>{e.stopPropagation();onCycle(s);}}
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-colors cursor-pointer min-h-[28px] ${STATUS_STYLE[s]}`}>
          {ARROW_LABEL[s]}
        </button>
      ))}
    </div>
  );
}

/* ── Inline Edit ── */
function InlineEditForm({ title, description, onSave, onCancel }:{ title:string; description:string; onSave:(t:string,d:string)=>void; onCancel:()=>void }) {
  const [editTitle, setEditTitle] = useState(title);
  const [editDesc,  setEditDesc]  = useState(description);
  const handleSave = () => { if (!editTitle.trim()) return; onSave(editTitle.trim(), editDesc.trim()); };
  return (
    <div className="flex-1 space-y-1.5" onClick={e=>e.stopPropagation()}>
      <input autoFocus value={editTitle} onChange={e=>setEditTitle(e.target.value)}
        onKeyDown={e=>{ if(e.key==="Enter")handleSave(); if(e.key==="Escape")onCancel(); }}
        className="w-full h-8 px-2 text-sm rounded-lg border border-blue-500 outline-none bg-white dark:bg-slate-800 dark:text-white"/>
      <textarea value={editDesc} onChange={e=>setEditDesc(e.target.value)} placeholder="Description (optional)" rows={3}
        className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 outline-none resize-none bg-white dark:bg-slate-800 dark:text-white focus:border-blue-400"/>
      <div className="flex gap-1">
        <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700 min-h-[28px]"><Check size={10}/> Save</button>
        <button onClick={onCancel}   className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[10px] hover:bg-slate-100 dark:hover:bg-slate-700 min-h-[28px]"><X size={10}/> Cancel</button>
      </div>
    </div>
  );
}

/* ── Subtask Row ── */
function SubtaskRow({ subtask, col, projectId, onMove }:{ subtask:Task; col:ColDef; projectId:string; onMove:(id:string,s:TaskStatus)=>void }) {
  const [editing, setEditing] = useState(false);
  const [updateProjectTask] = useUpdateProjectTaskMutation();
  const handleSave = async (title:string, description:string) => {
    await updateProjectTask({ projectId, taskId: subtask.id, data:{ title, description: description||undefined } });
    setEditing(false);
  };
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 border-l-[3px] p-3 space-y-2" style={{borderLeftColor:col.accent}}>
      <div className="flex items-start gap-2">
        {editing ? (
          <InlineEditForm title={subtask.title} description={subtask.description??""} onSave={handleSave} onCancel={()=>setEditing(false)}/>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white break-words">{subtask.title}</p>
              {subtask.description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{subtask.description}</p>}
            </div>
            <button onClick={()=>setEditing(true)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-blue-600 shrink-0"><Edit2 size={11}/></button>
          </>
        )}
      </div>
      {!editing && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${PRIORITY_STYLE[subtask.priority]??""}`}>
            {subtask.priority?.toLowerCase()}
          </span>
          <StatusBadge status={subtask.status as TaskStatus} onCycle={next=>onMove(subtask.id,next)}/>
        </div>
      )}
    </div>
  );
}

/* ── Comments Drawer ── */
function CommentsDrawer({ task, onClose }:{ task:Task; onClose:()=>void }) {
  const { data: pageData, isLoading } = useGetCommentsQuery({ taskId: task.id });
  const comments = pageData?.content ?? [];
  const [addComment,{isLoading:posting}] = useAddCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [text,setText] = useState("");
  const [editId,setEditId] = useState<string|null>(null);
  const [editText,setEditText] = useState("");
  const submit = async()=>{ if(!text.trim())return; await addComment({taskId:task.id,content:text.trim()}); setText(""); };
  const saveEdit = async(cid:string)=>{ if(!editText.trim())return; await updateComment({taskId:task.id,commentId:cid,content:editText.trim()}); setEditId(null); };
  const timeAgo=(iso:string)=>{ const m=Math.round((Date.now()-new Date(iso).getTime())/60000); return m<60?`${m}m ago`:`${Math.round(m/60)}h ago`; };
  const getInitials=(n:string)=>n.split(" ").filter(Boolean).slice(0,2).map(s=>s[0].toUpperCase()).join("");
  const getAvatarColor=(seed:string)=>{ const c=["#6C5CE7","#00875a","#ff5630","#6554c0","#ff991f","#00b8d9","#36b37e","#EF4444"]; let h=0; for(let i=0;i<seed.length;i++) h=seed.charCodeAt(i)+((h<<5)-h); return c[Math.abs(h)%c.length]; };
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50" onClick={onClose}/>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{task.title}</p>
            <p className="text-xs text-slate-400">{comments.length} comment{comments.length!==1?"s":""}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && <p className="text-center text-xs text-slate-400 py-8">Loading…</p>}
          {!isLoading && comments.length===0 && <p className="text-center text-xs text-slate-400 py-8">No comments yet.</p>}
          {comments.map(c=>{
            const authorName = c.author?.fullName??c.author?.username??"Unknown";
            const authorId = c.author?.id??authorName;
            return (
              <div key={c.id} className="flex gap-3 group">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-medium shrink-0" style={{backgroundColor:getAvatarColor(authorId)}}>
                  {getInitials(authorName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{authorName}</span>
                    <span className="text-[10px] text-slate-400">{timeAgo(c.createdAt)}</span>
                    <div className="ml-auto flex gap-1">
                      <button onClick={()=>{setEditId(c.id);setEditText(c.content);}} className="text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={11}/></button>
                      <button onClick={()=>{if(confirm("Delete?"))deleteComment({taskId:task.id,commentId:c.id});}} className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={11}/></button>
                    </div>
                  </div>
                  {editId===c.id ? (
                    <div className="flex gap-1 mt-1">
                      <input value={editText} onChange={e=>setEditText(e.target.value)} className="flex-1 h-8 px-2 text-xs rounded-lg border border-blue-500 outline-none bg-white dark:bg-slate-800 dark:text-white"/>
                      <button onClick={()=>saveEdit(c.id)} className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center"><Check size={11}/></button>
                      <button onClick={()=>setEditId(null)} className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center"><X size={11}/></button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed break-words">{c.content}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 shrink-0">
          <div className="flex gap-2">
            <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit();}}} placeholder="Write a comment…"
              className="flex-1 h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white transition-colors"/>
            <button onClick={submit} disabled={posting||!text.trim()} className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40">
              <Send size={14}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function TeamTaskCard({
  task,
  col,
  projectId,
  teamId,
  onMove,
  onOpenTask,
  onDelete,
  onComment,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: {
  task: Task;
  col: ColDef;
  projectId: string;
  teamId: string;
  onMove: (taskId: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onComment: (task: Task) => void;
  onOpenTask: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const hasSubtasks = (task.subtaskCount??0)>0;
  const { data: subtasks=[], isLoading: subtasksLoading } = useGetSubtasksQuery(task.id, { skip: !expanded||!hasSubtasks });

  return (
    <div
      draggable
      onDragStart={()=>onDragStart(task)}
      onDragEnd={onDragEnd}
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 border-l-[3px] p-3.5 space-y-3 transition-all select-none ${
        isDragging ? "opacity-40 scale-95 shadow-none cursor-grabbing" : "hover:shadow-md dark:hover:shadow-slate-950/50 cursor-grab active:cursor-grabbing"
      }`}
      style={{borderLeftColor:col.accent}}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button type="button" onClick={e=>{e.stopPropagation();if(hasSubtasks)setExpanded(v=>!v);}}
            className="mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {hasSubtasks ? (expanded?<ChevronDown size={14}/>:<ChevronRight size={14}/>) : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"/>}
          </button>
          <button type="button" onClick={()=>onOpenTask(task)} className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug break-words">{task.title}</p>
            {task.description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>}
          </button>
        </div>
        <div className="flex gap-0.5 shrink-0">
          <button onClick={()=>setShowEdit(true)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Edit2 size={13}/></button>
          <button onClick={()=>onComment(task)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><MessageSquare size={13}/></button>
          <button onClick={()=>{if(confirm("Delete this task?"))onDelete(task.id);}} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={13}/></button>
          <button className="w-7 h-7 flex items-center justify-center text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><MoreHorizontal size={13}/></button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <StatusBadge status={task.status as TaskStatus} onCycle={next=>onMove(task.id,next)}/>
        {hasSubtasks && (
          <div className="flex justify-between w-full mt-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {task.subtaskCount} subtask{(task.subtaskCount??0)!==1?"s":""}
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${PRIORITY_STYLE[task.priority]??""}`}>
              {task.priority?.toLowerCase()}
            </span>
          </div>
        )}
      </div>

      {/* Subtasks */}
      {expanded && (
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="pl-7 space-y-2">
            {subtasksLoading ? (
              <><div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg h-16"/><div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg h-16"/></>
            ) : subtasks.length===0 ? (
              <div className="text-xs text-slate-400 py-2">No subtasks</div>
            ) : (
              subtasks.map((s:Task)=><SubtaskRow key={s.id} subtask={s} col={col} projectId={projectId} onMove={onMove}/>)
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <EditProjectTaskModal
          task={task}
          projectId={projectId}
          teamId={teamId}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}

/* ── Drag Ghost ── */
function DragGhost({ task, x, y }:{task:Task;x:number;y:number}) {
  return (
    <div style={{position:"fixed",left:x-140,top:y-35,width:270,pointerEvents:"none",zIndex:9999,transform:"rotate(2deg) scale(1.03)"}}
      className="bg-white dark:bg-slate-900 rounded-xl border-2 border-[#6C5CE7] p-3.5 shadow-2xl shadow-[#6C5CE7]/30 opacity-90">
      <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">{task.title}</p>
    </div>
  );
}

/* ── Panel ── */
export default function ProjectTasksPanel({ project, onBack }:{ project:Project; onBack?:()=>void }) {
  const [search, setSearch] = useState("");
  const [commentTask, setCommentTask] = useState<Task|null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdateProject, setShowUpdateProject] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus|undefined>();
  const [activeParentTask, setActiveParentTask] = useState<Task|null>(null);

  /* ── Drag state ── */
  const [draggedTask, setDraggedTask] = useState<Task|null>(null);
  const [dropColId,   setDropColId]   = useState<TaskStatus|null>(null);
  const [ghostPos,    setGhostPos]    = useState<{x:number;y:number}|null>(null);

  /* Touch drag refs */
  const touchTimer    = useRef<ReturnType<typeof setTimeout>|null>(null);
  const isTouchDrag   = useRef(false);
  const touchStartXY  = useRef({x:0,y:0});

  const openCreateModal = (status?:TaskStatus) => { setDefaultStatus(status); setShowCreate(true); };

  const { data: tasksPage, isLoading, refetch } = useGetProjectTasksQuery({ projectId: project.id, size:100 });
  const [updateProjectTask] = useUpdateProjectTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const allTasks: Task[] = tasksPage?.content ?? [];
  const tasks = allTasks.filter(t=>!t.parentTaskId);
  const filteredTasks = useMemo(()=>{ if(!search.trim()) return tasks; return tasks.filter(t=>t.title.toLowerCase().includes(search.toLowerCase())); },[tasks,search]);

  const progress = project.progress ?? (tasks.length ? Math.round((tasks.filter(t=>t.status==="DONE").length/tasks.length)*100) : 0);

  const handleMove   = (taskId:string, status:TaskStatus) => updateProjectTask({ projectId:project.id, taskId, data:{status} });
  const handleDelete = (id:string) => deleteTask(id);

  /* ── HTML5 Drag (desktop) ── */
  const onDragStart = (task:Task) => setDraggedTask(task);
  const onDragEnd   = () => { setDraggedTask(null); setDropColId(null); };
  const onColDragOver = (e:React.DragEvent, colId:TaskStatus) => { e.preventDefault(); e.dataTransfer.dropEffect="move"; setDropColId(colId); };
  const onColDragLeave = (e:React.DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropColId(null); };
  const onColDrop = (e:React.DragEvent, colId:TaskStatus) => {
    e.preventDefault();
    if (draggedTask && colId!==draggedTask.status) handleMove(draggedTask.id, colId);
    setDraggedTask(null); setDropColId(null);
  };

  /* ── Touch Drag (mobile) ── */
  const onTouchStart = (task:Task, e:React.TouchEvent) => {
    const t = e.touches[0];
    touchStartXY.current = {x:t.clientX, y:t.clientY};
    isTouchDrag.current = false;
    touchTimer.current = setTimeout(()=>{
      isTouchDrag.current = true;
      setDraggedTask(task);
      setGhostPos({x:touchStartXY.current.x, y:touchStartXY.current.y});
      navigator.vibrate?.(40);
    }, 400);
  };

  const onBoardTouchMove = (e:React.TouchEvent) => {
    const t = e.touches[0];
    if (!isTouchDrag.current) {
      const dx = Math.abs(t.clientX-touchStartXY.current.x);
      const dy = Math.abs(t.clientY-touchStartXY.current.y);
      if (dx>8||dy>8) clearTimeout(touchTimer.current!);
      return;
    }
    e.preventDefault();
    setGhostPos({x:t.clientX, y:t.clientY});
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const colEl = el?.closest("[data-col-id]");
    setDropColId((colEl?.getAttribute("data-col-id") as TaskStatus)??null);
  };

  const onBoardTouchEnd = () => {
    clearTimeout(touchTimer.current!);
    if (isTouchDrag.current && draggedTask && dropColId && dropColId!==draggedTask.status) {
      handleMove(draggedTask.id, dropColId);
    }
    isTouchDrag.current=false; setDraggedTask(null); setDropColId(null); setGhostPos(null);
  };

  if (activeParentTask) {
    return <ParentTaskDetailView task={activeParentTask} onBack={()=>setActiveParentTask(null)}/>;
  }

  return (
    <>
      {/* ── FIX: was bg-[#F1F5F9] with no dark variant ── */}
      <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-950">
        {/* Project header */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-wrap">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Back to projects"
            >
              <ArrowLeft size={15}/>
            </button>
          )}
          <div className="w-3 h-3 rounded-full shrink-0" style={{backgroundColor:project.color||"#6d28d9"}}/>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{project.name}</p>
            {project.description && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{project.description}</p>}
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <button onClick={()=>setShowUpdateProject(true)} className="text-xs h-8 sm:h-9 px-2 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 sm:gap-1.5">
              <Settings size={13}/>
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button onClick={()=>{if(confirm("Delete this project?"))deleteProject(project.id);}} className="text-xs h-8 sm:h-9 px-2 sm:px-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1 sm:gap-1.5">
              <Trash2 size={13}/>
              <span className="hidden sm:inline">Delete</span>
            </button>
            <button onClick={()=>refetch()} className="text-xs h-8 sm:h-9 px-2 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">↺</span>
            </button>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">{progress}%</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-200 dark:bg-slate-800">
          <div className="h-full bg-violet-500 transition-all duration-500" style={{width:`${progress}%`}}/>
        </div>

        {/* Search */}
        <div className="px-4 sm:px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="relative w-full max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..."
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"/>
          </div>
        </div>

        <main
          className="flex-1 overflow-auto p-5"
          onTouchMove={onBoardTouchMove}
          onTouchEnd={onBoardTouchEnd}
        >
          <div className="flex gap-4 min-w-max h-full">
            {COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id);
              const isDropTarget = dropColId === col.id;
              return (
                <div key={col.id} data-col-id={col.id}
                  className="w-[240px] sm:w-[290px] flex flex-col"
                  onDragOver={e=>onColDragOver(e,col.id)}
                  onDragLeave={onColDragLeave}
                  onDrop={e=>onColDrop(e,col.id)}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{backgroundColor:col.dot}}/>
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">{col.label}</span>
                      {/* ── FIX: was bg-white dark:bg-slate-900 which blends into page bg in light mode ── */}
                      <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-full font-semibold">{colTasks.length}</span>
                    </div>
                    <button onClick={()=>openCreateModal(col.id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Plus size={14}/>
                    </button>
                  </div>

                  {/* ── FIX: Column body — removed inline style backgroundColor; use Tailwind bgClass/darkBgClass
                              so dark mode actually applies. Drop-active state appended conditionally. ── */}
                  <div
                    className={[
                      "flex-1 rounded-xl p-2 flex flex-col gap-2 transition-all duration-150",
                      isDropTarget
                        ? `${col.dropBgClass} ${col.darkDropBgClass} ring-2 ring-[#6C5CE7] ring-inset scale-[1.01]`
                        : `${col.bgClass} ${col.darkBgClass}`,
                    ].join(" ")}
                  >
                    {isLoading
                      ? Array.from({length:2}).map((_,i)=><div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-xl h-28 opacity-60"/>)
                      : colTasks.map(task=>(
                          <div key={task.id} onTouchStart={e=>onTouchStart(task,e)}>
                            <TeamTaskCard
                              task={task} col={col} projectId={project.id}
                              teamId={project.teamId ?? ""}
                              onMove={handleMove} onDelete={handleDelete}
                              onComment={setCommentTask} onOpenTask={setActiveParentTask}
                              isDragging={draggedTask?.id===task.id}
                              onDragStart={onDragStart} onDragEnd={onDragEnd}
                            />
                          </div>
                        ))}

                    {!isLoading && colTasks.length === 0 && (
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center text-xs font-medium transition-colors ${
                        isDropTarget
                          ? "border-violet-400 text-violet-400 bg-violet-50 dark:bg-violet-900/20"
                          // ── FIX: was border-black/10 which is invisible in dark mode
                          : "border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-600"
                      }`}>
                        {isDropTarget ? "Drop here" : "No tasks"}
                      </div>
                    )}
                    {!isLoading && colTasks.length > 0 && isDropTarget && draggedTask?.status !== col.id && (
                      <div className="border-2 border-dashed border-violet-400 rounded-lg h-16 bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-xs text-violet-400 font-medium">
                        Drop here
                      </div>
                    )}
                    {isDropTarget && colTasks.length>0 && <div className="h-1.5 rounded-full bg-[#6C5CE7] opacity-60 mx-1"/>}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Touch ghost */}
      {ghostPos && draggedTask && <DragGhost task={draggedTask} x={ghostPos.x} y={ghostPos.y}/>}

      {commentTask && <CommentsDrawer task={commentTask} onClose={()=>setCommentTask(null)}/>}
      {showCreate  && <CreateProjectTaskModal projectId={project.id} defaultStatus={defaultStatus} onClose={() => setShowCreate(false)} teamId={""}/>}
      {showUpdateProject && <UpdateProjectModal project={project} onClose={()=>setShowUpdateProject(false)}/>}
    </>
  );
}