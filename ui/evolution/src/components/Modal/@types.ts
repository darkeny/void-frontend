export interface IModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
