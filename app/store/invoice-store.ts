import { create } from 'zustand';
import { DEFAULT_INVOICE } from '@/lib/constants';
import { validators } from '@/lib/validators';
import { InvoiceData } from '@/types/invoice';

type ReceiverField = 'name' | 'email' | 'address' | 'taxId';
type ReceiverKey = 'receiverName' | 'receiverEmail' | 'receiverAddress' | 'receiverTaxId';
type EditableItemField = 'description' | 'quantity' | 'price';

const RECEIVER_FIELD_MAP: Record<ReceiverField, ReceiverKey> = {
  name: 'receiverName',
  email: 'receiverEmail',
  address: 'receiverAddress',
  taxId: 'receiverTaxId',
};

interface InvoiceStore {
  invoiceData: InvoiceData;
  isMobilePreviewOpen: boolean;
  isAiOptimizing: boolean;
  setInvoice: (data: InvoiceData) => void;
  setIsMobilePreviewOpen: (isOpen: boolean) => void;
  setIsAiOptimizing: (isLoading: boolean) => void;
  updateEmitterField: <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => void;
  updateReceiverField: (field: ReceiverField, value: string) => void;
  updateItemField: (itemId: string, field: EditableItemField, value: string | number) => void;
  addItem: () => void;
  removeItem: (itemId: string) => void;
  setIssueDate: (value: string) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoiceData: DEFAULT_INVOICE,
  isMobilePreviewOpen: false,
  isAiOptimizing: false,

  setInvoice: (data) => set({ invoiceData: data }),
  setIsMobilePreviewOpen: (isOpen) => set({ isMobilePreviewOpen: isOpen }),
  setIsAiOptimizing: (isLoading) => set({ isAiOptimizing: isLoading }),

  updateEmitterField: (field, value) =>
    set((state) => ({
      invoiceData: {
        ...state.invoiceData,
        [field]: value,
      },
    })),

  updateReceiverField: (field, value) => {
    const receiverKey = RECEIVER_FIELD_MAP[field];

    set((state) => ({
      invoiceData: {
        ...state.invoiceData,
        [receiverKey]: value,
      },
    }));
  },

  updateItemField: (itemId, field, value) => {
    let finalValue: string | number = value;

    if (field === 'description') {
      finalValue = String(value);
    }

    if (field === 'quantity') {
      const parsed = Number.parseFloat(String(value));
      finalValue = Number.isNaN(parsed) || parsed < 0 ? 1 : Math.max(1, Math.floor(parsed));
    }

    if (field === 'price') {
      const parsed = Number.parseFloat(String(value));
      finalValue = Number.isNaN(parsed) || parsed < 0 ? 0 : validators.normalizePrice(parsed);
    }

    set((state) => ({
      invoiceData: {
        ...state.invoiceData,
        items: state.invoiceData.items.map((item) => {
          if (item.id !== itemId) {
            return item;
          }

          if (field === 'description') {
            return { ...item, description: String(finalValue) };
          }

          if (field === 'quantity') {
            return { ...item, quantity: Number(finalValue) };
          }

          return { ...item, price: Number(finalValue) };
        }),
      },
    }));
  },

  addItem: () =>
    set((state) => ({
      invoiceData: {
        ...state.invoiceData,
        items: [
          ...state.invoiceData.items,
          {
            id: Date.now().toString(),
            description: '',
            quantity: 1,
            price: 0,
          },
        ],
      },
    })),

  removeItem: (itemId) =>
    set((state) => {
      if (state.invoiceData.items.length === 1) {
        return state;
      }

      return {
        invoiceData: {
          ...state.invoiceData,
          items: state.invoiceData.items.filter((item) => item.id !== itemId),
        },
      };
    }),

  setIssueDate: (value) =>
    set((state) => {
      const adjustedDueDate = state.invoiceData.dueDate < value ? value : state.invoiceData.dueDate;

      return {
        invoiceData: {
          ...state.invoiceData,
          issueDate: value,
          dueDate: adjustedDueDate,
        },
      };
    }),
}));
