export const generateWhatsAppLink = (paymentUrl: string, hospitalName: string, amount: number): string => {
  const amountFormatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount)

  const message = `Hello! ${hospitalName} has sent you a payment link for your healthcare treatment.\n\n💊 Total Amount: ${amountFormatted}\n\nYou can pay in easy installments. Click the link below to get started:\n\n${paymentUrl}\n\n_Powered by CareNow PayLater — Get treated now, pay later!_`

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}
