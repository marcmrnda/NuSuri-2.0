import { createContext } from "react";

type ModalContextType = {
  modalVisible: boolean;
  toggleModal: () => void;
};

// default values
export const ModalContext = createContext<ModalContextType>({
  modalVisible: false,
  toggleModal: () => {}
});
