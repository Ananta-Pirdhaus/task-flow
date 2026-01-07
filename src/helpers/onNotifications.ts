// ToastProvider.ts
import { ToastContainer, ToastContainerProps } from "react-toastify"; // Mengimpor ToastContainer dan tipe props yang benar
import "react-toastify/dist/ReactToastify.css";

// Komponen tidak menggunakan JSX, kita perlu menggunakan fungsi biasa dan mengembalikan komponen sebagai fungsi
const ToastProvider = (props: ToastContainerProps): JSX.Element => {
  // Menggunakan ToastContainerProps untuk props
  return ToastContainer(props); // Mengembalikan ToastContainer dengan props
};

export default ToastProvider;
