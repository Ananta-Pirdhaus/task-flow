export type TaskType = {
  id: number;
  type: string;
  created_at: string;
  updated_at: string;
};

export type Tag = {
  id: string;
  task_id: string;
  title: string;
  color: string; // 'color' instead of 'bg' and 'text' as in the response
};

export type TaskT = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  task_type: TaskType; // Task type with details
  task_type_id: number; // Corresponding task type ID
  startDate: string;
  endDate: string;
  startTime: string;
  endTime?: string;
  image?: string | null; // image can be null as per response
  alt?: string | null; // alt can be null as per response
  progress: number;
  created_at: string; // Timestamp of when the task was created
  updated_at: string; // Timestamp of when the task was last updated
  user_id: number; // User associated with the task
  tags: Tag[]; // Updated tag structure
};

type Column = {
  name: string;
  items: TaskT[];
};

export type Columns = {
  [key: string]: Column;
};
