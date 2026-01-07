/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { Columns } from "../types";
import { getRandomColors } from "../helpers/getRandomColors";
import { axiosInstance } from "../lib/axios";

// Definisi objek Board yang sudah dikosongkan
export const Board: Columns = {
  backlog: {
    name: "Backlog",
    items: [], // Mengosongkan item backlog
  },
  pending: {
    name: "Pending",
    items: [], // Mengosongkan item pending
  },
  todo: {
    name: "To Do",
    items: [], // Mengosongkan item todo
  },
  doing: {
    name: "Doing",
    items: [], // Mengosongkan item doing
  },
  done: {
    name: "Done",
    items: [], // Mengosongkan item done
  },
};

// Menyimpan Board yang sudah dikosongkan ke Local Storage
localStorage.setItem("taskBoard", JSON.stringify(Board));

// Mengambil data dari Local Storage dan mengonversinya kembali ke objek JavaScript
const savedBoard = localStorage.getItem("taskBoard");
if (savedBoard) {
  const boardData = JSON.parse(savedBoard);
  console.log(boardData); // Menampilkan data yang diambil dari Local Storage setelah dikosongkan
}

// Fungsi untuk mengambil data task dari API
async function fetchTasks() {
  try {
    const response = await axiosInstance.get("/task");

    // Mengecek jika status true
    if (response.data.status) {
      const tasks = response.data.data; // Mengambil array data task
      console.log("Tasks berhasil diambil:", tasks);

      // Mengelompokkan tasks ke dalam Board berdasarkan status
      tasks.forEach((task: any) => {
        const taskItem = {
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          startDate: task.startDate,
          endDate: task.endDate,
          progress: task.progress,
          tags: task.tags,
        };

        // Mengelompokkan task ke kolom yang sesuai
        if (task.progress < 50) {
          Board.todo.items.push(taskItem); // Jika progress < 50, masukkan ke kolom 'To Do'
        } else if (task.progress >= 50 && task.progress < 100) {
          Board.doing.items.push(taskItem); // Jika progress antara 50-99, masukkan ke kolom 'Doing'
        } else {
          Board.done.items.push(taskItem); // Jika progress 100, masukkan ke kolom 'Done'
        }
      });

      // Menyimpan perubahan Board ke Local Storage
      localStorage.setItem("taskBoard", JSON.stringify(Board));

      console.log("Updated Board:", Board); // Menampilkan Board yang telah diperbarui dengan tasks
    } else {
      console.log("Gagal mengambil tasks:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Memanggil fetchTasks untuk mengambil data dan memperbarui Board
fetchTasks();
