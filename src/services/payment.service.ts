import api from './api'

export interface PaymentLink {
  id: string
  amount: number
  patientName?: string
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
  patientName?: string
  description?: string
}

export interface InitiatePaymentData {
  installmentPlan: string
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
      installmentAmount: number
      installmentNumber: number
      totalInstallments: number
    }
  },

  verifyTransaction: async (transactionRef: string) => {
    const res = await api.post('/transactions/verify', { transactionRef })
    return res.data
  },
}
