import { MenuItems, MenuItem } from "@headlessui/react";
import React from "react";
import { TaskT, Columns } from "../../types"; // Adjust the import according to your file structure

const fetchHighPriorityTasks = (): Columns | null => {
  const data = localStorage.getItem("taskBoard");
  if (data) {
    const taskBoard = JSON.parse(data);

    // Filter to only high-priority tasks in each column
    const highPriorityTasks = Object.keys(taskBoard).reduce(
      (acc, columnKey) => {
        const column = taskBoard[columnKey];
        const highPriorityItems = column.items.filter(
          (item) => item.priority === "high"
        );
        if (highPriorityItems.length > 0) {
          acc[columnKey] = { ...column, items: highPriorityItems };
        }
        return acc;
      },
      {}
    );

    return highPriorityTasks;
  }
  return null;
};

export const NotificationMenuItems: React.FC = () => {
  const taskBoard = fetchHighPriorityTasks();

  // Flattening notifications from task board
  const notifications = taskBoard
    ? Object.values(taskBoard).flatMap((column) =>
        column.items.map((task) => ({
          id: task.id,
          message: task.title,
          icon: "📌", // Set the icon as specified
          link: `#`, // or link to task details
          description: task.description, // Add description
          date: task.startDate, // Example of using start date; you can change it as needed
        }))
      )
    : [];

  return (
    <MenuItems
      transition
      className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    >
      <div className="py-1 px-4">
        <h3 className="text-xs font-semibold text-gray-500">NOTIFICATIONS</h3>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem key={notification.id} as="div" className="py-3">
              <a
                href={notification.link}
                className="flex items-start gap-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg p-2"
              >
                <span className="text-xl">{notification.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold">{notification.message}</p>
                  <p className="text-gray-500 text-xs">
                    {notification.description}
                  </p>
                  <p className="text-gray-400 text-xs">{notification.date}</p>
                </div>
              </a>
            </MenuItem>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-gray-500">
            No notifications available
          </div>
        )}
      </div>
    </MenuItems>
  );
};
