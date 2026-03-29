import { X } from 'lucide-react'

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

const Modal = ({ title, onClose, children }: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative z-10 w-full max-w-lg bg-card rounded-2xl orbit-shadow border border-border">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
)

export default Modal
