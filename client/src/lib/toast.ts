import { toast, type ToastOptions } from 'react-toastify'

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3200,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
}

export function showSuccessToast(message: string, options?: ToastOptions) {
  toast.success(message, { ...defaultOptions, ...options })
}

export function showErrorToast(message: string, options?: ToastOptions) {
  toast.error(message, { ...defaultOptions, ...options })
}
