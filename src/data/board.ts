import { Columns } from "../types/task";

/**
 * Initial Board Structure
 * Digunakan sebagai default / fallback
 * BUKAN sebagai state utama
 */
export const initialBoard: Columns = {
  backlog: {
    name: "Backlog",
    items: [],
  },
  inprogress: {
    name: "Doing",
    items: [],
  },
  done: {
    name: "Done",
    items: [],
  },
};
