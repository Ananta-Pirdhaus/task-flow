export type Tag = {
  id: string;
  title: string;
  color: string;
};

export type Project = {
  id: string;
  name: string;
  createdAt: string;
};



export type TaskT = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  project: Project | null;
  taskType: "backlog" | "inprogress" | "done"; // camelCase

  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;

  image: string | null;
  alt: string | null;

  progress: number;
  userId: number;

  createdAt: string;
  updatedAt: string;

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
