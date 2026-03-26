import api from './api'

export interface PaymentLink {
  id: string
  amount: number
  patientName?: string
  patientContact?: string
  description?: string
  status: 'PENDING' | 'PARTIAL' | 'PAID'
  createdAt: string
  linkUrl: string
  hospital: string
  transactions?: Transaction[]
  amountPaid?: number
  amountRemaining?: number
}

export interface Transaction {
  id: string
  paymentLinkId: string
  amount: number
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  transactionRef?: string
  installment: number
  createdAt: string
}

export interface CreatePaymentLinkData {
  amount: number
  patientContact: string
  patientName?: string
  description?: string
}

export interface InitiatePaymentData {
  amount: number
  patientEmail?: string
  patientName?: string
}

export const paymentService = {
  createLink: async (data: CreatePaymentLinkData) => {
    const res = await api.post('/payment-links', data)
    return res.data as { paymentLink: PaymentLink; message: string }
  },

  getLinks: async () => {
    const res = await api.get('/payment-links')
    return res.data as { paymentLinks: PaymentLink[] }
  },

  getLinkById: async (id: string) => {
    const res = await api.get(`/payment-links/${id}`)
    return res.data as PaymentLink
  },

  initiatePayment: async (id: string, data: InitiatePaymentData) => {
    const res = await api.post(`/payment-links/${id}/pay`, data)
    return res.data as {
      paymentUrl: string
      transactionRef: string
      formParams?: Record<string, string>
      checkoutScriptUrl?: string
      installmentAmount: number
      installmentNumber: number
    }
  },

  verifyTransaction: async (transactionRef: string) => {
    const res = await api.post('/transactions/verify', { transactionRef })
    return res.data
  },
}
