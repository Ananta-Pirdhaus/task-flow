export type Tag = {
  id: string;
  title: string;
  color: string;
};

export type TaskT = {
  id: string; // UUID
  title: string;
  description: string;
  priority: "high" | "medium" | "low";

  task_type: "backlog" | "inprogress" | "done"; // STRING dari backend

  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;

  image: string | null;
  alt: string | null;

  progress: number;
  user_id: number;

  created_at: string;
  updated_at: string;

  tags: Tag[];
};

// Alias
export type TaskData = TaskT;

export type Column = {
  name: string;
  items: TaskT[];
};

export type Columns = {
  backlog: Column;
  inprogress: Column;
  done: Column;
};
